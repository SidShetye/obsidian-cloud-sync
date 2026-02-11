# FEATURE_SIMPLIFY_UX

## Goal
Redesign the Cloud Sync settings UX to reduce scrolling, improve wording clarity, and make grouping predictable.

Primary requirements:
1. Keep provider selection focused on setup flow (compact selector-first UX).
2. Keep OneDrive at the top of provider selector options.
3. Improve awkward/unclear language.
4. Re-group settings consistently.
5. Move Advanced and PRO settings into collapsible sections (accordion-style) if Obsidian settings DOM allows.
6. Do not change sync behavior, only UX/layout/copy.

## Status Update (2026-02-11)

Completed:
1. Added top-level accordion sections in this order:
   - Providers
   - Sync behavior
   - Paths and filters
   - Advanced (collapsed)
   - PRO (collapsed)
   - Import/Export (collapsed)
   - Diagnostics (collapsed)
2. Re-grouped settings content into the new sections without changing sync behavior.
3. Kept provider-specific settings rendering and class-based visibility toggles intact.
4. Simplified high-traffic English copy in `src/langs/en.json` and PRO notices in `pro/src/langs/en.json` (wording, casing, typo fixes like `modifed` -> `modified`).
5. Reworked Providers section from large enabled/disabled lists to compact dropdown-first flow.
6. Set provider dropdown ordering with OneDrive first.
7. Kept `#settings-pro` anchor compatibility for PRO links.
8. Added minimal section styling in `styles.css` (accordion container + spacing).
9. Verified behavior with `npx tsc -noEmit -skipLibCheck` and `npm test` (passing).

In progress / next:
1. Continue concise-copy pass for verbose disclaimers and long descriptions (especially provider disclaimer blocks). ✅ Major pass done in `src/langs/en.json` and `pro/src/langs/en.json`.
2. Introduce progressive disclosure for disclaimer/legal text (short summary + expandable details). ⏳ Optional polish; current implementation prioritizes concise inline text with minimal code churn.
3. Tighten labels/descriptions to single-line scanning style across remaining settings. ✅ Major pass done (providers, auth/connectivity, advanced/debug wording).
4. Capture updated screenshots and final QA pass for desktop/mobile. ⏳ Pending.

## Current UX Problems (from screenshots + code)
1. The page is very long and visually flat, so it is hard to scan.
2. Provider setup and global sync behavior are interleaved in a way that feels arbitrary.
3. Provider selection is a single dropdown with a separator, which hides available vs locked state.
4. PRO-only providers are mixed into the same chooser flow as always-available providers.
5. “Basic”, “Advanced”, “Import/Export”, “Pro”, and “Debug” all render as full-height blocks, requiring excessive scrolling.
6. English strings are inconsistent in tone/casing and include grammatical issues (for example: `settings_checkonnectivity`, “Action For Conflict”, “Sync _ Files Or Folders”, “modifed”).
7. Terminology varies (`Webdav` vs `WebDAV`, `Webdis`, `Dir` vs `Directory`, `On Start Up` vs `Startup`).

## Constraints and Non-Goals
1. Keep all existing functionality and setting keys working.
2. Keep PRO license boundaries intact (do not move business logic across free/pro licensing boundaries).
3. Preserve existing auth/revoke workflows and callbacks.
4. Preserve existing feature-gating behavior for PRO services.
5. Non-goal: changing sync algorithm semantics.
6. Non-goal: removing debug/import-export capabilities.

## Proposed Information Architecture

### Top-level sections (new order)
1. `Providers`
2. `Sync Behavior`
3. `Paths & Filters`
4. `Advanced` (collapsed by default)
5. `PRO` (collapsed by default)
6. `Import/Export` (collapsed by default)
7. `Diagnostics` (collapsed by default; current Debug section)

### Providers section structure
1. `Remote provider` selector (compact, at top of section)
2. Selected provider settings directly below the selector

Definition:
1. Enabled provider = usable now in this install (free providers + unlocked PRO providers).
2. Disabled provider = known provider but currently locked/unavailable (typically PRO-gated).

Presentation:
1. Use a single compact selector-first flow to reduce vertical space and keep setup task-focused.
2. Keep existing dropdown compatibility and provider visibility toggles.
3. Keep locked-provider discoverability in dropdown option names and existing PRO-specific provider hints/links.
4. Keep OneDrive first in selector ordering.

## Accordion Strategy
Obsidian settings tabs allow direct DOM creation. Use semantic `<details><summary>` wrappers as collapsible sections.

Implementation approach:
1. Build helper in `src/settings.ts` (or extracted helper file) to create a collapsible section container.
2. Default open state:
   - Open: `Providers`, `Sync Behavior`, `Paths & Filters`
   - Closed: `Advanced`, `PRO`, `Import/Export`, `Diagnostics`
3. Ensure `#settings-pro` anchor still exists for existing “View PRO” links from PRO-gated providers.
4. If `<details>` behavior is inconsistent in Obsidian version(s), fallback to simple hide/show class with a button.

## Copy Rewrite Plan (English)

### Scope
1. Update user-facing strings in `src/langs/en.json` and `pro/src/langs/en.json`.
2. Keep legacy key names where possible for backward compatibility, but update values.
3. For obvious typos in keys (`settings_checkonnectivity`), keep key name but normalize displayed text.

### Style rules
1. Sentence case labels.
2. Consistent product names: `WebDAV`, `OneDrive`, `Google Drive`, `pCloud`, `Yandex Disk`.
3. Consistent action phrasing: imperative + short (`Check connection`, `Reset`, `Connect`, `Revoke`).
4. Remove awkward constructions (`or not`, `show up errors`).
5. Keep warnings concise and specific.

