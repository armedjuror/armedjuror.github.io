# armedjuror.github.io

Source for [armedjuror.in](https://armedjuror.in). Built with Hugo and a custom theme.

---

## Local development

```bash
hugo server
```

Open `http://localhost:1313`. Pages hot-reload on save.

---

## Writing a blog post

Create a new file in `content/blog/`:

```bash
hugo new content blog/your-post-slug.md
```

Or create the file manually. Front matter:

```yaml
---
title: "Your Post Title"
date: 2024-01-15
draft: false
---

Post content goes here.
```

- Set `draft: true` while writing. Draft posts won't appear in production but will show locally with `hugo server -D`.
- The filename becomes the URL slug: `content/blog/my-post.md` → `/blog/my-post`
- Posts are listed on `/blog` ordered by date, newest first
- The 3 most recent posts appear on the home page automatically
- Every blog post gets Byte, the reading buddy (`themes/terminal/static/js/byte-buddy.js`): a progress ring that fills as you read, plus short messages at the start, 25%, halfway, the last 2 minutes and the end. Add `buddy: false` to the front matter to turn it off for one post.
- Add `pdf: true` to the front matter to offer a PDF download. On deploy, `scripts/build_pdfs.py` renders the post with WeasyPrint (styled by `themes/terminal/static/css/pdf.css`) to `/blog/<slug>/<slug>.pdf`, and the post shows a "↓ download PDF" link next to the date. To preview locally: `hugo --minify && pip install weasyprint && python scripts/build_pdfs.py`

### Code blocks

Typed code blocks get the IDE-style window with mac buttons and line numbers:

````
```python
def hello():
    print("world")
```
````

Plain blocks (no language) get the window without line numbers — good for ASCII diagrams and terminal output.

---

## Adding a project

Create a new file in `content/projects/`:

```yaml
---
title: "Project Name"
date: 2024-01-01
link: "https://github.com/you/project"
status: "active"
draft: false
---
One line description of the project.
```

- `status` can be anything: `active`, `archived`, `wip`
- `link` is the URL shown as `→ link` at the bottom of the project block
- Projects are listed on `/projects` ordered by date, newest first

---

## Deploying

Push to `master` — GitHub Actions builds and deploys automatically.

```bash
git add .
git commit -m "new post: your title"
git push
```

The workflow installs Hugo, runs `hugo --minify`, and deploys `public/` to GitHub Pages. Takes ~30 seconds.

> Make sure GitHub Pages source is set to **GitHub Actions** in repo Settings → Pages.

---

## Project structure

```
content/
  blog/        # blog posts (.md)
  projects/    # project entries (.md)
static/
  CNAME        # custom domain — do not delete
themes/terminal/
  layouts/     # Hugo templates
  static/css/  # single stylesheet
.github/workflows/deploy.yml  # CI/CD
hugo.toml      # site config
```
