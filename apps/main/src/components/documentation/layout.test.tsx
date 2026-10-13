import { describe, expect, mock, test } from "bun:test";
import type { ReactElement } from "react";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

mock.module("next/navigation", () => ({
  useRouter: () => ({ push: () => undefined }),
}));

// The menu's state lives here, so a press can be followed across renders without a DOM.
let menuState: { value: unknown } | undefined;
mock.module("react", () => ({
  ...React,
  useReducer: <S,>(reducer: (state: S) => S, initial: S) => {
    const value = (menuState?.value ?? initial) as S;
    return [
      value,
      () => {
        menuState = { value: reducer(value) };
      },
    ];
  },
}));

const layout = await import("./layout");
const { DocumentationLayout } = layout;
const { Navigation } = await import("./navigation");
const { DocumentationSearch } = await import("./search");

function elementsOfType(root: unknown, type: unknown): ReactElement[] {
  const found: ReactElement[] = [];
  const walk = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node && typeof node === "object" && "props" in node) {
      const element = node as ReactElement<{ children?: unknown }>;
      if (element.type === type) found.push(element);
      walk(element.props.children);
    }
  };
  walk(root);
  return found;
}

function children(element: ReactElement): ReactElement[] {
  const value = (element.props as { children?: unknown }).children;
  return (Array.isArray(value) ? value : [value]) as ReactElement[];
}

function renderLayout(): { tree: ReactElement; html: string } {
  let tree: ReactElement | undefined;
  function Capture() {
    tree = DocumentationLayout({ currentSlug: "traits", content: <p>Body text</p> });
    return tree;
  }
  const html = renderToStaticMarkup(<Capture />);
  if (!tree) throw new Error("DocumentationLayout did not render");
  return { tree, html };
}

function menuButton(tree: ReactElement): ReactElement<{ onClick: () => void }> {
  const button = elementsOfType(tree, "button")[0];
  if (!button) throw new Error("no menu button");
  return button as ReactElement<{ onClick: () => void }>;
}

