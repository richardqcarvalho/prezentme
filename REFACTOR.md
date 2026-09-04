# PrezentMe — Refactor Plan

A practical, prioritized list of improvements found while auditing the project.
The project is a Next.js 15 / React 19 / TypeScript / Tailwind 4 / Zustand / React
Hook Form / Zod portfolio generator that produces a downloadable HTML file.

The plan is grouped from **High → Low priority** so that the most impactful and
low-risk changes come first. Every item lists the files involved, the problem,
and a concrete suggested fix.

---

## 1. High Priority — Bugs & Broken Configuration

These are real defects that will affect users or break the build/runtime.

### 1.1 Missing `public/` directory referenced by `next.config.ts`

- **File:** `prezentme/next.config.ts`
- **Problem:** `outputFileTracingIncludes` points at `./public/template.html`, but
  the `public/` directory does not exist in the repo. This will at best produce a
  warning and at worst fail the build depending on the Next.js version.
- **Fix:**
  1. Either delete the `outputFileTracingIncludes` block (it isn't needed — the
     template lives in `data/template.ts`, not in `public/`).
  2. Or, if the intent was to ship a static HTML template, create
     `public/template.html` and remove the duplication with `data/template.ts`.

### 1.2 Wrong file naming vs. file contents (steps are swapped)

- **Files:**
  - `prezentme/components/pages/1-personal-information.tsx` — actually renders the **contact** form
  - `prezentme/components/pages/2-contact.tsx` — actually renders the **personal info** form
- **Problem:** The numeric prefix is misleading. Step 1 (page index 0) shows
  contact fields, step 2 shows personal info. Users will be confused.
- **Fix:** Either rename the files to match their content
  (`1-contact.tsx` and `2-personal-information.tsx`) or, better, drop the
  numeric prefix entirely and rely on the `pageId` constant + `constants.ts`
  order (see §2.1).

### 1.3 `getEducation`, `getProject`, `getSetup` always return an empty string

- **File:** `prezentme/data/information.ts` (lines 157–167)
- **Problem:** These sections are declared in `InformationsT`, `DEFAULT_INFORMATIONS`
  and the template (`{education}`, `{project}`, `{setup}`), but the rendering
  functions are stubs that return `""`. The download will silently lose this
  data.
- **Fix:** Either implement them properly (mirror `getExperience`) or remove
  the dead schema/store/template fields until they are needed.

### 1.4 `next lint` is deprecated in Next 15

- **File:** `prezentme/package.json` (`scripts.lint`)
- **Problem:** Next 15 deprecated the built-in `next lint` command. It will
  print a deprecation warning and may stop working in Next 16.
- **Fix:** Switch to calling ESLint directly:
  ```json
  "lint": "eslint ."
  ```

### 1.5 `MILLISECONDS_TO_MONTH` uses an inaccurate value

- **File:** `prezentme/lib/constants.ts`
- **Problem:** `2628002880` ms is "30.42 days" — fine as an average — but the
  constant is named like an exact conversion. Combined with naive month/year
  arithmetic this produces totals like "1y, 1m" for a 12-month span depending
  on the start/end dates because `Date` arithmetic across DST/leap months is
  unreliable.
- **Fix:** Compute durations with a calendar-aware helper (e.g. `date-fns`
  `differenceInMonths`) and remove the magic number.

---

## 2. High Priority — Architecture & Code Structure

### 2.1 Replace numeric `pageId` filenames with a single registry

- **Files:**
  - `prezentme/app/generate/page.tsx`
  - `prezentme/components/pages/1-personal-information.tsx`
  - `prezentme/components/pages/2-contact.tsx`
  - `prezentme/components/pages/3-language.tsx`
  - `prezentme/components/pages/4-experience.tsx`
  - `prezentme/lib/constants.ts`
- **Problem:** The pages are wired through a hardcoded array (`[personalInformation, contact, language, experience]`)
  using `import * as ns` and reading `Page` + `pageId` from the namespace. The
  order is implicit and the `pageId` strings are never actually used. The
  constants `PERSONAL_INFORMATIONS_PAGE = 0`, `CONTACT_PAGE = 1` ... are
  redundant with array index.
