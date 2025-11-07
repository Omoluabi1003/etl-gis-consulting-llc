"""Pillow-based procedural imagery generator for GIS case studies.

The module exposes a `generate_all` helper that produces the transit,
utilities, and emergency response scene renders using a shared
configuration pipeline.  The generator intentionally avoids dependencies
on matplotlib or numpy, relying solely on Pillow and the Python standard
library so the assets can be recreated in constrained environments.
"""
from __future__ import annotations

import math
import random
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable, List, Sequence, Tuple

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter

Color = Tuple[int, int, int]


@dataclass
class SkylineBand:
    """Defines a band of skyline geometry composed of rectangular blocks."""

    base_height: int
    variation: int
    count: int
    color: Color


@dataclass
class TransitRibbon:
    """Defines transportation ribbons rendered as bezier-inspired curves."""

    width: int
    color: Color
    jitter: float = 6.0


@dataclass
class IncidentMarker:
    """Defines markers that highlight points of interest in the scene."""

    radius: int
    color: Color
    glow_color: Color


@dataclass
class SceneDefinition:
    name: str
    background: Color
    gradient: Tuple[Color, Color]
    skyline_bands: Sequence[SkylineBand] = field(default_factory=list)
    ribbons: Sequence[TransitRibbon] = field(default_factory=list)
    markers: Sequence[IncidentMarker] = field(default_factory=list)
    palette: Sequence[Color] = field(default_factory=list)

    def output_path(self, output_dir: Path) -> Path:
        return output_dir / f"scene-{self.name}.png"


