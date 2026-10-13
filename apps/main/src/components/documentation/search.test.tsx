import { describe, expect, mock, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

mock.module("next/navigation", () => ({
  useRouter: () => ({ push: () => undefined }),
}));

const search = await import("./search");
const { DocumentationSearch, SearchImage } = search;

describe("DocumentationSearch", () => {
  // @lfy def/documentation/search.lfy:DocumentationSearch#DocumentationSearch:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
  test("is a named export and there is no default export", () => {
    expect(search.DocumentationSearch.name).toBe("DocumentationSearch");
    expect("default" in search).toBe(false);
  });

  // @lfy def/documentation/search.lfy:DocumentationSearch#DocumentationSearch:DocumentationSearch:e9a59f3af2cc8d3b9afb3a594e4a7d3e849634f0f6c0427fd7e777b289b19d0f
  test("shows the magnifying glass, the placeholder, and the shortcut hint", () => {
    const html = renderToStaticMarkup(<DocumentationSearch />);
    expect(html).toContain(`src="${SearchImage}"`);
    expect(html).toContain('placeholder="Search docs"');
    expect(html).toContain("⌘ K</kbd>");
  });

  // @lfy def/documentation/search.lfy:DocumentationSearch#DocumentationSearch:DocumentationSearch:5a1ed5a4b4bab25eacd9a3edb88d2dc7acda44dec07b56b6ed54c07e5689d580
  test("the field is named Search docs", () => {
    expect(renderToStaticMarkup(<DocumentationSearch />)).toMatch(/<input[^>]*aria-label="Search docs"/);
  });

  // @lfy def/documentation/search.lfy:DocumentationSearch#DocumentationSearch:DocumentationSearch:1e9ac72f67e9e12343e69fb94ca52904af2793a533d1e4947f8c274baf904d2d
  test("the field is a combobox controlling a listbox", () => {
    const html = renderToStaticMarkup(<DocumentationSearch />);
    expect(html).toMatch(/<input[^>]*role="combobox"/);
    expect(html).toMatch(/<input[^>]*aria-expanded="false"/);
    const controls = /aria-controls="([^"]+)"/.exec(html)?.[1];
    expect(html).toContain(`id="${controls}"`);
    expect(html).toMatch(new RegExp(`id="${controls}"[^>]*role="listbox"`));
  });

  // @lfy def/documentation/search.lfy:DocumentationSearch#DocumentationSearch:DocumentationSearch:76cae05876b761a04a876fa41db7b9758d7c68c109e65376d2bc102810758f90
  test("the list floats under the field on the surface with the decorative border", async () => {
    const css = await Bun.file(new URL("./search.module.css", import.meta.url)).text();
    const popup = css.match(/\.popup \{([^}]*)\}/)?.[1] ?? "";
    expect(popup).toContain("position: absolute;");
    expect(popup).toContain("inset-block-start: calc(100% + var(--space-4));");
    expect(popup).toContain("min-inline-size: 100%;");
    expect(popup).toContain("background: var(--color-surface);");
    expect(popup).toContain("border: 1px solid var(--color-divider-decorative);");
    expect(popup).toContain("border-radius: var(--radius-control);");
    expect(renderToStaticMarkup(<DocumentationSearch />)).toMatch(/<div[^>]*hidden=""/);
  });

  // @lfy def/documentation/search.lfy:DocumentationSearch#DocumentationSearch:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  test("renders as a JSX element", () => {
    expect((<DocumentationSearch />).type).toBe(DocumentationSearch);
  });
});
