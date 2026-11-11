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

### Common changes

- **Texts, projects, links:** `src/data.ts`
- **Replace an image:** put the file into `public/tiles/` and update its path in `src/data.ts`
- **Header image:** replace `public/hero.jpg`. If the light thread in the new image runs
  differently, `hero.path` in `src/data.ts` has to be adjusted (fractions of image width/height).

## Deploy

1. Push the repository to GitHub.
2. On [vercel.com](https://vercel.com), sign in with GitHub, click **Add New → Project**
   and import the repository. Vercel detects Vite and Yarn automatically
   (build command `yarn build`, output folder `dist`). Click **Deploy**.
3. Optional: add your own domain under **Settings → Domains**.

After deploying, change the `og:image` URL in `index.html` to the full address,
e.g. `https://laurawinkler.at/og-image.jpg`, so link previews on LinkedIn show the image.

Previous version (2024): [portfolio-2024](https://github.com/WinklerLaura/portfolio-2024)