class SceneGenerator:
    """Generates stylized GIS imagery using layered procedural primitives."""

    def __init__(self, size: Tuple[int, int] = (1600, 900), seed: int | None = None) -> None:
        self.size = size
        self.random = random.Random(seed)

    def generate(self, scene: SceneDefinition) -> Image.Image:
        image = Image.new("RGB", self.size, scene.background)
        draw = ImageDraw.Draw(image)

        self._paint_gradient(draw, scene.gradient)
        self._paint_skyline(image, scene.skyline_bands)
        self._paint_ribbons(image, scene.ribbons)
        self._paint_markers(image, scene.markers)
        image = self._apply_post_effects(image, scene)

        return image

    # Drawing helpers -------------------------------------------------

    def _paint_gradient(self, draw: ImageDraw.ImageDraw, gradient: Tuple[Color, Color]) -> None:
        width, height = self.size
        top, bottom = gradient
        for y in range(height):
            ratio = y / max(height - 1, 1)
            color = tuple(
                int(top[i] + (bottom[i] - top[i]) * ratio)
                for i in range(3)
            )
            draw.line([(0, y), (width, y)], fill=color)

    def _paint_skyline(self, image: Image.Image, bands: Sequence[SkylineBand]) -> None:
        width, height = image.size
        draw = ImageDraw.Draw(image)
        x_cursor = 0
        for band in bands:
            band_height = height - band.base_height
            for _ in range(band.count):
                building_width = self.random.randint(40, 120)
                building_height = band.base_height + self.random.randint(-band.variation, band.variation)
                x1 = x_cursor
                x2 = min(width, x_cursor + building_width)
                y1 = height - building_height
                y2 = height
                draw.rectangle([x1, y1, x2, y2], fill=band.color)
                window_rows = max(3, building_height // 40)
                window_cols = max(2, building_width // 40)
                self._paint_windows(draw, (x1, y1, x2, y2), window_rows, window_cols)
                x_cursor += building_width
                if x_cursor >= width:
                    break
            if x_cursor >= width:
                break

    def _paint_windows(
        self,
        draw: ImageDraw.ImageDraw,
        building: Tuple[int, int, int, int],
        rows: int,
        cols: int,
    ) -> None:
        x1, y1, x2, y2 = building
        margin = 6
        width = x2 - x1 - margin * 2
        height = y2 - y1 - margin * 2
        if width <= 0 or height <= 0:
            return
        col_width = width / cols
        row_height = height / rows
        for row in range(rows):
            for col in range(cols):
                wx1 = x1 + margin + col * col_width + col_width * 0.2
                wy1 = y1 + margin + row * row_height + row_height * 0.2
                wx2 = wx1 + col_width * 0.6
                wy2 = wy1 + row_height * 0.5
                glow = self.random.random() * 0.4 + 0.4
                color = int(200 * glow)
                draw.rounded_rectangle([wx1, wy1, wx2, wy2], radius=3, fill=(color, color, 150))

    def _paint_ribbons(self, image: Image.Image, ribbons: Sequence[TransitRibbon]) -> None:
        width, height = image.size
        for idx, ribbon in enumerate(ribbons):
            layer = Image.new("RGBA", image.size, (0, 0, 0, 0))
            draw = ImageDraw.Draw(layer)
            points = self._ribbon_path(idx, width, height)
            draw.line(points, fill=ribbon.color + (200,), width=ribbon.width, joint="curve")
            blur = layer.filter(ImageFilter.GaussianBlur(radius=ribbon.width * 0.6))
            combined = Image.alpha_composite(layer, blur)
            image.paste(combined.convert("RGB"), mask=combined.split()[-1])

    def _ribbon_path(self, idx: int, width: int, height: int) -> List[Tuple[float, float]]:
        points: List[Tuple[float, float]] = []
        segments = 6
        amplitude = height * 0.15 + idx * 10
        for i in range(segments + 1):
            t = i / segments
            x = t * width
            base_y = height * (0.65 + 0.12 * math.sin(t * math.pi))
            jitter = (self.random.random() - 0.5) * amplitude
            y = base_y + jitter
            points.append((x, y))
        return points

    def _paint_markers(self, image: Image.Image, markers: Sequence[IncidentMarker]) -> None:
        width, height = image.size
        for marker in markers:
            x = self.random.randint(int(width * 0.2), int(width * 0.8))
            y = self.random.randint(int(height * 0.35), int(height * 0.75))
            layer = Image.new("RGBA", image.size, (0, 0, 0, 0))
            draw = ImageDraw.Draw(layer)
            draw.ellipse(
                [
                    (x - marker.radius * 2, y - marker.radius * 2),
                    (x + marker.radius * 2, y + marker.radius * 2),
                ],
                fill=marker.glow_color + (120,),
            )
            draw.ellipse(
                [
                    (x - marker.radius, y - marker.radius),
                    (x + marker.radius, y + marker.radius),
                ],
                fill=marker.color + (255,),
            )
            blurred = layer.filter(ImageFilter.GaussianBlur(radius=marker.radius * 1.8))
            composed = Image.alpha_composite(blurred, layer)
            image.paste(composed.convert("RGB"), mask=composed.split()[-1])

    def _apply_post_effects(self, image: Image.Image, scene: SceneDefinition) -> Image.Image:
        # Add subtle atmospheric haze
        haze = Image.new("RGB", image.size, tuple(int(c * 0.8) for c in scene.gradient[1]))
        haze = haze.filter(ImageFilter.GaussianBlur(radius=18))
        image = ImageChops.blend(image, haze, alpha=0.12)

        # Enhance contrast and apply vignette
        image = ImageEnhance.Contrast(image).enhance(1.08)
        image = self._apply_vignette(image)

        # Add grain using random noise without numpy
        image = self._add_grain(image, strength=12)
        return image

    def _apply_vignette(self, image: Image.Image) -> Image.Image:
        width, height = image.size
        vignette = Image.new("L", image.size, 0)
        draw = ImageDraw.Draw(vignette)
        max_radius = math.sqrt(width ** 2 + height ** 2) / 2
        for i in range(60):
            radius = max_radius * (1 - i / 60)
            alpha = int(255 * (i / 75))
            draw.ellipse(
                [
                    (width / 2 - radius, height / 2 - radius),
                    (width / 2 + radius, height / 2 + radius),
                ],
                outline=alpha,
            )
        vignette = vignette.filter(ImageFilter.GaussianBlur(radius=80))
        vignette = ImageEnhance.Brightness(vignette).enhance(1.4)
        mask = ImageChops.invert(vignette)
        black = Image.new("RGB", image.size, (0, 0, 0))
        return Image.composite(image, black, mask)

    def _add_grain(self, image: Image.Image, strength: int = 10) -> Image.Image:
        width, height = image.size
        noise = Image.effect_noise((width, height), strength)
        noise = noise.convert("RGB")
        return ImageChops.blend(image, noise, 0.06)


SCENES: Tuple[SceneDefinition, ...] = (
    SceneDefinition(
        name="transit",
        background=(9, 14, 34),
        gradient=((13, 24, 58), (4, 9, 20)),
        skyline_bands=(
            SkylineBand(base_height=380, variation=120, count=40, color=(26, 45, 86)),
            SkylineBand(base_height=280, variation=80, count=25, color=(34, 68, 120)),
        ),
        ribbons=(
            TransitRibbon(width=16, color=(95, 209, 255)),
            TransitRibbon(width=12, color=(255, 120, 75)),
        ),
        markers=(
            IncidentMarker(radius=18, color=(255, 208, 67), glow_color=(255, 128, 0)),
            IncidentMarker(radius=16, color=(168, 227, 255), glow_color=(64, 186, 255)),
        ),
    ),
    SceneDefinition(
        name="utilities",
        background=(18, 25, 22),
        gradient=((30, 46, 39), (9, 14, 11)),
        skyline_bands=(
            SkylineBand(base_height=360, variation=100, count=35, color=(40, 76, 63)),
            SkylineBand(base_height=250, variation=60, count=25, color=(60, 104, 92)),
        ),
        ribbons=(
            TransitRibbon(width=18, color=(144, 238, 144)),
            TransitRibbon(width=10, color=(255, 255, 255)),
        ),
        markers=(
            IncidentMarker(radius=20, color=(255, 255, 255), glow_color=(123, 255, 204)),
        ),
    ),
    SceneDefinition(
        name="emergency",
        background=(34, 12, 16),
        gradient=((68, 16, 24), (12, 4, 6)),
        skyline_bands=(
            SkylineBand(base_height=400, variation=130, count=45, color=(90, 26, 36)),
            SkylineBand(base_height=260, variation=70, count=30, color=(140, 40, 48)),
        ),
        ribbons=(
            TransitRibbon(width=14, color=(255, 90, 90)),
            TransitRibbon(width=12, color=(90, 200, 255)),
        ),
        markers=(
            IncidentMarker(radius=24, color=(255, 255, 255), glow_color=(255, 64, 64)),
            IncidentMarker(radius=16, color=(255, 180, 180), glow_color=(255, 105, 105)),
        ),
    ),
)


def generate_all(output_dir: Path | str = "assets/images/generated", seed: int | None = 1337) -> Iterable[Path]:
    """Generate the imagery for all configured scenes."""
    if isinstance(output_dir, str):
        output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    generator = SceneGenerator(seed=seed)
    for scene in SCENES:
        image = generator.generate(scene)
        path = scene.output_path(output_dir)
        image.save(path, format="PNG")
        yield path


def main() -> None:
    for path in generate_all():
        print(f"Generated {path}")


if __name__ == "__main__":
    main()
