# Laura Winkler – Portfolio

Personal portfolio website, built with React, TypeScript and Vite.

## Run locally

```bash
yarn            # install dependencies
yarn dev        # dev server on http://localhost:5173
yarn build      # production build into dist/
yarn preview    # preview the production build
```

## Project structure

```
src/
  data.ts                    all texts, projects, skills, links  ← edit content here
  App.tsx                    page layout (intro, about, background, skills, what else, footer)
  components/
    Hero.tsx                 header image, light pulses along the thread, hotspots
    Stars.tsx                sparse flashing light dots behind the page
    Projects.tsx             project tiles (one tile plays its images at a time)
    DetailOverlay.tsx        project detail view with gallery (keyboard + focus trap)
    Arrow.tsx                arrow icon
  styles.css                 all styles
public/
  hero.jpg                   header image
  og-image.jpg               link preview image (LinkedIn etc.)
  tiles/                     project images and covers
  thesis.pdf, research-project.pdf, tedai-hackathon.mp4
```

Previous version (2024): [portfolio-2024](https://github.com/WinklerLaura/portfolio-2024)
