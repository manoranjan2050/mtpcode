"""Generates promo banners for Facebook / Instagram / WhatsApp Status:
- social-story.png (1080x1920) — WhatsApp Status, Instagram/Facebook Story
- social-square.png (1080x1080) — Facebook/Instagram feed post

Matches the existing brand assets in public/assets/images/brand/
(near-black background, orange->pink->purple "M" mark, soft glow orbs)
rather than the site's blue/purple/cyan theme, so this fits the same
Facebook/YouTube presence already published.
"""
import math
import os

import qrcode
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAND_DIR = os.path.join(ROOT, "public", "assets", "images", "brand")
APPS_DIR = os.path.join(ROOT, "public", "assets", "images", "apps")
OUT_DIR = os.path.join(ROOT, "public", "assets", "images", "brand")

FONT_DIR = r"C:\Windows\Fonts"
BG = (8, 8, 13)
GLOW_ORANGE = (247, 148, 29)
GLOW_PURPLE = (124, 58, 237)
WHITE = (255, 255, 255)
MUTED = (160, 168, 184)

APPS = [
    ("calc2pay", "Calc2Pay"),
    ("thermaldesk", "ThermalDesk"),
    ("denomiq", "Denomiq"),
    ("doczest", "DocZest"),
    ("idphotocraft", "IDPhotoCraft"),
    ("smart-sip-calculator", "Smart SIP"),
    ("geo-camera", "Geo Camera"),
]

URL = "https://mtpcode.com/app"


def font(name, size):
    return ImageFont.truetype(os.path.join(FONT_DIR, name), size)


def extract_on_black(path, threshold=32):
    """The saved brand logo PNGs have a solid near-black background baked in;
    key it out to transparent so the mark can sit on our own background."""
    im = Image.open(path).convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r < threshold and g < threshold and b < threshold:
                px[x, y] = (r, g, b, 0)
    return im


def soft_glow(w, h, cx, cy, r, color, alpha=90):
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*color, alpha))
    return layer.filter(ImageFilter.GaussianBlur(r * 0.5))


def rounded_icon(path, size, radius):
    im = Image.open(path).convert("RGBA").resize((size, size), Image.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size, size], radius=radius, fill=255)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(im, (0, 0), mask)
    return out


def make_qr(url, box_size=10, border=2):
    qr = qrcode.QRCode(border=border, box_size=box_size, error_correction=qrcode.constants.ERROR_CORRECT_M)
    qr.add_data(url)
    qr.make(fit=True)
    return qr.make_image(fill_color="black", back_color="white").convert("RGBA")


def base_canvas(w, h):
    img = Image.new("RGBA", (w, h), (*BG, 255))
    img.alpha_composite(soft_glow(w, h, int(w * 0.1), int(h * 0.06), int(w * 0.42), GLOW_ORANGE, 70))
    img.alpha_composite(soft_glow(w, h, int(w * 0.92), int(h * 0.94), int(w * 0.48), GLOW_PURPLE, 70))
    return img


def draw_logo_lockup(img, draw, cx_left, y, mark_size):
    mark = extract_on_black(os.path.join(BRAND_DIR, "mtpcode-youtube-logo-1024.png"))
    mark = mark.resize((mark_size, mark_size), Image.LANCZOS)
    img.alpha_composite(mark, (cx_left, y))
    return cx_left + mark_size


