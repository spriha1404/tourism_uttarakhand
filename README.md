# Uttarakhand — Interactive Digital Experience

A React + Three.js / React Three Fiber prototype inspired by Uttarakhand's Himalayan temples and Valley of Flowers.

## What is already interactive?

### Temple
- Drag to orbit around the scene.
- Click the hanging bell.
- The bell swings.
- A layered Web Audio tone creates a temple-bell-like sound.
- No audio file is required, so the prototype is easy to deploy.

### Valley of Flowers
- Switch to the Valley scene.
- Drag to explore.
- Click the mountain to reveal flower buds.
- Click individual buds to bloom them.
- The flowers animate from closed to open.

## Run locally

Install Node.js 18+.

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Build for production

```bash
npm run build
npm run preview
```

## Put it on GitHub

Yes — GitHub is a good place to store the code.

1. Create a new GitHub repository, for example `uttarakhand-interactive`.
2. Upload this project (including `package.json`, `src`, and `index.html`).
3. You can use GitHub as the source repository.
4. For the live website, deploy the repository through Vercel or Netlify. Both will build the Vite app automatically after connecting the repository.

### Important
GitHub Pages can also host a Vite site, but it needs a small deployment configuration because Vite asset paths depend on the repository name. For a first tourism pitch, Vercel/Netlify is simpler.

## How to turn this into a premium Uttarakhand Tourism pitch

The current version intentionally uses procedural Three.js geometry so it works without downloading copyrighted 3D models.

For a final production version, replace the placeholder geometry with optimized `.glb` models and add:
- Kedarnath/Badrinath-inspired or other approved temple architecture (with cultural review)
- real Himalayan terrain
- Valley of Flowers landscape
- local flora labels
- Garhwali/Kumaoni audio snippets
- Sanskrit/Hindi/English content
- real bell recordings, with permission/licensing
- parallax/scroll storytelling
- map of Uttarakhand
- destination cards
- weather/season indicators
- accessibility controls
- mobile-specific interactions
- loading screen and performance optimization
- tourism CTA: "Plan your journey"

## Suggested next scenes

1. Temple Bells — click bells and hear different tones.
2. Valley of Flowers — click mountain → buds appear → click each flower → bloom.
3. River of Rishikesh — move the cursor to create ripples.
4. Auli — drag a ski trail down the mountain.
5. Nainital — rotate the lake and click boats.
6. Jageshwar — click ancient trees to reveal stories.
7. Chopta/Tungnath — follow a glowing trail to the temple.
8. Panch Kedar — interactive route/map experience.

## Brand/pitch positioning

Do not present this as "just a website."

Position it as:

> An interactive digital tourism story — turning Uttarakhand's landscapes, architecture and living culture into an experience people can explore rather than simply scroll past.

The prototype can become a portfolio/spec piece before approaching Uttarakhand Tourism, destination brands, travel companies or cultural organizations.

## Credits / legal note

This prototype uses generated/procedural geometry and browser-generated audio. If you add real photographs, recordings, architectural scans, fonts, logos, or third-party 3D models, check their licensing and obtain permission where required.
