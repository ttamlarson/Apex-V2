# Apex Protocol V2

A static Progressive Web App (PWA) for tracking training, nutrition, progress and recovery.

## Deploy to GitHub Pages (recommended: GitHub Actions)

1. Extract this ZIP. The `index.html`, `manifest.webmanifest`, `sw.js`, icon files and `.nojekyll` must be in the repository root. Keep the `.github/workflows` folder too.
2. In your GitHub repository, upload the **contents** of the extracted folder (not the outer folder itself) and commit them to the `main` branch.
3. Open **Settings → Pages**.
4. Under **Build and deployment → Source**, select **GitHub Actions**.
5. The included workflow will publish the site. Check the **Actions** tab for the deployment run; when it completes, open the Pages URL shown in Settings → Pages.

## Alternative: deploy directly from the main branch

If you prefer branch deployment, choose **Deploy from a branch** in Settings → Pages, select `main` and `/(root)`, then save. The workflow file can remain in the repository; it will not be used by branch deployment.

## Home Screen installation on iPhone

1. Open the deployed Pages URL in **Safari**.
2. Tap **Share → Add to Home Screen**.
3. Use the title **Apex Protocol**, then tap **Add**.
4. If an older generic icon is already installed, remove that old Home Screen shortcut first, then add it again after the updated site has deployed.

## Data and backups

The app stores records locally in the browser on the device. It does not automatically sync between devices. Use **Settings → Backup & restore → Export JSON backup** regularly. Keep the backup somewhere safe. Do not clear Safari website data or change the site's origin if you need to retain the existing local records.

## Files

- `index.html` — complete app
- `manifest.webmanifest` — PWA name, launch behavior and icon declarations
- `sw.js` — service worker and offline app-shell cache
- `apple-touch-icon.png` — iPhone Home Screen icon
- `icon-192.png`, `icon-512.png`, `icon.svg` — PWA/browser icons
- `.nojekyll` — prevents GitHub Pages/Jekyll from skipping repository assets
- `.github/workflows/deploy-pages.yml` — GitHub Pages deployment workflow
