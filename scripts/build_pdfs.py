#!/usr/bin/env python3
"""Render every blog post with `pdf: true` in its front matter to a PDF.

Run after `hugo --minify`. For content/blog/<name>.md it reads
public/blog/<slug>/index.html and writes public/blog/<slug>/<name>.pdf,
which is where the post's "download PDF" link points.
"""
import pathlib, re, sys
from weasyprint import HTML

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
PDF_CSS = ROOT / "themes/terminal/static/css/pdf.css"


def front_matter(text):
    m = re.match(r"^---\n(.*?)\n---", text, re.S)
    return m.group(1) if m else ""


def main():
    made = 0
    for md in sorted((ROOT / "content/blog").glob("*.md")):
        if md.name.startswith("_"):
            continue
        fm = front_matter(md.read_text(encoding="utf-8"))
        if not re.search(r"^pdf:\s*true\s*$", fm, re.M) or re.search(r"^draft:\s*true\s*$", fm, re.M):
            continue
        slug = re.search(r'^slug:\s*"?([^"\n]+)"?\s*$', fm, re.M)
        slug = slug.group(1) if slug else md.stem
        page = PUBLIC / "blog" / slug / "index.html"
        if not page.exists():
            # Future-dated posts aren't built yet; their PDF is made on the
            # scheduled rebuild that publishes them.
            print(f"skip (not built yet, likely future-dated): {md.name}")
            continue
        out = page.parent / f"{md.stem}.pdf"
        # Site pages link assets from the root (/css/style.css); point those into public/.
        html = re.sub(r'(href|src)=("?)/(?!/)', lambda m: f"{m.group(1)}={m.group(2)}{PUBLIC.as_uri()}/",
                      page.read_text(encoding="utf-8"))
        # Load pdf.css last in <head> so it overrides the screen styles.
        html = html.replace("</head>", f'<link rel="stylesheet" href="{PDF_CSS.as_uri()}"></head>', 1)
        HTML(string=html, base_url=page.as_uri()).write_pdf(str(out))
        print(f"pdf: {out.relative_to(PUBLIC)}")
        made += 1
    print(f"{made} PDF(s) built")


if __name__ == "__main__":
    main()
