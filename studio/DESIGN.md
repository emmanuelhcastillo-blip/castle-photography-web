# CASTLE VISUAL SYSTEM / V6

**Client:** Emmanuel H. Castillo · Boa Vista, Roraima · CASTLE Creative Studio
**Public production path:** `/studio/` on GitHub Pages. The original personal photography portfolio remains intact.

## Art direction
- Visual premise: **human photography + computational motion + editorial typography.** No repeated generic gradients or fake metric dashboards.
- Brand: charcoal `#0c1115`, cream `#f4efe5`, gold `#e6b660`, coral `#dc816f`, turquoise `#62b2ae`.
- Primary type: DM Sans bold with intentionally tight tracking. Contrast type: Playfair Display Italic. Keep source photograph fully visible in art-led layouts.
- One major interaction per chapter: kinetic text manifesto, horizontal cinematic gallery, interactive format explorer; quieter elsewhere.
- No invented performance results, paid clients, faux work histories, or copyrighted media. Label graphic and product UI demos **CONCEITO**.
- Navigation, buttons, active tabs, image licensing, contact/consent form and mobile fallbacks are higher priority than decoration.

## Skills / research guidance incorporated
- [MengTo/Skills](https://github.com/MengTo/Skills): masked text reveals, scroll storytelling, staggered word entrance, cinematic card composition. Adapted into dependency-free `assets/direction-v6.js`.
- [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill): art direction, authored images, brand voice, visual QA; not copying any template.
- [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill): interaction sizes, accessibility, hierarchy, touch and responsive.
- [pbakaus/impeccable](https://github.com/pbakaus/impeccable): clarity of hierarchy and visual distinctiveness.
- [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md): maintain design tokens and invariant system in a committed `DESIGN.md`.

## QA gates
1. No duplicate IDs, missing relative resource URLs, or JS syntax errors.
2. 390px, 768px, 1024px, 1440px viewport layout QA on public staging / production, including navigation, gallery and tabs.
3. Reduced-motion visitor sees full text, images and functional content.
4. No scroll-jacking, no CTA behind a graphic overlay, no uncaught WebGL fallback.
5. Retain existing backend contract `assets/lead-form.js` to `cast-lead` with consent, contact channel and WhatsApp fallback. Test with synthetic consent and delete synthetic leads.
6. Measure conversion once real leads exist; do not quote imaginary improvements.

## Delivered V6 interactions
- Giant scroll-scrubbed manifesto text and masked typographic reveals.
- Horizontal native-swipe cinematic portfolio and full-width visual chapter cards.
- Interactive photography/Reels/website tabbed examples with keyboard support.
- Giant CTA banner and different full-bleed cinematic subpage interstitials.
- Persistent scroll progress line; parallax accents limited to visible sections.
- Existing 3D WebGL device preserved (separate module), with its fallback.
