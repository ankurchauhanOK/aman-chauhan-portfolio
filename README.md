# Intelligent Supply Chain Systems — Aman Chauhan Portfolio

A premium, command-center-inspired portfolio for an Operations Research & Supply Chain Intelligence specialist. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no bloat.

## Design Philosophy

- **Aesthetic**: Dark precision UI. Charcoal, graphite, electric cyan. Inspired by Palantir, Flexport, and Tesla operations dashboards.
- **Feel**: Analytical, mechanical, intelligent. Like the website knows calculus before breakfast.
- **Domain**: Supply Chain Analytics, Operations Research, Simulation Engineering, Industrial Engineering, Predictive Analytics.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Structure | Semantic HTML5 |
| Styling | Vanilla CSS3 (CSS Variables, Grid, Flexbox) |
| Animation | Canvas 2D API + CSS Keyframes |
| Interaction | Vanilla JavaScript (Intersection Observer, RequestAnimationFrame) |
| Fonts | Inter + JetBrains Mono (Google Fonts) |

## Project Structure

```
.
├── index.html          # Main portfolio page
├── styles.css          # Complete styling (1,640 lines)
├── script.js           # All interactions (Canvas, scroll, counters)
├── vercel.json         # Vercel deployment config
├── README.md           # This file
└── .gitignore          # Git ignore rules
```

## Local Development

No build step required. Open `index.html` directly in a browser, or serve locally:

```bash
# Using Python
python3 -m http.server 8000

# Using Node
npx serve .

# Using VS Code Live Server extension
# Just right-click index.html → "Open with Live Server"
```

## Sections

1. **Hero** — Animated supply chain network canvas with 60 interactive nodes
2. **About** — Narrative positioning with floating KPI cards
3. **Expertise** — 6 capability cards (OR, Simulation, Analytics, etc.)
4. **Projects** — 4 case-study cards with unique visualizations
5. **Experience** — Timeline with glowing cyan progression dots
6. **Skills** — Clustered domain layout + orbital particle canvas
7. **Methodology** — 4-step research framework with flow diagrams
8. **Contact** — Enterprise-minimal layout + terminal widget

## Animations

- Network canvas: Distance-based node connections, mouse-proximity glow
- Scroll reveals: Staggered fade-in-up via Intersection Observer
- Counter animations: Eased quart counting for KPIs
- Parallax: Hero content fade, about visual shift
- Pulse effects: Grid cells, traffic lights, warehouse nodes, timeline dots
- Skills orbital: 5 color-coded particle clusters with cluster connections

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect the GitHub repo to Vercel Dashboard for auto-deploy on push.

### GitHub Pages

Push to a repository, enable Pages in Settings → Pages → Source: Deploy from Branch (main).

### Netlify

Drag and drop the project folder into [Netlify Drop](https://app.netlify.com/drop), or connect the GitHub repo.

## Credits

- Designed and built for **Aman Chauhan**
- Fonts: [Google Fonts](https://fonts.google.com) (Inter, JetBrains Mono)

## License

All rights reserved. This is a personal portfolio project.
