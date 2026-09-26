# A-level Calculus - GitHub Pages deployment

This folder is the production deployment for the `alevel-calculus` GitHub repository.

## Publish
1. Upload the **contents of this folder** to the repository root on the `main` branch.
2. In GitHub: **Settings -> Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Choose **main** and **/(root)**, then Save.
5. The expected site URL is `https://<github-username>.github.io/alevel-calculus/`.

## Important
- `index.html` and `404.html` are intentionally both present.
- `404.html` is the SPA fallback used when a student refreshes or bookmarks a five-segment activity URL.
- Assets and browser-history routes are anchored to `/alevel-calculus/`.
- Do not rename the repository without rebuilding this package for the new repository path.