- **Fix:** Create a single declarative page registry:

  ```ts
  // components/pages/registry.ts
  export const pages = [
    { id: "personal-info", title: "Personal info", Page: PersonalInfoPage },
    { id: "contact",       title: "Contact",       Page: ContactPage },
    { id: "language",      title: "Languages",     Page: LanguagePage },
    { id: "experience",    title: "Experience",    Page: ExperiencePage },
  ] as const;
  ```

  Then `app/generate/page.tsx` only does `const { Page } = pages[pageIndex]` and
  you get rid of `1-` / `2-` prefixes, `import * as`, the unused `pageId`
  exports, and the indexed constants in `lib/constants.ts`.

### 2.2 Consolidate the form "shell" into a shared `<FormStep>` component

- **Files:** all four `components/pages/*.tsx`
- **Problem:** Every page repeats the same outer structure:
  ```tsx
  <form onSubmit={handleSubmit(onSubmit)} className="flex w-[26rem] flex-col items-center gap-8 p-8">
    <div className="flex w-full flex-col gap-8 rounded-lg border border-black/20 p-8">
      ...fields...
    </div>
    <Button type="submit" disabled={!isValid}>...</Button>
  </form>
  ```
  The container width (`w-[26rem]`) and card styles are duplicated four times.
- **Fix:** Extract a `<FormStep>` component that accepts the form methods
  (`react-hook-form` `useForm()` return value), the submit handler, and a
  render-prop for the fields. The "Add language / Add experience" variants
  can be handled via a `footer` slot prop. This shrinks each page to just its
  field schema + field list.

### 2.3 Replace string-templated HTML generation with a typed render layer

- **File:** `prezentme/data/information.ts`
- **Problem:** `generateHTML` does 14 chained `.replaceAll("{token}", value)`
  calls against a giant template literal. This is fragile (collisions if a user
  types `{role}` somewhere in their description), not type-safe, and mixes
  presentation with logic. `getLanguage`, `getExperience`, etc. also
  hand-build HTML via `.reduce` + template strings.
- **Fix:** Split the work into:
  1. **`data/template.ts`** — only the static HTML skeleton (no tokens).
  2. **`lib/html/sections/*.ts`** — pure functions returning string HTML for
     each section (one per `InformationsT` slice), with proper escaping
     (`escapeHtml` helper — see §5.1).
  3. **`lib/html/render.ts`** — composes sections into the skeleton via a
     small tagged-template helper, so `{placeholder}` collisions become
     impossible.

  Better still: generate the DOM programmatically (e.g. with
  `html-to-image`-style builders, or a tiny JSX-to-string helper like
  `jsx-dom` / `react-dom/server` for a string). React-string rendering
  eliminates the manual escaping concern entirely.

### 2.4 Unify the two `InformationsT` definitions

- **Files:**
  - `prezentme/types/information.ts` (the source of truth)
  - `prezentme/types/form.ts` (Zod-inferred, per-step)
  - `prezentme/data/information.ts` (`DEFAULT_INFORMATIONS`)
- **Problem:** Each form's Zod schema lives in `types/form.ts` but the
  underlying type lives in `types/information.ts`. The two are kept in sync
  by hand. Drift is already visible: `languageSchema` doesn't have
  `min(1)`, `experienceSchema` requires `technologies: nonempty` (rejecting an
  empty array even though `DEFAULT_INFORMATIONS` ships with `technologies: []`),
  and `EducationT`/`ProjectT`/`SetupT` have no schema at all.
- **Fix:** Define every schema in `types/information.ts` (or a new
  `schemas/information.ts`) and derive the form-step types from them via
  `z.infer`. Then `DEFAULT_INFORMATIONS` should be `satisfies InformationsT`
  and ideally produced from `personalInfoSchema` etc. so the default state
  and the runtime validator can never diverge.

### 2.5 Move `generateHTML` out of the page and into a route handler

- **File:** `prezentme/components/pages/4-experience.tsx` (lines 35–45)
- **Problem:** The form submit handler does DOM work (`document.createElement`,
  `URL.createObjectURL`, programmatic `a.click()`) inside a React component.
  This couples rendering to the browser, prevents SSR/preview, and hides the
  download behind a click handler.
- **Fix:** Move the HTML composition into a server route (e.g.
  `app/api/generate/route.ts`) that accepts the form payload via POST and
  returns a `text/html` response with `Content-Disposition: attachment`. The
  page just POSTs the data. Bonus: you can also offer a "preview in new tab"
  action by hitting the same route without the `attachment` header.

---

## 3. Medium Priority — State Management

### 3.1 Stop spreading `DEFAULT_INFORMATIONS` into the store

