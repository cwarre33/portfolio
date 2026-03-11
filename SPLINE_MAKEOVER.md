# Spline Makeover Plan

A phased plan to enhance the portfolio with Spline 3D assets—backgrounds, section wrappers, and optional card frames—without changing the core content structure.

---

## Done

- **Hero (main page)**  
  - Spline viewer added via `<spline-viewer>` (script: `@splinetool/viewer@1.12.68`).  
  - Scene: `https://prod.spline.design/xkOKuZbsmNGFlpat/scene.splinecode`  
  - Gradient orbs kept as fallback behind the viewer.  
  - Cache-busting query param (`?v=2`) used so updates in Spline show after hard refresh.

---

## Phase 1: Section backgrounds (low risk, high impact)

Add one Spline scene per section as a **background layer**; keep existing layout and copy on top.

| Section      | Approach                                                                 | Notes                                      |
|-------------|---------------------------------------------------------------------------|--------------------------------------------|
| **About**   | Optional full-width `spline-viewer` behind the About content (same pattern as Hero). | Subtle scene; ensure text contrast.        |
| **Experience** | Optional background viewer behind the timeline/list.                     | Low opacity or dark scene to keep text legible. |
| **Dev & infrastructure (AwsWork)** | Optional background viewer behind the three project cards.        | Can reuse one scene or a variant.          |
| **Projects** | Optional background viewer behind the project grid.                     | Light scene so cards stay readable.        |
| **Certifications** | Optional background viewer behind the cert cards.                    | Same pattern as above.                     |
| **Contact** | Optional background viewer behind the CTA and links.                    | Keeps “Get in touch” as the focus.         |

**Implementation pattern (per section):**

- Section wrapper: `position: relative`, overflow as needed.
- Inside: one `<spline-viewer url="...">` with `position: absolute; inset: 0; z-index: 0`.
- Content container: `position: relative; z-index: 1` (unchanged layout).
- Reuse the same script in `index.html`; no new dependencies.

**Spline side:** Create (or duplicate) a scene per section—simple, low-poly or abstract—then Export → Public URL. Add `?v=N` when you update a scene.

---

## Phase 2: “Frame” wrappers (one-off highlights)

Use a single Spline scene as a **frame** around one block (e.g. featured card or quote).

- **Candidate:** One featured project card or the Contact CTA block.
- **Spline:** Design a scene that reads as a frame (border/corners, empty center).
- **Code:** One container; `spline-viewer` as full-size background; content centered on top with higher z-index.
- **Limit:** One or two such frames per page to avoid too many viewers.

---

## Phase 3: Optional card-level accents (use sparingly)

- **Idea:** Small `spline-viewer` per card (e.g. thin 3D border or corner accent).
- **Trade-off:** Each viewer loads a full scene; can impact performance on low-end devices.
- **Recommendation:** Only if Phase 1–2 feel done and you want one extra accent (e.g. one “featured” card). Prefer section-level viewers over many card-level ones.

---

## Phase 4: Static Spline “wrapper” art (no viewer)

- Export frames/borders from Spline as **images** (PNG/SVG).
- Use as CSS backgrounds or decorative images around text/cards.
- Lighter than viewers; good for repeated borders or section dividers.

---

## Technical checklist

- [ ] All scene URLs use cache-busting (`?v=N`) when you update in Spline.
- [ ] After changing a scene in Spline, use **Update Public URL** (or regenerate) so the live URL serves the latest version.
- [ ] Section backgrounds: one viewer per section max; content stays in front with readable contrast.
- [ ] Avoid stacking many viewers on one viewport; prefer one background per section or one frame per section.

---

## File reference

- **Script:** `index.html` — Spline viewer script tag.
- **Hero:** `src/components/Hero.tsx` — `SPLINE_SCENE_URL`, `<spline-viewer>`, fallback orbs.
- **Sections to touch in Phase 1:** `About.tsx`, `Experience.tsx`, `AwsWork.tsx`, `Projects.tsx`, `Certifications.tsx`, `Contact.tsx`.

---

*First edition: Hero Spline background in place; rest of makeover follows this plan.*
