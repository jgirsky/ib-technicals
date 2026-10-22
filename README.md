# Technicals on the Train

One-handed flashcards for investment banking technical interviews (BIWS Module 4, rewritten as 333 cards).

- Static site, no build step. Netlify serves this folder as-is (`netlify.toml`).
- Works offline after the first visit (`sw.js`). Install it from Safari: Share → Add to Home Screen.
- Progress is stored in the browser on each device (localStorage).

## Updating cards
Edit `index.html` (cards live in the `<script id="deck">` JSON), then bump `VERSION` in `sw.js` so installed copies refresh.
