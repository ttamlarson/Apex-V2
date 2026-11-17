# CORV Performance Systems

**BUILT THROUGH REPETITION. ENGINEERED TO PERFORM.**

CORV is a performance training system for tracking training, nutrition, progress and recovery.

## Deploy to GitHub Pages

1. Keep the application files in the repository root.
2. Deploy using the existing GitHub Pages workflow or the existing branch deployment configuration.
3. Check the Actions tab and Pages settings for the published URL.

## Add CORV to iPhone

1. Open the deployed Pages URL in Safari.
2. Tap **Share → Add to Home Screen**.
3. Confirm the name **CORV**, then tap **Add**.
4. If an older STRYV shortcut is installed, remove that shortcut and add CORV again after deployment.

## Data and backups

The app stores records locally in the browser on the device and does not automatically sync between devices. Existing local storage key and data model are preserved by the rebrand. Use **Settings → Backup & restore → Export JSON backup** regularly. Do not clear Safari website data or change the site's origin if you need to retain existing local records.

## Files

- `index.html` — complete app
- `manifest.webmanifest` — CORV PWA name, launch behavior and icon declarations
- `sw.js` — service worker and offline app-shell cache
- `apple-touch-icon.png` — iPhone Home Screen icon
- `icon-192.png`, `icon-512.png`, `corv-mark.svg` — PWA/browser icons
- `.github/workflows/deploy-pages.yml` — GitHub Pages deployment workflow
