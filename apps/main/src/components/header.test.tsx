import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { LogoImage } from "./atoms";
import * as header from "./header";
import { Header, HeaderItem } from "./header";

function hrefOf(html: string, label: string): string | undefined {
  const match = new RegExp(`<a [^>]*href="([^"]*)"[^>]*>${label}</a>`).exec(html);
  return match?.[1];
}

describe("header", () => {
  // @lfy def/components/header.lfy:Header#Header:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
  // @lfy def/components/header.lfy:HeaderItem#HeaderItem:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
  test("HeaderItem and Header are named components and there is no default export", () => {
    expect(header.HeaderItem).toBeFunction();
    expect(header.HeaderItem.name).toBe("HeaderItem");
    expect(header.Header).toBeFunction();
    expect(header.Header.name).toBe("Header");
    expect("default" in header).toBe(false);
  });

  // @lfy def/components/header.lfy:HeaderItem#HeaderItem:HeaderItem:661a5b3d6c48efed7635c264e756a0991b9df5a29386ba24da69002906cfdef0
  test("HeaderItem renders its content", () => {
    const html = renderToStaticMarkup(
      <HeaderItem href="/docs" content={<strong>Docs</strong>} />,
    );
    expect(html).toContain('href="/docs"');
    expect(html).toContain("><strong>Docs</strong></a>");
  });

  // @lfy def/components/header.lfy:HeaderItem#HeaderItem:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  test("HeaderItem renders as a JSX element", () => {
    const element = <HeaderItem href="/docs" content="Docs" />;
    expect(element.type).toBe(HeaderItem);
    expect(renderToStaticMarkup(element)).toContain("Docs");
  });

  // @lfy def/components/header.lfy:Header#Header:Header:661a5b3d6c48efed7635c264e756a0991b9df5a29386ba24da69002906cfdef0
  test("Header renders its content", () => {
    const html = renderToStaticMarkup(<Header content={<form role="search" />} />);
    expect(html).toContain('<form role="search"></form>');
  });

  // @lfy def/components/header.lfy:Header#Header:Header:e914d50b37e6d75226fe156880116e527e9cd280d68106b639f6cd83cc9dd7f6
  test("Header uses Logo for the logo", () => {
    const html = renderToStaticMarkup(<Header content={null} />);
    expect(html).toContain(`src="${LogoImage}"`);
  });

  // @lfy def/components/header.lfy:Header#Header:Header:db64c671bfb6b8e5802e8b49a16498172412fb3b09dca7889dfdb166495755d7
  test("Header uses HeaderItem for the navigation links", () => {
    const element = Header({ content: null });
    const items: unknown[] = [];
    const walk = (node: unknown): void => {
      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }
      if (node && typeof node === "object" && "props" in node) {
        const typed = node as { type: unknown; props: { children?: unknown } };
        if (typed.type === HeaderItem) items.push(typed);
        walk(typed.props.children);
      }
    };
    walk(element);
    expect(items).toHaveLength(4);
  });

  // @lfy def/components/header.lfy:Header#Header:Header:83dd1370092bfccd1d779662da542898bdd318c0091dd4ab2a542fb28b3e0748
  test("Header links go where they should", () => {
    const html = renderToStaticMarkup(<Header content={null} />);
    expect(hrefOf(html, "Documentation")).toBe("/docs");
    expect(hrefOf(html, "Tutorials")).toBe("/tutorials");
    expect(hrefOf(html, "Community")).toBe("https://github.com/elfie-lang/elfie");
    expect(hrefOf(html, "Download")).toBe(
      "https://github.com/elfie-lang/elfie/releases",
    );
  });

  // @lfy def/components/header.lfy:Header#Header:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  test("Header renders as a JSX element", () => {
    const element = <Header content="Search" />;
    expect(element.type).toBe(Header);
    expect(renderToStaticMarkup(element)).toContain("Search");
  });
});
