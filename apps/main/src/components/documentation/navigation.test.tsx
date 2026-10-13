import { describe, expect, test } from "bun:test";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import * as navigation from "./navigation";
import {
  Navigation,
  NavigationItem,
  NavigationSection,
  navigationSections,
} from "./navigation";
import {
  DocumentationSection,
  documentationPages,
  documentationPath,
} from "@/lib/documentation/pages";

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

function navHrefs(html: string): string[] {
  const nav = /<nav[^>]*>([\s\S]*)<\/nav>/.exec(html)?.[1] ?? "";
  return [...nav.matchAll(/href="([^"]*)"/g)].map((match) => match[1] ?? "");
}

describe("navigation", () => {
  // @lfy def/documentation/navigation.lfy:NavigationItem#NavigationItem:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
  // @lfy def/documentation/navigation.lfy:NavigationSection#NavigationSection:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
  // @lfy def/documentation/navigation.lfy:Navigation#Navigation:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
  test("NavigationItem, NavigationSection, and Navigation are named components and there is no default export", () => {
    expect(navigation.NavigationItem).toBeFunction();
    expect(navigation.NavigationItem.name).toBe("NavigationItem");
    expect(navigation.NavigationSection).toBeFunction();
    expect(navigation.NavigationSection.name).toBe("NavigationSection");
    expect(navigation.Navigation).toBeFunction();
    expect(navigation.Navigation.name).toBe("Navigation");
    expect("default" in navigation).toBe(false);
  });

  // @lfy def/documentation/navigation.lfy:NavigationItem#NavigationItem:NavigationItem:661a5b3d6c48efed7635c264e756a0991b9df5a29386ba24da69002906cfdef0
  test("NavigationItem renders its content", () => {
    const html = renderToStaticMarkup(
      <NavigationItem href="/docs/overview" content={<strong>Overview</strong>} />,
    );
    expect(html).toContain('href="/docs/overview"');
    expect(html).toContain("><strong>Overview</strong></a>");
  });

  // @lfy def/documentation/navigation.lfy:NavigationItem#NavigationItem:fromFigma:a7e728db97d634f51f3db7ec3d808cba45748e1b5263a2ea0a10c6798e89e31e
  test("NavigationItem marks the current page as selected", () => {
    const selected = renderToStaticMarkup(
      <NavigationItem href="/docs/traits" content="Traits" current />,
    );
    expect(selected).toContain('aria-current="page"');
    const plain = renderToStaticMarkup(
      <NavigationItem href="/docs/traits" content="Traits" />,
    );
    expect(plain).not.toContain("aria-current");
    const nav = renderToStaticMarkup(<Navigation currentSlug="traits" />);
    expect(nav.match(/aria-current="page"/g)).toHaveLength(1);
    const current = /<a [^>]*aria-current="page"[^>]*>/.exec(nav)?.[0] ?? "";
    expect(current).toContain('href="/docs/traits"');
  });

  // @lfy def/documentation/navigation.lfy:NavigationItem#NavigationItem:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  test("NavigationItem renders as a JSX element", () => {
    const element = <NavigationItem href="/docs/overview" content="Overview" />;
    expect(element.type).toBe(NavigationItem);
    expect(renderToStaticMarkup(element)).toContain("Overview");
  });

  // @lfy def/documentation/navigation.lfy:NavigationSection#NavigationSection:NavigationSection:4d7129945614dabe97bb210e8d8cebca1e43fb4caaca7d6df57a3ed611db2024
  test("NavigationSection uses NavigationItem for the navigation links", () => {
    const links = [
      { label: "Overview", slug: "overview" },
      { label: "Traits", slug: "traits" },
    ];
    const element = NavigationSection({ title: "Start here", links });
    expect(elementsOfType(element, NavigationItem)).toHaveLength(links.length);
    expect(renderToStaticMarkup(element)).toContain("Start here");
  });

  // @lfy def/documentation/navigation.lfy:NavigationSection#NavigationSection:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  test("NavigationSection renders as a JSX element", () => {
    const element = <NavigationSection title="Reference" links={[]} />;
    expect(element.type).toBe(NavigationSection);
    expect(renderToStaticMarkup(element)).toContain("Reference");
  });

  // @lfy def/documentation/navigation.lfy:Navigation#Navigation:Navigation:870a1c679c8387d06b8fb8da36e3e6b4f604f5aa1081b923e1b0e25026013e07
  test("Navigation uses NavigationSection for each of the navigation sections", () => {
    const sections = elementsOfType(Navigation(), NavigationSection);
    expect(sections).toHaveLength(navigationSections.length);
    expect(sections.map((section) => (section.props as { title: string }).title)).toEqual(
      navigationSections.map((section) => section.title),
    );
  });

  // @lfy def/documentation/navigation.lfy:Navigation#Navigation:Navigation:2e82a78b739c380f4ff08163bb088983f9b88f04014fc1aae7bb1ab724d36307
  test("One section per DocumentationSection, listing its pages in order and linking to their paths", () => {
    expect(navigationSections.map((section) => section.title)).toEqual(
      Object.values(DocumentationSection),
    );
    for (const section of navigationSections) {
      expect(section.links).toEqual(
        documentationPages
          .filter((page) => page.section === section.title)
          .map((page) => ({ label: page.title, slug: page.slug })),
      );
    }
    const hrefs = navHrefs(renderToStaticMarkup(<Navigation />));
    expect(hrefs).toEqual(documentationPages.map((page) => documentationPath(page.slug)));
  });

  // @lfy def/documentation/navigation.lfy:Navigation#Navigation:Navigation:5c97f6d0677584bf187bcea8bbff344474963e9bfc592f3be2ddf0ac93344882
  test("The item of currentSlug is the current page", () => {
    const html = renderToStaticMarkup(<Navigation currentSlug="cli" />);
    expect(html.match(/aria-current="page"/g)).toHaveLength(1);
    expect(/<a [^>]*aria-current="page"[^>]*>/.exec(html)?.[0]).toContain('href="/docs/cli"');
    expect(renderToStaticMarkup(<Navigation />)).not.toContain("aria-current");
  });

  // @lfy def/documentation/navigation.lfy:Navigation#Navigation:Navigation:4440dadf60cd77ddd5d72e9561f726c9302b121629cc162f8d0b6a73ae359fa9
  test("Ends with a divider, a link back to Elfie, and the edition note", () => {
    const html = renderToStaticMarkup(<Navigation />);
    const end = html.slice(html.indexOf("</nav>"));
    expect(end).toMatch(/<hr/);
    expect(end).toMatch(/<a[^>]*href="\/"[^>]*>[\s\S]*← Back to Elfie/);
    expect(end).toContain("v0.1-experimental draft");
  });

  // @lfy def/documentation/navigation.lfy:NavigationSection#NavigationSection:NavigationSection:f6d2b795a111796650fcaad9423765c3db7f8fdefc98798d59c242f9551daa3c
  test("NavigationSection shows its title as the section label", () => {
    const html = renderToStaticMarkup(<NavigationSection title="Dive deeper" links={[]} />);
    expect(html).toMatch(/<p[^>]*>Dive deeper<\/p>/);
  });

  // @lfy def/documentation/navigation.lfy:NavigationItem#NavigationItem:NavigationItem:acab698193bc938b4205965663bd1e3bc180b42efc0b1ba68fda777058a9a042
  test("NavigationItem styles the Default, Hover, and Selected variants", async () => {
    const css = await Bun.file(new URL("./navigation.module.css", import.meta.url)).text();
    expect(css).toMatch(/\.item \{[^}]*color: var\(--color-ink-secondary\);/);
    expect(css).toMatch(/\.item:hover \{[^}]*background: var\(--color-action-ink\);[^}]*color: var\(--color-action\);/);
    expect(css).toMatch(/\.item\[aria-current="page"\] \{[^}]*background: var\(--color-feature\);[^}]*color: var\(--color-action\);/);
  });

  // @lfy def/documentation/navigation.lfy:NavigationItem#NavigationItem:NavigationItem:09f31522f5a3d6139a52a4b68543a6e72428d3f6f9f7e00b1fc7fb3df3b2bfee
  test("NavigationItem sets aria-current to page only when current", () => {
    expect(
      renderToStaticMarkup(<NavigationItem href="/docs" content="Overview" current />),
    ).toContain('aria-current="page"');
    expect(renderToStaticMarkup(<NavigationItem href="/docs" content="Overview" />)).not.toContain(
      "aria-current",
    );
  });

  // @lfy def/documentation/navigation.lfy:Navigation#Navigation:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  test("Navigation renders as a JSX element", () => {
    const element = <Navigation />;
    expect(element.type).toBe(Navigation);
    expect(renderToStaticMarkup(element)).toContain("Start here");
  });
});