- **File:** `prezentme/store/index.ts`
- **Problem:** `informationStore` starts with `...DEFAULT_INFORMATIONS`, which
  means the `setInformation` setter has to spread `informations` on top to do
  shallow merges. Because `setInformation` accepts `Partial<InformationsT>`,
  callers that pass a subset (e.g. just `language`) will *replace* the entire
  store with that subset and silently drop the other fields. The `language`
  page currently does `setInformation(informations)` where `informations` is
  `{ language: [...] }` — so `firstName`, `experience`, etc. get wiped from
  the store.
- **Fix:** Use a deep merge or `set((state) => ({ ...state, ...partial }))`:

  ```ts
  setInformation: (informations) =>
    set((state) => ({ ...state, ...informations })),
  ```

  Or, better, split the store into per-step slices (`personalInfoStore`,
  `contactStore`, `languageStore`, `experienceStore`) and a thin
  `useAllInformations()` selector that composes them. That removes the merge
  problem entirely and matches the per-step page flow.

### 3.2 Persist the store to `localStorage`

- **Problem:** Currently the form state lives in memory only. Refreshing the
  browser mid-flow wipes every entry. Users typing in 4 pages worth of
  content would be very annoyed.
- **Fix:** Either use `zustand/middleware`'s `persist` middleware on
  `informationStore`, or persist per-page on submit. The `persist` middleware
  is the lower-effort option and fits the existing shape:

  ```ts
  import { persist, createJSONStorage } from "zustand/middleware";

  export const informationStore = create<InformationStoreT>()(
    persist((set) => ({ ... }), {
      name: "prezentme.information",
      storage: createJSONStorage(() => localStorage),
    }),
  );
  ```

  Also consider versioned migrations (`version` + `migrate`) so future schema
  changes don't break returning users.

### 3.3 `pageStore.page` should be derived from the URL

- **File:** `prezentme/store/index.ts` + `app/generate/page.tsx`
- **Problem:** The current step is held in Zustand but every page transition
  is already navigating to/from a single route. There's no back/forward
  support, no deep linking, and a refresh always returns to step 0.
- **Fix:** Convert each step into its own route
  (`/generate/personal-info`, `/generate/contact`, …) and let `useRouter`
  drive navigation. The store becomes a cache for the data, not the source
  of truth for position. Combine with §3.2 to make a true multi-step form
  with URL persistence.

---

## 4. Medium Priority — Component Quality

### 4.1 The `Input` component has a prop-typing bug

- **File:** `prezentme/components/input.tsx`
- **Problem:** `InputHTMLAttributes<HTMLInputElement> & { label: string }` is
  an intersection, but the file destructures `props.id` and uses
  `props.label` while still spreading the rest. That's fine, but the
  component is **inconsistent with `TextArea`**: `TextArea` accepts a `className`
  via `cn()` merging, while `Input` hard-codes its classes (no `cn`,
  no override). And `Input` cannot forward refs (no `forwardRef`), which is
  needed for `react-hook-form`'s focus-on-error behaviour.
- **Fix:**
  - Use `forwardRef<HTMLInputElement, Props>` and spread `...props` correctly.
  - Use `cn([...base, props.className])` for parity with `TextArea`.
  - Add an `error?: string` prop and render it under the field — required to
    surface Zod validation errors that `personalInfoSchema` etc. can now
    produce.

### 4.2 `Button` is not a `forwardRef`, doesn't expose variants

- **File:** `prezentme/components/button.tsx`
- **Problem:** All four pages use the same black `<Button>`. There's already
  a "secondary" need (the `Add language` / `Add experience` actions feel
  secondary). Hard-coding styles prevents that.
- **Fix:** Introduce a `variant: "primary" | "secondary"` and
  `size: "sm" | "md"` prop, and forward refs. Also extract a shared
  `.btn` style group so future variants don't duplicate Tailwind classes.

### 4.3 The trash / field array block is duplicated

- **Files:** `3-language.tsx` and `4-experience.tsx` (the `<Trash />` + the
  bordered card are nearly identical)
- **Problem:** Same JSX, same `cn()` ternary for "disabled at 1 item",
  same wrapper classes.
- **Fix:** Extract `<RepeatableFieldGroup>` that takes `field`, `index`,
  `register`, `remove`, `disabled`, and renders the card + trash icon. Keep
  the inner fields as a render-prop (`children`).

### 4.4 Inline-icons-as-buttons is not accessible

- **Files:** `3-language.tsx` and `4-experience.tsx`
- **Problem:** The `Trash` icon from `lucide-react` is given `onClick` and
  `cursor-pointer` but no `<button>` wrapper, no `aria-label`, and no
  keyboard handler. It's a clickable element that screen readers and
  keyboard users can't reach.
