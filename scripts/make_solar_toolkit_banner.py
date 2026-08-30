"""Generates the Solar Installer Toolkit marketing images:
- banner.png (1024x500) — Play Store feature graphic + website hero banner
- card.jpg (1280x720) — Apps listing card thumbnail
Matches the app's actual launcher icon design (dark navy #1B2430
background, orange #F7A600 sun mark).
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import os

BG_TOP = (18, 24, 34)
BG_BOTTOM = (10, 14, 22)
ACCENT = (247, 166, 0)
WHITE = (255, 255, 255)
MUTED = (170, 182, 199)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCREENSHOT = r"D:\My Project\Android\SolarInstallerToolkit\store\screenshots\03_pv_system.png"
ASSET_DIR = os.path.join(ROOT, "public", "assets", "images", "apps", "solar-installer-toolkit")

FONT_DIR = r"C:\Windows\Fonts"


def font(name, size):
    return ImageFont.truetype(os.path.join(FONT_DIR, name), size)


def vertical_gradient(w, h, top, bottom):
    base = Image.new("RGB", (w, h), top)
    draw = ImageDraw.Draw(base)
    for y in range(h):
        t = y / (h - 1)
        r = int(top[0] + (bottom[0] - top[0]) * t)
        g = int(top[1] + (bottom[1] - top[1]) * t)
        b = int(top[2] + (bottom[2] - top[2]) * t)
        draw.line([(0, y), (w, y)], fill=(r, g, b))
    return base


def draw_sun(draw, cx, cy, r, color):
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)
    ray_len = r * 0.55
    ray_gap = r * 0.35
    for i in range(8):
        ang = math.radians(i * 45)
        inner = r + ray_gap
        outer = inner + ray_len
        perp = math.radians(i * 45 + 90)
        half_w = r * 0.16
        p1 = (cx + math.cos(ang) * inner, cy + math.sin(ang) * inner)
        p2 = (cx + math.cos(ang) * outer, cy + math.sin(ang) * outer)
        dx, dy = math.cos(perp) * half_w, math.sin(perp) * half_w
        pts = [(p1[0] + dx, p1[1] + dy), (p2[0], p2[1]), (p1[0] - dx, p1[1] - dy)]
        draw.polygon(pts, fill=color)


def render(w, h, scale, out_path, fmt="PNG"):
    """scale lets the same composition target different canvas sizes proportionally."""
    img = vertical_gradient(w, h, BG_TOP, BG_BOTTOM)

    watermark = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    wm_draw = ImageDraw.Draw(watermark)
    draw_sun(wm_draw, int(w * 0.88), int(h * 0.18), int(70 * scale), (247, 166, 0, 28))
    watermark = watermark.filter(ImageFilter.GaussianBlur(0.5))
    img.paste(watermark, (0, 0), watermark)

    draw = ImageDraw.Draw(img)

    step = int(90 * scale)
    diag = int(220 * scale)
    for i in range(-2, int(w / step) + 3):
        x0 = i * step
        draw.line([(x0, h), (x0 + diag, h - diag)], fill=(247, 166, 0, 18), width=max(1, int(2 * scale)))

    margin = int(56 * scale)
    sun_r = int(40 * scale)
    sun_cx, sun_cy = margin + sun_r + int(6 * scale), int(108 * scale)
    draw_sun(draw, sun_cx, sun_cy, sun_r, ACCENT)

    title_font = font("segoeuib.ttf", int(54 * scale))
    tagline_font = font("segoeui.ttf", int(24 * scale))
    brand_font = font("segoeuib.ttf", int(18 * scale))

    title_y = int(168 * scale)
    line_gap = int(62 * scale)
    draw.text((margin, title_y), "Solar Installer", font=title_font, fill=WHITE)
    draw.text((margin, title_y + line_gap), "Toolkit", font=title_font, fill=ACCENT)

    tagline_y = title_y + int(150 * scale)
    draw.text((margin, tagline_y), "Solar Installation  \u2022  Testing  \u2022  Commissioning", font=tagline_font, fill=MUTED)

    rule_y = tagline_y + int(56 * scale)
    draw.line([(margin, rule_y), (margin + int(90 * scale), rule_y)], fill=ACCENT, width=max(2, int(3 * scale)))
    draw.text((margin, rule_y + int(14 * scale)), "M T P   C O D E", font=brand_font, fill=(200, 210, 222))

    phone_w = int(300 * scale)
    phone_h = int(460 * scale)
    phone_x = w - phone_w - int(70 * scale)
    phone_y = (h - phone_h) // 2
    bezel = int(14 * scale)
    corner = int(34 * scale)

    bezel_box = [phone_x - bezel, phone_y - bezel, phone_x + phone_w + bezel, phone_y + phone_h + bezel]
    draw.rounded_rectangle(bezel_box, radius=corner + bezel, fill=(6, 9, 14))
    draw.rounded_rectangle(bezel_box, radius=corner + bezel, outline=(70, 80, 95), width=2)

    shot = Image.open(SCREENSHOT).convert("RGB")
    sw, sh = shot.size
    shot = shot.crop((0, int(sh * 0.035), sw, sh))
    shot_ratio = phone_w / phone_h
    src_w, src_h = shot.size
    src_ratio = src_w / src_h
    if src_ratio > shot_ratio:
        new_w = int(src_h * shot_ratio)
        x0 = (src_w - new_w) // 2
        shot = shot.crop((x0, 0, x0 + new_w, src_h))
    else:
        new_h = int(src_w / shot_ratio)
        shot = shot.crop((0, 0, src_w, new_h))
    shot = shot.resize((phone_w, phone_h), Image.LANCZOS)

    mask = Image.new("L", (phone_w, phone_h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, phone_w, phone_h], radius=corner, fill=255)
    img.paste(shot, (phone_x, phone_y), mask)
    draw.rounded_rectangle([phone_x, phone_y, phone_x + phone_w, phone_y + phone_h], radius=corner, outline=(90, 100, 115), width=2)

    if fmt == "JPEG":
        img.convert("RGB").save(out_path, "JPEG", quality=92)
    else:
        img.convert("RGB").save(out_path, "PNG")
    print("Saved", out_path, img.size)


if __name__ == "__main__":
    # Play Store feature graphic + website hero banner
    render(1024, 500, scale=1.0, out_path=os.path.join(ASSET_DIR, "banner.png"), fmt="PNG")
    # Apps listing card thumbnail (16:9, matches other apps' card.jpg convention)
    render(1280, 720, scale=1.35, out_path=os.path.join(ASSET_DIR, "card.jpg"), fmt="JPEG")
