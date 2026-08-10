"""Generate public/sitemap.xml (Python fallback when Node is unavailable)."""
from __future__ import annotations

import os
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://mtpcode.com"
OUT = ROOT / "public" / "sitemap.xml"
SKIP_DIRS = {"node_modules", "dist", ".git", "public", "assets", "scripts", "legal"}


def collect_html(dir_path: Path, prefix: str = "") -> list[dict]:
    pages: list[dict] = []
    for name in sorted(os.listdir(dir_path)):
        full = dir_path / name
        if full.is_dir():
            if name in SKIP_DIRS:
                continue
            pages.extend(collect_html(full, f"{prefix}{name}/"))
        elif name.endswith(".html") and name != "404.html":
            pages.append({"path": f"{prefix}{name}", "mtime": full.stat().st_mtime})
    return pages


def loc_for(path: str) -> str:
    return f"{SITE}/" if path == "index.html" else f"{SITE}/{path}"


def meta_for(path: str) -> tuple[str, str]:
    if path == "index.html":
        return "weekly", "1.0"
    if path in {"apps.html", "projects.html", "blog.html", "downloads.html"}:
        return "weekly", "0.9"
    if path.startswith("apps/"):
        return "monthly", "0.8"
    if path.startswith("projects/"):
        return "monthly", "0.7"
    if path.startswith("blog/"):
        return "yearly", "0.6"
    if path in {"privacy.html", "terms.html"}:
        return "yearly", "0.3"
    return "monthly", "0.6"


def main() -> None:
    pages = collect_html(ROOT)
    pages.sort(key=lambda p: (p["path"] != "index.html", p["path"]))
    lines = []
    for p in pages:
        changefreq, priority = meta_for(p["path"])
        lastmod = datetime.fromtimestamp(p["mtime"], tz=timezone.utc).strftime("%Y-%m-%d")
        lines.append(
            f"  <url><loc>{loc_for(p['path'])}</loc><lastmod>{lastmod}</lastmod>"
            f"<changefreq>{changefreq}</changefreq><priority>{priority}</priority></url>"
        )
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(lines)
        + "\n</urlset>\n"
    )
    OUT.write_text(xml, encoding="utf-8")
    print(f"sitemap.xml → {OUT.relative_to(ROOT)} ({len(pages)} URLs)")


if __name__ == "__main__":
    main()