describe("DocumentationLayout", () => {
  // @lfy def/documentation/layout.lfy:DocumentationLayout#DocumentationLayout:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
  test("is a named export and there is no default export", () => {
    expect(layout.DocumentationLayout.name).toBe("DocumentationLayout");
    expect("default" in layout).toBe(false);
  });

  // @lfy def/documentation/layout.lfy:DocumentationLayout#DocumentationLayout:DocumentationLayout:aef290b1060d216c63abcdd0fc633a392446329ec87bf860a3b6121fa4d298c1
  test("Header with the search, the two columns, then the Footer", async () => {
    menuState = undefined;
    const { tree, html } = renderLayout();
    const top = children(tree);
    expect(top[0]?.type).toBe(Header);
    expect((top[0]?.props as { content: ReactElement }).content.type).toBe(DocumentationSearch);
    expect(top[top.length - 1]?.type).toBe(Footer);
    expect(html).toContain(
      "An early language, a little magic. Site content is a conceptual draft.",
    );
    const css = await Bun.file(new URL("./layout.module.css", import.meta.url)).text();
    expect(css).toMatch(/\.layout \{[^}]*min-block-size: 100dvh;/);
    expect(css).toMatch(/\.workspace \{[^}]*flex: 1 0 auto;[^}]*max-inline-size: 1280px;[^}]*margin-inline: auto;/);
    expect(css).toMatch(/grid-template-columns: 220px minmax\(0, 1fr\);\s*gap: var\(--space-44\);\s*padding-block: var\(--space-48\) var\(--space-0\);\s*padding-inline: var\(--space-64\);/);
  });

  // @lfy def/documentation/layout.lfy:DocumentationLayout#DocumentationLayout:DocumentationLayout:04239c7563e8e8d6ddf789ccd269408c49bf1b8dc7564a62a9e352e86d25a6fc
  test("Navigation is given currentSlug", () => {
    menuState = undefined;
    const navigations = elementsOfType(renderLayout().tree, Navigation);
    expect(navigations.length).toBeGreaterThan(0);
    for (const navigation of navigations) {
      expect((navigation.props as { currentSlug?: string }).currentSlug).toBe("traits");
    }
  });

  // @lfy def/documentation/layout.lfy:DocumentationLayout#DocumentationLayout:DocumentationLayout:8c144fed1cc44cbc0cc277e9ef7fb313b33f1d43d45f13c7fe847fe01977c0c2
  test("content is inside a main element", () => {
    menuState = undefined;
    expect(renderLayout().html).toMatch(/<main[^>]*><p>Body text<\/p><\/main>/);
  });

  // @lfy def/documentation/layout.lfy:DocumentationLayout#DocumentationLayout:DocumentationLayout:49210b7e86b5f920e49add12b728751fe567a322df1f15a15a0024e6901ba7af
  test("Navigation is rendered once and no id repeats", () => {
    menuState = undefined;
    const { tree, html } = renderLayout();
    expect(elementsOfType(tree, Navigation).length).toBe(1);
    const ids = [...html.matchAll(/\sid="([^"]*)"/g)].map((match) => match[1]);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });

  // @lfy def/documentation/layout.lfy:DocumentationLayout#DocumentationLayout:DocumentationLayout:013e30f691acf9e48115074f565669e6dd49e3cc217a9bf4729a77ce211aa82b
  test("below 900px a Documentation menu button shows and hides Navigation above the content", async () => {
    menuState = undefined;
    const first = renderLayout();
    const button = first.html.match(/<button([^>]*)>Documentation menu<\/button>/);
    expect(button).not.toBeNull();
    const controls = button?.[1]?.match(/aria-controls="([^"]*)"/)?.[1];
    expect(controls).toBeTruthy();
    expect(button?.[1]).toContain('aria-expanded="false"');
    const navigation = first.html.match(new RegExp(`<aside([^>]*)id="${controls}"([^>]*)>`));
    expect(navigation).not.toBeNull();
    expect(navigation?.[0]).toContain('data-expanded="false"');
    expect(first.html.indexOf("Documentation menu")).toBeLessThan(first.html.indexOf("<aside"));
    expect(first.html.indexOf("<aside")).toBeLessThan(first.html.indexOf("<main"));

    menuButton(first.tree).props.onClick();
    const opened = renderLayout();
    expect(opened.html).toMatch(/<button[^>]*aria-expanded="true"[^>]*>Documentation menu<\/button>/);
    expect(opened.html).toMatch(/<aside[^>]*data-expanded="true"/);

    menuButton(opened.tree).props.onClick();
    const closed = renderLayout();
    expect(closed.html).toMatch(/<button[^>]*aria-expanded="false"[^>]*>Documentation menu<\/button>/);
    expect(closed.html).toMatch(/<aside[^>]*data-expanded="false"/);

    const css = await Bun.file(new URL("./layout.module.css", import.meta.url)).text();
    const narrow = css.slice(0, css.indexOf("@media"));
    expect(narrow).toMatch(/\.workspace \{[^}]*grid-template-columns: minmax\(0, 1fr\);/);
    expect(narrow).toMatch(/\.navigation \{\s*display: none;\s*\}/);
    expect(narrow).toMatch(/\.navigation\[data-expanded="true"\] \{\s*display: block;\s*\}/);
  });

  // @lfy def/documentation/layout.lfy:DocumentationLayout#DocumentationLayout:DocumentationLayout:b5b58d2fcf98689cebe755cd8c1c4b35e24612bbded7d3f4a6d3dd2ad296d643
  test("from 900px the menu button is hidden and Navigation always shows", async () => {
    const css = await Bun.file(new URL("./layout.module.css", import.meta.url)).text();
    const wide = css.slice(css.indexOf("@media (min-width: 900px)"));
    expect(wide).toMatch(/\.menuButton \{\s*display: none;\s*\}/);
    expect(wide).toMatch(/\.navigation \{\s*display: block;\s*\}/);
  });

  // @lfy def/documentation/layout.lfy:DocumentationLayout#DocumentationLayout:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  test("renders as a JSX element", () => {
    expect((<DocumentationLayout currentSlug="traits" content={null} />).type).toBe(
      DocumentationLayout,
    );
  });
});