### Priority string fixes (examples)
1. `Choose A Remote Service` -> `Remote provider`
2. `Check Connectivity` -> `Check connection`
3. `Sync _ Files Or Folders` -> `Sync items starting with _`
4. `Action For Conflict` -> `Conflict handling`
5. `Run Once On Start Up Automatically` -> `Run once at startup`
6. `Import and Export Partial Settings` -> `Import and export settings`
7. Fix typo in long text: `modifed` -> `modified`

## Detailed Implementation Plan

### Phase 0: Baseline and guardrails
1. Capture current section order and major controls (already mapped in `src/settings.ts:911-3101`).
2. Define acceptance checklist before refactor (see Acceptance Criteria).
3. Keep behavior snapshot by validating all setting fields still save and reload unchanged.

### Phase 1: Refactor settings layout composition
1. In `src/settings.ts`, split `display()` into section builder functions:
   - `renderProvidersSection(...)`
   - `renderSyncBehaviorSection(...)`
   - `renderPathsFiltersSection(...)`
   - `renderAdvancedSection(...)`
   - `renderProSection(...)`
   - `renderImportExportSection(...)`
   - `renderDiagnosticsSection(...)`
2. Keep existing provider-specific generation functions as-is initially; only change parent containers/order.
3. Add reusable helper for section container creation and optional collapsible behavior.

### Phase 2: Simplify provider selection UX
1. Keep a single provider dropdown at top of Providers section.
2. Remove large enabled/disabled list rendering to reduce scroll and visual noise.
3. Keep provider option ordering task-oriented (OneDrive first).
4. Ensure selecting a provider still toggles correct `*-hide` classes and persists `serviceType`.

### Phase 3: Move section content to new grouping
1. Move schedule + sync triggers + skip large files + status bar controls into `Sync Behavior`.
2. Move ignore/allow path regex controls and config/bookmark-related path behavior into `Paths & Filters`.
3. Keep concurrency, conflict handling, deletion destination, sync direction, mobile status bar under `Advanced`.
4. Keep PRO account/features in `PRO` section.
5. Keep current Debug section under renamed `Diagnostics` (collapsed).

### Phase 4: Copy pass and consistency cleanup
1. Update high-traffic labels/descriptions in `src/langs/en.json` and `pro/src/langs/en.json`.
2. Keep old translation keys where practical to avoid broad call-site churn.
3. Normalize wording/casing for section headers, buttons, and descriptions.
4. Add concise helper text where risk is high (config dir sync, encryption method switch, delete propagation).

### Phase 5: Styling and visual hierarchy
1. Add minimal CSS in `styles.css` for collapsible headers and section spacing.
2. Improve spacing between major sections and reduce visual noise in disclaimers.
3. Keep style compatible with Obsidian themes (use theme variables only).

### Phase 6: QA and regression checks
1. Desktop checks:
   - Section expand/collapse state and readability.
   - Provider selection and visibility toggles.
   - Auth/revoke controls still functional for each provider.
2. Mobile checks:
   - No clipped controls in collapsed sections.
   - Accordion interaction works with touch.
3. PRO gating checks:
   - Locked provider flows still show expected PRO hints and links.
   - No regression in PRO account auth/revoke/refresh behaviors.
4. i18n checks:
   - No missing translation keys for updated strings.

## File-Level Change Plan
1. `src/settings.ts`
   - Main refactor target for layout sections, compact provider selector, and section ordering.
2. `pro/src/settingsPro.ts`
   - Ensure `#settings-pro` anchor remains valid within collapsed PRO section.
   - Verify feature refresh/auth/revoke flows remain intact.
3. `styles.css`
   - Add section/accordion styles and spacing updates.
4. `src/langs/en.json`
   - Major copy updates for base plugin settings text.
5. `pro/src/langs/en.json`
   - Copy consistency for PRO-specific provider strings.

## Risks and Mitigations
1. Risk: Breaking provider visibility toggles while reordering containers.
   - Mitigation: Keep existing provider div references and class toggles unchanged in first pass.
2. Risk: PRO gating links break (`window.location.href = "#settings-pro"`).
   - Mitigation: keep `id="settings-pro"` stable even if section is collapsed.
3. Risk: Large translation diff increases churn for non-English locales.
   - Mitigation: limit this feature to English copy first; open follow-up localization task.
4. Risk: `<details>` behavior may vary by Obsidian/webview.
   - Mitigation: fallback toggle implementation with classes.

## Acceptance Criteria
1. Providers section is compact and selector-first (no large provider list block).
2. OneDrive appears first in provider dropdown.
3. User can still select active provider and configure it exactly as before.
4. Advanced and PRO sections are collapsible and collapsed by default.
5. Import/Export and Diagnostics are collapsible and collapsed by default.
6. Existing settings persist correctly and no migration is required.
7. English labels/descriptions in key workflows read naturally and consistently.
8. No regression in auth/revoke/connectivity actions.

## Rollout Strategy
1. Ship as one feature branch with staged commits:
   - Commit 1: layout refactor + no copy changes.
   - Commit 2: compact provider selector UX.
   - Commit 3: accordion containers + CSS.
   - Commit 4: English copy cleanup.
2. Include before/after screenshots in PR for desktop and mobile.
3. Follow with optional Phase 2 task for localization updates in other languages.

## Open Decisions
1. Should collapsed state persist across plugin reloads (stored in settings) or remain static defaults?
2. Should Diagnostics stay user-visible by default in non-debug builds, or be behind a small “Show diagnostics” toggle?
3. For provider dropdown, should locked providers remain selectable or be visually disabled with a separate CTA?