- **Fix:** Wrap in `<button type="button" aria-label="Remove item"
  onClick={...}>` and apply the icon's class to the button (or use
  `lucide`'s `IconButton` patterns).

### 4.5 Hard-coded width (`w-[26rem]`) in every page

- **Problem:** Magic number duplicated 4×. Not responsive.
- **Fix:** Move to a Tailwind theme token (`max-w-form`, `w-full max-w-md`,
  etc.) and apply it once via `<FormStep>` (§2.2).

---

## 5. Medium Priority — Correctness & Security

### 5.1 User input is injected into HTML unescaped

- **File:** `prezentme/data/information.ts`
- **Problem:** `generateHTML` injects user-supplied strings (`firstName`,
  `description`, `company`, etc.) directly into HTML. A user can include
  `<script>alert(1)</script>` in any field and the downloaded HTML will
  execute it. The same problem applies in `getExperience` and `getLanguage`.
- **Fix:** Add an `escapeHtml` helper:

  ```ts
  const escapeHtml = (s: string) =>
    s.replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!),
    );
  ```

  Apply it at every interpolation site, or switch to a rendering layer that
  escapes by default (see §2.3).

### 5.2 Date math can produce negative durations and `NaN`

- **File:** `prezentme/data/information.ts` (`getExperience`)
- **Problem:** `new Date("2024-05-01T00:00:00") - new Date("2023-06-01T00:00:00")`
  can be negative if the user enters `end < start`. The function silently
  emits `(-1y, -2m)`. Also, an empty `start`/`end` produces `NaN`, which
  becomes the literal string `"NaN"` in the output.
- **Fix:**
  - Validate order and clamp to 0 (or surface a validation error in the
    Zod schema).
  - Default missing values to "Present" and skip the duration calculation
    entirely.
  - Reject `NaN` durations explicitly.

### 5.3 URL inputs are not validated

- **File:** `prezentme/types/form.ts`
- **Problem:** `gitHub` and `linkedIn` are only `nonempty`. A user can enter
  `"javascript:alert(1)"` and it will become a clickable link in the output
  HTML.
- **Fix:** Use `z.string().url()` (or a `.refine()` that requires
  `https://` and a domain) and `email` should use `z.string().email()`.

### 5.4 Downloaded HTML references remote Google Fonts unconditionally

- **File:** `prezentme/data/template.ts`
- **Problem:** The output HTML always pulls `fonts.googleapis.com`. For
  users who plan to host it on a static site with strict CSP / offline use
  this is a problem.
- **Fix:** Inline the font (`@font-face` with a base64 woff2) or expose a
  toggle for "inline fonts" vs. "use Google Fonts".

### 5.5 XSS in the live preview (if you add one)

- **Note:** Today there is no preview, but §2.5's route handler could
  become one. If so, render the generated HTML in a sandboxed `<iframe
  sandbox="allow-same-origin">` or via `DOMPurify` to avoid the JS-escape
  bypass described in §5.1.

---

## 6. Lower Priority — DX, Testing, Tooling

### 6.1 Add unit tests for `getLanguage` / `getExperience`

- **File:** `prezentme/data/information.ts`
- **Why:** Pure functions that produce user-visible output and currently have
  no test coverage. Edge cases (empty arrays, negative durations, special
  characters) are exactly where bugs hide.
- **Suggestion:** Vitest or the built-in `node --test`. Snapshot the rendered
  HTML for a few fixtures.

### 6.2 Add E2E tests for the multi-step flow

- **Files:** the four `components/pages/*.tsx` + `app/generate/page.tsx`
- **Why:** The wiring between store → form → next page is currently only
  verified by hand. Playwright (or even `react-testing-library` +
  `user-event`) would catch regressions like the "step 1 is actually step 2"
  bug (§1.2) and the "store gets wiped" bug (§3.1).
- **Suggestion:** A single test that fills all four steps and asserts the
  downloaded `Blob` contains the user's name. This would also document the
  intended flow.

### 6.3 Add ESLint rules to catch the patterns found here

- **File:** `prezentme/eslint.config.mjs`
- **Suggestions:**
  - `@typescript-eslint/no-non-null-assertion`
  - `react/jsx-no-target-blank` (the template opens links with
    `target="_blank"` but no `rel="noopener noreferrer"`)
  - `react-hooks/exhaustive-deps` (the language/experience pages have empty
    `useEffect` deps — see §7.1)
  - `jsx-a11y` rules (would have flagged the clickable `<Trash />`)

