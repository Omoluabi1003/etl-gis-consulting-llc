/* Native, texture-mapped Earth. No GIS application, network services or CSS spin. */
(function (root) {
  'use strict';
  const RAD = Math.PI / 180;
  function project(lon, lat, centerLon, centerLat) {
    const delta = (lon - centerLon) * RAD, a = lat * RAD, b = centerLat * RAD;
    return {
      x: Math.cos(a) * Math.sin(delta),
      y: Math.sin(a) * Math.cos(b) - Math.cos(a) * Math.cos(delta) * Math.sin(b),
      z: Math.sin(a) * Math.sin(b) + Math.cos(a) * Math.cos(delta) * Math.cos(b),
    };
  }
  if (typeof module !== 'undefined' && module.exports) { module.exports = { project }; return; }
  const dayURL = 'assets/images/earth/day-2048.webp';
  const nightURL = 'assets/images/earth/night-1024.webp';
  function image(url) {
    return new Promise((resolve, reject) => {
      const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = url;
    });
  }
  const imagery = Promise.all([image(dayURL), image(nightURL).catch(() => null)]);
  const vertex = 'attribute vec2 aPosition; varying vec2 vPosition; void main(){vPosition=aPosition;gl_Position=vec4(aPosition,0.,1.);}';
  const fragment = `precision highp float;
    varying vec2 vPosition;
    uniform sampler2D uDay; uniform sampler2D uNight;
    uniform vec2 uCenter; uniform float uAspect; uniform float uHasNight;
    const float PI=3.14159265359;
    void main(){
      vec2 q=vPosition*vec2(uAspect,1.0); float r=0.81; float d=length(q);
      if(d>r){
        float glow=exp(-(d/r-1.0)*23.0)*0.19;
        gl_FragColor=vec4(0.10,0.49,0.70,glow);return;
      }
      vec3 n=vec3(q/r,sqrt(max(0.0,1.0-dot(q/r,q/r))));
      float cy=cos(uCenter.y),sy=sin(uCenter.y),cx=cos(uCenter.x),sx=sin(uCenter.x);
      float z=n.z*cy-n.y*sy;
      vec3 world=vec3(n.x*cx+z*sx,n.y*cy+n.z*sy,z*cx-n.x*sx);
      vec2 uv=vec2(atan(world.x,world.z)/(2.0*PI)+0.5,0.5-asin(clamp(world.y,-1.0,1.0))/PI);
      vec3 day=texture2D(uDay,uv).rgb;
      vec3 night=texture2D(uNight,uv).rgb*uHasNight;
      float light=dot(n,normalize(vec3(-0.65,0.48,0.85)));
      float daylight=smoothstep(-0.12,0.26,light);
      vec3 color=mix(vec3(0.006,0.019,0.045)+night*0.8,day*(0.30+0.76*max(light,0.0)),daylight);
      float rim=pow(1.0-n.z,3.2);
      color+=vec3(0.09,0.33,0.48)*rim*daylight;
      float edge=1.0-smoothstep(r-0.003,r,d);
      gl_FragColor=vec4(color,edge);
    }`;
  function webgl(canvas, day, night) {
    const gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power', premultipliedAlpha: false });
    if (!gl) throw new Error('WebGL unavailable');
    function shader(type, source) {
      const result = gl.createShader(type); gl.shaderSource(result, source); gl.compileShader(result);
      if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) throw new Error('Globe shader unavailable');
      return result;
    }
    const program = gl.createProgram();
    gl.attachShader(program, shader(gl.VERTEX_SHADER, vertex)); gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragment)); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Globe renderer unavailable');
    gl.useProgram(program);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const attr = gl.getAttribLocation(program, 'aPosition'); gl.enableVertexAttribArray(attr); gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0);
    [day, night || day].forEach((img, index) => {
      gl.activeTexture(gl.TEXTURE0 + index); gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(gl.getUniformLocation(program, index ? 'uNight' : 'uDay'), index);
    });
    gl.uniform1f(gl.getUniformLocation(program, 'uHasNight'), night ? 1 : 0);
    const center = gl.getUniformLocation(program, 'uCenter'), aspect = gl.getUniformLocation(program, 'uAspect');
    return (lon, lat) => {
      gl.viewport(0, 0, canvas.width, canvas.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(center, lon * RAD, lat * RAD); gl.uniform1f(aspect, canvas.width / canvas.height); gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
  }
  // Static, mathematically projected satellite imagery for browsers without WebGL.
  function fallback(canvas, day) {
    const source = document.createElement('canvas'); source.width = day.width; source.height = day.height;
    const sc = source.getContext('2d'); sc.drawImage(day, 0, 0);
    const pixels = sc.getImageData(0, 0, day.width, day.height).data;
    const ctx = canvas.getContext('2d');
    return (lon, lat) => {
      const w = canvas.width, h = canvas.height, r = h * .405, output = ctx.createImageData(w, h);
      const a = lon * RAD, b = lat * RAD;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const nx = (x - w / 2) / r, ny = (h / 2 - y) / r, length = nx * nx + ny * ny;
        if (length >= 1) continue;
        const nz = Math.sqrt(1 - length), z = nz * Math.cos(b) - ny * Math.sin(b);
        const wy = ny * Math.cos(b) + nz * Math.sin(b), wx = nx * Math.cos(a) + z * Math.sin(a), wz = z * Math.cos(a) - nx * Math.sin(a);
        const u = Math.max(0, Math.min(day.width - 1, Math.floor((Math.atan2(wx, wz) / (2 * Math.PI) + .5) * day.width)));
        const v = Math.max(0, Math.min(day.height - 1, Math.floor((.5 - Math.asin(wy) / Math.PI) * day.height)));
        const from = (v * day.width + u) * 4, to = (y * w + x) * 4, shade = .32 + .68 * Math.max(0, (-.55 * nx + .4 * ny + .73 * nz));
        for (let c = 0; c < 3; c++) output.data[to + c] = pixels[from + c] * shade;
        output.data[to + 3] = 255;
      }
      ctx.putImageData(output, 0, 0);
    };
  }
  document.querySelectorAll('[data-earth-globe]').forEach(async (host) => {
    let canvas = host.querySelector('canvas'), draw = null, visible = false, frame = 0, previous = 0;
    let lon = Number(host.dataset.longitude), lat = Number(host.dataset.latitude), paused = false, drag = null;
    const motion = root.matchMedia('(prefers-reduced-motion: reduce)');
    const still = host.dataset.static === 'true';
    const button = host.closest('figure')?.querySelector('.earth-motion');
    const marker = host.querySelector('.earth-marker');
    function setPaused(value) {
      paused = value; host.dataset.paused = String(value || motion.matches || still);
      if (button) { button.textContent = value ? 'Resume globe' : 'Pause globe'; button.setAttribute('aria-pressed', String(value)); }
      schedule();
    }
    function render() {
      if (!draw) return;
      draw(lon, lat); host.dataset.rotation = lon.toFixed(3);
      if (marker) {
        const point = project(-80.36, 27.29, lon, lat);
        marker.hidden = point.z < .18;
        marker.style.left = `${50 + point.x * 40.5 * host.clientHeight / host.clientWidth}%`;
        marker.style.top = `${50 - point.y * 40.5}%`;
      }
    }
    function animate(now) {
      frame = 0;
      if (!visible || document.hidden || paused || still || motion.matches || host.dataset.renderer !== 'webgl') return;
      if (previous && now - previous >= 32) { lon += Math.min(now - previous, 100) * .0011; previous = now; render(); }
      else if (!previous) previous = now;
      frame = requestAnimationFrame(animate);
    }
    function schedule() {
      cancelAnimationFrame(frame); frame = 0; previous = 0;
      host.dataset.paused = String(paused || still || motion.matches);
      if (draw && visible && !document.hidden && !paused && !still && !motion.matches && host.dataset.renderer === 'webgl') frame = requestAnimationFrame(animate);
    }
    function resize() {
      const ratio = host.dataset.renderer === 'fallback' ? .8 : Math.min(root.devicePixelRatio || 1, 1.7);
      canvas.width = Math.max(1, Math.round(host.clientWidth * ratio)); canvas.height = Math.max(1, Math.round(host.clientHeight * ratio)); render();
    }
    button?.addEventListener('click', () => setPaused(!paused));
    host.addEventListener('pointerdown', (event) => {
      if (still || event.button !== 0) return;
      drag = { x: event.clientX, y: event.clientY, lon, lat }; setPaused(true); host.setPointerCapture(event.pointerId);
    });
    host.addEventListener('pointermove', (event) => {
      if (!drag) return;
      lon = drag.lon - (event.clientX - drag.x) * .24;
      lat = Math.max(-65, Math.min(65, drag.lat + (event.clientY - drag.y) * .16)); render();
    });
    ['pointerup', 'pointercancel'].forEach((event) => host.addEventListener(event, () => { drag = null; }));
    host.addEventListener('keydown', (event) => {
      if (still || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return;
      event.preventDefault(); setPaused(true);
      if (event.key === 'Home') { lon = Number(host.dataset.longitude); lat = Number(host.dataset.latitude); }
      else if (event.key === 'ArrowLeft') lon -= 8;
      else if (event.key === 'ArrowRight') lon += 8;
      else lat = Math.max(-65, Math.min(65, lat + (event.key === 'ArrowUp' ? 6 : -6)));
      render();
    });
    motion.addEventListener('change', schedule);
    document.addEventListener('visibilitychange', schedule);
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; host.dataset.visible = String(visible); if (visible) render(); schedule(); }, { threshold: .05 }).observe(host);
    new ResizeObserver(resize).observe(host);
    try {
      const [day, night] = await imagery;
      function useFallback() {
        cancelAnimationFrame(frame);
        const next = document.createElement('canvas');
        for (const attr of canvas.attributes) next.setAttribute(attr.name, attr.value);
        canvas.replaceWith(next); canvas = next; host.dataset.renderer = 'fallback'; draw = fallback(canvas, day); resize();
        if (button) button.hidden = true;
      }
      try { draw = webgl(canvas, day, night); host.dataset.renderer = 'webgl'; }
      catch { useFallback(); }
      canvas.addEventListener('webglcontextlost', (event) => { event.preventDefault(); useFallback(); });
      resize(); host.dataset.ready = 'true'; schedule();
    } catch { host.dataset.ready = 'failed'; canvas.hidden = true; if (button) button.hidden = true; }
  });
})(typeof window !== 'undefined' ? window : globalThis);
