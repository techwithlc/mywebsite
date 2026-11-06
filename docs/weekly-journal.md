# AI Infrastructure Field Notes

The homepage is the AI infrastructure journal. #weekly remains an alias; issue routes are #weekly/01 … #weekly/12. #journal-roadmap and #about link to the archive and author background.

## Write the next issue

Edit src/data/weeklyJournal.ts. All new text has zh and en versions.

1. Update the corresponding journalIssues entry: title, question, outline, topic. Keep status planned while only an outline exists.
2. Write article sections (title, paragraphs, sourceIds) in both languages. Add that issue’s sections to journalArticles under its two-digit ID. Each article must have its own entry.
3. Add primary sources to journalSources and reference their IDs in the relevant sections. Verify source periods and update the reviewed text in weeklyCopy before release.
4. Set status to draft for a visible draft preview, or published after editorial review. Drafts are intentionally visible and labeled; they are not private.
5. Confirm EN/中文, light/dark, mobile layout, external source links, and the previous/next issue navigation. Run npm run build.

The landing page features the latest published issue in journalIssues order, falling back to the first draft. Its CTA and badge follow that status.

The initial issue is a public-source draft. The other eleven entries are editorial plans, not published articles. The delivery-conditions diagram is illustrative; no synthetic hardware specifications or internal company data are used.

This is a local source change. No email subscription, scheduled writing automation, Git push, or production deployment is performed.

## Site identity

The site now focuses on the AI infrastructure weekly. The previous tech stack, general blog list, daily news, personal projects, animated illustration, and sponsor sections are not rendered. Existing content files remain in the repository.

Author background and education copy lives in infrastructureCopy in src/data/weeklyJournal.ts. Columbia University, Master’s degree in Operations Research, Aug 2024–Sep 2025 is user-supplied profile information. The school logo is a local copy of the LinkedIn image supplied by the user; the education link points to the public university page, not a profile-edit URL.

New visitors default to the dark infrastructure theme. Existing light/dark preferences are respected.