def app_grid(img, draw, apps, top_y, area_w, margin, icon, gap, cols, name_font):
    rows = math.ceil(len(apps) / cols)
    grid_w = cols * icon + (cols - 1) * gap
    start_x = margin + (area_w - grid_w) // 2
    for i, (slug, name) in enumerate(apps):
        col, row = i % cols, i // cols
        x = start_x + col * (icon + gap)
        y = top_y + row * (icon + gap + 46)
        badge = rounded_icon(os.path.join(APPS_DIR, slug, "logo.png"), icon, int(icon * 0.24))
        img.alpha_composite(badge, (x, y))
        tb = draw.textbbox((0, 0), name, font=name_font)
        tw = tb[2] - tb[0]
        draw.text((x + icon // 2 - tw // 2, y + icon + 10), name, font=name_font, fill=MUTED)
    return top_y + rows * (icon + gap + 46) - 46


def cta_pill(img, draw, cx, y, text, font_bold, pad_x=34, pad_y=18):
    tb = draw.textbbox((0, 0), text, font=font_bold)
    tw, th = tb[2] - tb[0], tb[3] - tb[1]
    w, h = tw + pad_x * 2, th + pad_y * 2
    x0 = cx - w // 2
    pill = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    pd = ImageDraw.Draw(pill)
    pd.rounded_rectangle([0, 0, w, h], radius=h // 2, fill=(255, 255, 255, 255))
    img.alpha_composite(pill, (x0, y))
    pd2 = ImageDraw.Draw(img)
    pd2.text((cx - tw // 2, y + pad_y - tb[1]), text, font=font_bold, fill=(10, 10, 15))
    return y + h


def render_story():
    w, h = 1080, 1920
    img = base_canvas(w, h)
    draw = ImageDraw.Draw(img)
    margin = 80

    title_f = font("segoeuib.ttf", 92)
    tagline_f = font("segoeui.ttf", 34)
    headline_f = font("segoeuib.ttf", 54)
    name_f = font("segoeui.ttf", 26)
    cta_f = font("segoeuib.ttf", 40)
    small_f = font("segoeui.ttf", 30)

    mark_size = 120
    logo_right = draw_logo_lockup(img, draw, margin, 110, mark_size)
    draw.text((logo_right + 28, 110 + mark_size // 2 - 55), "MTPCode", font=title_f, fill=WHITE)

    y = 110 + mark_size + 50
    draw.text((margin, y), "Building Powerful Software,", font=tagline_f, fill=MUTED)
    draw.text((margin, y + 44), "Mobile Apps & Digital Solutions", font=tagline_f, fill=MUTED)

    y += 150
    draw.text((margin, y), f"{len(APPS)} Apps. One Link.", font=headline_f, fill=WHITE)

    y += 110
    bottom = app_grid(img, draw, APPS, y, w - margin * 2, margin, icon=190, gap=44, cols=3, name_font=name_f)

    qr = make_qr(URL, box_size=9, border=2).resize((300, 300))
    qr_frame = Image.new("RGBA", (332, 332), (255, 255, 255, 255))
    ImageDraw.Draw(qr_frame).rounded_rectangle([0, 0, 331, 331], radius=24, fill=(255, 255, 255, 255))
    qr_frame.paste(qr, (16, 16))
    qr_y = bottom + 60
    img.alpha_composite(qr_frame, (w // 2 - 166, qr_y))

    draw.text((w // 2, qr_y + 350), "Scan to get all my apps", font=small_f, fill=MUTED, anchor="mm")

    pill_y = qr_y + 400
    cta_pill(img, draw, w // 2, pill_y, "mtpcode.com/app", cta_f)

    img.convert("RGB").save(os.path.join(OUT_DIR, "social-story.png"), "PNG")
    print("Saved social-story.png", img.size)


def render_square():
    w, h = 1080, 1080
    img = base_canvas(w, h)
    draw = ImageDraw.Draw(img)
    margin = 70
    top = 130

    title_f = font("segoeuib.ttf", 68)
    tagline_f = font("segoeui.ttf", 28)
    headline_f = font("segoeuib.ttf", 42)
    name_f = font("segoeui.ttf", 22)
    cta_f = font("segoeuib.ttf", 34)

    mark_size = 92
    logo_right = draw_logo_lockup(img, draw, margin, top, mark_size)
    draw.text((logo_right + 24, top + mark_size // 2 - 42), "MTPCode", font=title_f, fill=WHITE)

    y = top + mark_size + 34
    draw.text((margin, y), "Building Powerful Software, Mobile Apps & Digital Solutions", font=tagline_f, fill=MUTED)

    y += 70
    draw.text((margin, y), f"{len(APPS)} Apps. One Link.", font=headline_f, fill=WHITE)

    y += 80
    bottom = app_grid(img, draw, APPS, y, w - margin * 2, margin, icon=140, gap=34, cols=4, name_font=name_f)

    pill_y = bottom + 50
    cta_pill(img, draw, w // 2, pill_y, "mtpcode.com/app", cta_f)

    img.convert("RGB").save(os.path.join(OUT_DIR, "social-square.png"), "PNG")
    print("Saved social-square.png", img.size)


if __name__ == "__main__":
    render_story()
    render_square()
