# Sumaiya Jannat Arpa — The Creative Engineer Portfolio

An extraordinary, editorial-grade personal portfolio website crafted for **Sumaiya Jannat Arpa**, Computer Science and Engineering student at East West University, Bangladesh.

Built at the intersection of **Software Engineering**, **User Experience Design**, and **Software Quality Assurance**.

---

## 01. Visual Identity & Art Direction

- **Primary Background**: Warm Paper Ivory (`#F5F2EA`)
- **Primary Typography**: Almost-Black Ink (`#171714`)
- **Signature Accent**: Vivid Acid Lime / Chartreuse (`#C9F45A`)
- **Secondary Accent**: Deep Forest Green (`#183D32`)
- **Display Typeface**: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)
- **Body Typeface**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- **Technical & Metadata Typeface**: [Space Mono](https://fonts.google.com/specimen/Space+Mono)
- **Layout**: Asymmetric editorial grid, hairline rules, coordinate annotations, and architectural SVG placeholder blueprints.

---

## 02. Quick Start

```bash
# Install dependencies
npm install

# Start local development server (Vite)
npm run dev

# Build production bundle (outputs to dist/)
npm run build

# Preview production build locally
npm run preview
```

---

## 03. Content Architecture & Customization

All personal content, case studies, visual archive items, and timeline records are centralized inside `src/data/`:

| File | Purpose | Key Fields |
| :--- | :--- | :--- |
| [`src/data/site.js`](file:///c:/Users/liton/arpa-portfolio/src/data/site.js) | Global site details & navigation | Name, monogram (`SJA.`), coordinates, portrait path, resume PDF, social channels |
| [`src/data/projects.js`](file:///c:/Users/liton/arpa-portfolio/src/data/projects.js) | Portfolio catalog & case studies | 4 category templates (`software`, `uiux`, `sqa`, `graphic`), tech stack, sections, evidence |
| [`src/data/gallery.js`](file:///c:/Users/liton/arpa-portfolio/src/data/gallery.js) | Graphic Design visual archive | Posters, banners, social collateral, dimensions, tools, year, lightbox metadata |
| [`src/data/experience.js`](file:///c:/Users/liton/arpa-portfolio/src/data/experience.js) | Leadership & extracurriculars | ISTARC, Campus Crew Banglay IELTS, AHOBAN Foundation, EWU ECC (multi-role support) |
| [`src/data/about.js`](file:///c:/Users/liton/arpa-portfolio/src/data/about.js) | Narrative & credentials | Biography, core disciplines, EWU coursework, scholarships, certificates |

---

## 04. Assets & Media Placement

- **Portrait**: Drop your portrait photo into `public/images/portrait.jpg` and set `portrait: '/images/portrait.jpg'` in `src/data/site.js`.
- **Project Covers & Evidence**: Place project screenshots in `public/images/projects/` and set `cover` or `evidence[i].src`. If left empty `""`, the system automatically renders custom architectural vector blueprints!
- **Graphic Design Archive**: Place Canva posters / banner artwork in `public/images/gallery/` and set `src`.
- **Resume**: Drop your resume PDF into `public/resume/Sumaiya-Jannat-Arpa-Resume.pdf` and update `resume.file` in `src/data/site.js`.

---

## 05. Routing & Deployment

- Built with React Router v6 using `HashRouter` for zero-configuration deployment across GitHub Pages, Cloudflare Pages, Vercel, or Netlify without server rewrite issues.
