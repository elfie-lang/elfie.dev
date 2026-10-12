# Modular CSS with CSS modules

A CSS module is a stylesheet whose file name ends in `.module.css`. The build scopes each class in it
to the file that imports it, so two modules can both have a `.title` class without a clash. The import
gives an object mapping each class written in the stylesheet to its scoped name:

```tsx
import styles from "./card.module.css";

export function Card({ title }: CardProps) {
  return <h2 className={styles.title}>{title}</h2>;
}
```

## Where styles live

- **One module per file it styles, beside it, with the same stem.** `card.tsx` imports `./card.module.css`;
  `page.tsx` imports `./page.module.css`. Delete the file and its styles go with it.
- **A module is imported only by the file beside it.** Never import another component's module to reuse or
  override its classes; that couples the two files to each other's markup.
- **One global stylesheet, and only for what is global.** It holds the design tokens as custom properties
  on `:root`, a small reset, and defaults for bare elements (`body`, `a`, `h1`–`h6`). It holds no classes
  for components. It is imported once, at the root of the website.

## Sharing without coupling

- **Share values through custom properties.** Colors, spacing, radii, type sizes, and durations are tokens
  in the global stylesheet: `color: var(--color-ink);`, `gap: var(--space-16);`. Modules read tokens; they
  do not define new global ones.
- **Share styled things through components, not classes.** When two places need the same look, they render
  the same component. A class copied or imported between modules is a component waiting to be extracted.
- **`composes` only within a file, or from a module of shared primitives.** `composes: base;` inside one
  module is fine. `composes: label from "../type.module.css";` is allowed only from a module made to be
  shared, such as typography, never from another component's module.

## Writing the rules

- **Name a class for its role, not its look.** `.title`, `.actions`, `.error` over `.bigGreen`, `.mt8`.
  The module already scopes it, so no prefix like `.card__title` is needed.
- **Write class names in camelCase,** so they read as `styles.heroTitle`, not `styles["hero-title"]`.
- **Select with one class.** No ID selectors, no element selectors inside a module, no long descendant
  chains. Specificity stays at one class, so the order of rules decides, and overriding stays predictable.
  A state on the same element (`.tab[aria-selected="true"]`, `.button:hover`) and a pseudo-element are fine.
- **Style state from what markup already says.** Prefer `[aria-expanded="true"]`, `[aria-current="page"]`,
  `:disabled`, and `:focus-visible` to extra classes such as `.isOpen`; the accessibility attribute must be
  right anyway.
- **Never `!important`; avoid `:global`.** `:global` is only for styling markup the file does not render,
  such as HTML from a CMS, and then only under a local class: `.prose :global(a) { … }`.
- **A component styles its own inside; its parent places it.** A component's root has no outer `margin`
  and no fixed width tied to one layout. The parent sets spacing with `gap` on its own container, and may
  pass a `className` that the component joins onto its root, for placement only (`grid-area`, `align-self`,
  `margin`), never to change its colors or type.
- **Use logical properties** (`margin-inline`, `padding-block`, `inset-inline-start`) so the layout works in
  both reading directions.
- **Lay out with flexbox and grid, and design for the narrowest screen first.** Add `@media (min-width: …)`
  or `@container` queries as space grows. Prefer `@container` when a component's layout depends on where it
  is placed rather than on the window.
- **Respect the viewer.** Wrap motion in `@media (prefers-reduced-motion: no-preference)`. Size type in
  `rem` so it follows the browser's font size. Keep a visible `:focus-visible` outline.

## Dynamic values

- A value known only at run time is passed as a custom property, and the module reads it:
  `<div className={styles.bar} style={{ "--progress": `${pct}%` }} />` with `.bar { inline-size: var(--progress); }`.
- A choice among a few looks is a class per choice, picked by a lookup:
  `const tone = { info: styles.info, error: styles.error }; className={tone[kind]}`.
- Join several classes with a small helper that drops falsy values, rather than template strings with
  conditionals inside.

## Checklist

- [ ] Every stylesheet but the global one ends in `.module.css` and sits beside the one file importing it.
- [ ] Every color, space, radius, and type size reads a token from the global stylesheet.
- [ ] No selector is more specific than one class plus a state; no `!important`; no ID selectors.
- [ ] No component root has an outer margin; parents space their children with `gap`.
- [ ] No `style` attribute sets anything but custom properties.
