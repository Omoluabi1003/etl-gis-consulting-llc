"use client";

import { useEffect, useRef } from "react";
import styles from "../page.module.css";

export default function VisualProofs() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#1e3a8a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 90);
    ctx.lineTo(120, 40);
    ctx.lineTo(220, 110);
    ctx.stroke();
    ctx.fillStyle = "#1e3a8a";
    ctx.beginPath();
    ctx.arc(120, 40, 5, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  return (
    <div className={styles.visualGrid}>
      <div className={styles.visualCard}>
        <svg
          viewBox="0 0 240 140"
          role="img"
          aria-label="Compliance control heatmap"
        >
          <rect width="240" height="140" fill="#e2e8f0" />
          <rect x="20" y="20" width="60" height="40" fill="#1e3a8a" />
          <rect x="90" y="20" width="60" height="40" fill="#3b82f6" />
          <rect x="160" y="20" width="60" height="40" fill="#93c5fd" />
          <rect x="20" y="70" width="200" height="40" fill="#0f172a" />
        </svg>
        <div>
          <h3>Control coverage map</h3>
          <p>
            Visualize control inheritance and open findings for every GIS
            component.
          </p>
        </div>
      </div>
      <div className={styles.visualCard}>
        <canvas
          ref={canvasRef}
          width={240}
          height={140}
          aria-label="Risk posture trendline"
          role="img"
        />
        <div>
          <h3>Risk posture trends</h3>
          <p>
            Track residual risk scores, audit evidence, and remediation cadence.
          </p>
        </div>
      </div>
      <div className={styles.visualCard}>
        <svg viewBox="0 0 240 140" role="img" aria-label="Delivery timeline">
          <rect width="240" height="140" fill="#e2e8f0" />
          <line x1="30" y1="70" x2="210" y2="70" stroke="#1e3a8a" strokeWidth="4" />
          <circle cx="60" cy="70" r="8" fill="#3b82f6" />
          <circle cx="120" cy="70" r="8" fill="#3b82f6" />
          <circle cx="180" cy="70" r="8" fill="#3b82f6" />
        </svg>
        <div>
          <h3>Delivery checkpoints</h3>
          <p>
            See milestone readiness with clear go/no-go gates for compliance
            sign-off.
          </p>
        </div>
      </div>
    </div>
  );
}