### 6.4 No CI

- **Suggestion:** Add a GitHub Actions workflow (or equivalent) that runs
  `yarn lint && yarn build` (and tests, once added) on every PR. The Next
  build itself would have caught §1.1.

### 6.5 Strict TypeScript settings can be tightened further

- **File:** `prezentme/tsconfig.json`
- **Suggestions:**
  - `noUncheckedIndexedAccess: true` — would force the array access in
    `app/generate/page.tsx` (`pages[page]`) to handle `undefined`, or be
    narrowed by an explicit check.
  - `noImplicitOverride`, `noFallthroughCasesInSwitch`.

### 6.6 Centralize metadata

- **File:** `prezentme/app/layout.tsx`
- **Suggestion:** Move `title`, `description`, `openGraph`, etc. into a
  single `lib/metadata.ts` (or a Next `Metadata` constant) and import
  per-page. Reuse for the README/OG image.

---

## 7. Low Priority — Cleanups & Consistency

### 7.1 The "append default once" pattern in language/experience pages

- **Files:** `3-language.tsx`, `4-experience.tsx`
- **Problem:** Both use a `hasRun` ref + `useEffect(() => { ... }, [])` to
  append the default row exactly once. This works but is awkward and
  flagged by `react-hooks/exhaustive-deps`.
- **Fix:** Pass the defaults through `react-hook-form`'s `defaultValues`
  instead:

  ```ts
  useForm<LanguageT>({ defaultValues: { language: [DEFAULT_INFORMATIONS.language[0]] } });
  ```

  Then the `useFieldArray` starts with the right length and the effect
  disappears.

### 7.2 `next.config.ts` `outputFileTracingIncludes` typo / unused

- See §1.1. Just delete it.

### 7.3 `globals.css` only contains the Lato font binding

- **File:** `prezentme/app/globals.css`
- **Suggestion:** Move the `@theme` block into a Tailwind theme extension in
  a CSS file dedicated to design tokens, or simply inline the class on the
  `<body>` (Next already applies `lato.variable`).

### 7.4 README is minimal

- **File:** `prezentme/README.md`
- **Suggestions:**
  - Add a "Getting started" section (`yarn install && yarn dev`).
  - Document the data flow (forms → store → `generateHTML`).
  - Add screenshots / a GIF of the multi-step flow.

### 7.5 Type names don't follow convention

- **Files:** `types/form.ts` (`PersonalInfoT`, `ContactT`, `LanguageT`,
  `ExperienceT`) vs. `types/information.ts` (same names, different shapes)
- **Problem:** Two different `LanguageT` and `ExperienceT` types exist. One
  is for the form, one for the stored data. This is a maintenance trap.
- **Fix:** Pick one set of names (e.g. suffix the form schemas with `Schema`
  / `Input`) and reuse the underlying types (§2.4).

### 7.6 `data/template.ts` mixes the CSS and the HTML

- **File:** `prezentme/data/template.ts`
- **Suggestion:** Split into `data/styles.css.ts` and
  `data/template.html.ts` so each file is under ~150 lines.

### 7.7 No accessibility audit

- **Suggestions:** Add labels for every input (`Input` already has one —
  good — but `TextArea` does not), ensure the form has `<form
  aria-labelledby>` headers, and verify focus rings work for keyboard nav.

### 7.8 Hard-coded English copy

- **Problem:** Every label, placeholder, and button is English-only.
- **Suggestion:** Extract strings into `lib/i18n/en.ts` (and later `pt.ts`)
  so the UI is localizable. Not urgent — but trivial to set up while the
  string count is still small.

---

## Suggested Refactor Order

1. **Fix the build** — §1.1, §1.4, §1.2 (rename or relabel so step 1 is
   actually step 1).
2. **Stop data loss** — §3.1 (fix the store merge), §5.3 (URL validation),
   §5.1 (escape HTML).
3. **Add persistence** — §3.2 (`zustand/persist`).
4. **Collapse duplication** — §2.2 (`<FormStep>`), §4.3
   (`<RepeatableFieldGroup>`), §2.1 (page registry).
5. **Move generation server-side** — §2.5 + §2.3 (typed render layer).
6. **Add tests** — §6.1, §6.2.
7. **Polish** — the rest.

Each step is independently shippable. Steps 1–3 are non-breaking bug fixes;
step 4 is mostly refactoring; steps 5+ are larger architectural moves that
benefit from the new test coverage.
