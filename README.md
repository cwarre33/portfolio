# Cameron Warren — Portfolio

**Live:** [https://cwarre33.github.io/portfolio/](https://cwarre33.github.io/portfolio/)

A professional, React-based portfolio showcasing experience as an AI Research Analyst and Software Engineer — SofaScope, SellSmart, SEC Breach Dashboard, and full-stack/AI projects.

## Stack

- **React 18** + **TypeScript**
- **Vite** (build & dev server)
- CSS with design tokens (dark, clean theme)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The app is served with base path `/portfolio/` for GitHub Pages.

## Build for GitHub Pages

```bash
npm run build
```

Deploy the contents of the `dist/` folder to the `gh-pages` branch or to GitHub Pages (e.g. set the source to the branch that contains `dist/`, or use a GitHub Action to build and push `dist/` to `gh-pages`).

## Structure

- **Content** (resume, Jira, GitHub–informed): `src/data/` — experience, projects, skills.
- **Sections:** Hero (with typewriter), About, Experience, Projects, Contact, Footer.
- **Design:** Dark theme, DM Sans + JetBrains Mono, accent blue, responsive layout.

## Legacy site

The previous static HTML/CSS site is preserved as `index-legacy.html` and `project.html` for reference.
