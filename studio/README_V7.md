# CASTLE Creative Studio V7 · November 2026

## What changed

- Marketing-first hero; visible work, fewer marketing slogans, short CTA on a 320–390px screen.
- Single production stylesheet `assets/castle-v7.css` loaded across the four pages. Legacy sources remain in this archive for historical reference but are NOT loaded.
- Original public Instagram Reels linked on the homepage as **published work from the owner**, not fake client campaigns. Three real Instagram permalinks are in index.html; inline embed loads ONLY on click and always has a direct original link.
- Commercial photography page has one licensed Unsplash photo **explicitly marked as third-party illustrative reference**; not represented as client work.
- Responsive commercial case of the CASTLE site itself on the Websites page.
- Clearer briefing deliverables and FAQ.
- One privacy page `privacidade.html`; `privacy.html` redirects to it.
- Frontend request UUID persists across retries. Explicit server success/failure, separate opt-in WhatsApp link.
- WebGL phone loads when near viewport, with lower GPU resolution and texture update on mobile, and backoff off-screen. It still depends on Three.js 0.169.0 CDN and uses the original CSS fallback.
- Mobile menu closes on Escape, outside click, resize. WebGL keyboard focus outline visible.
- Media uses public third-party services only if the visitor requests it (Instagram embedding). No ad pixels, fake claims or fabricated campaign data.

## Tech details

Static GitHub Pages deployment path: `/studio/`. HTML + JS + CSS. Main CSS compiled using unused-selector pruning across source pages, but visual parity requires rechecking before removing historical source files from the repository. Only one `castle-v7.css` is loaded in the published pages.

## Known limits

- Commercial photo example from Unsplash is a reference, NOT CASTLE portfolio work. Needs actual paid product work after local shoots.
- Reel embedding depends on Instagram permissions/connectivity. Direct external Instagram permalink is the fallback.
- Core Web Vitals on real Android models still need RUM/Lighthouse measurement; local script and screenshot checks are not a substitute.
- A paid acquisition funnel, ad pixels, full conversion analytics, booking payments, and production SLA are not activated by this site.
- Supabase Edge Function and lead alert were not changed in this release.
- Rates for commercial services are calculated after scope, not invented.

## Content / legal provenance

- Author's verified Instagram reels: https://www.instagram.com/reel/DdhqkSlBpgP/ ; https://www.instagram.com/reel/DdP2MWhN9W-/ ; https://www.instagram.com/reel/Dc9O0upKCqJ/ . These videos were identified through the connected account's public posts.
- Licensed food reference from https://unsplash.com/photos/juicy-burger-with-lettuce-tomato-and-fries-AFX6POIAG-w ; license https://unsplash.com/license . Provide the source attribution in-page.

## Essential regression checks

1. Homepage 1440px, 390px, 320px; no horizontal overflow; headline and CTA visible.
2. WebGL fallback, swipe rotation and pause buttons (device-specific testing required).
3. Reel modal click, Escape, focus return, external URL fallback.
4. Form failure -> retry -> success; no duplicate `client_request_id` during retries. Supabase submission only after consent.
5. CTA on portraits, commercial brands and websites routes to the correct contact URL.
6. Privacy page accurate and canonical.
