import { describe, expect, test } from "bun:test";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import * as article from "./article";
import { Article, OnThisPage, Pager } from "./article";
import { DocumentationContent, headingsOf } from "./content";

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

const source = "## First part\n\nText.\n\n## Second part\n\nMore.";

describe("article", () => {
  // @lfy def/documentation/article.lfy:Pager#Pager:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
  // @lfy def/documentation/article.lfy:OnThisPage#OnThisPage:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
  // @lfy def/documentation/article.lfy:Article#Article:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
  test("Pager, OnThisPage, and Article are named exports and there is no default export", () => {
    expect(article.Pager.name).toBe("Pager");
    expect(article.OnThisPage.name).toBe("OnThisPage");
    expect(article.Article.name).toBe("Article");
    expect("default" in article).toBe(false);
  });

  // @lfy def/documentation/article.lfy:Pager#Pager:Pager:b17b9e48392af4fb2dc73cc59488877e40abe5cac02d484f9696f4998514f7e9
  // @lfy def/documentation/article.lfy:Pager#Pager:Pager:6493642acc7e89d3b572efebd62e6b08afad88fa0b21f0230c3773c484ef4294
  // @lfy def/documentation/article.lfy:Pager#Pager:Pager:57aefce53ef117b3ed5b5e89d9734e6dd89f45212508dfceef1f5a4cb0112355
  test("Pager links the previous and next pages", () => {
    const html = renderToStaticMarkup(<Pager slug="getting-started" />);
    expect(html).toContain("Previous");
    expect(html).toMatch(/href="\/docs"[^>]*><span>← Overview<\/span>/);
    expect(html).toContain("Next");
    expect(html).toMatch(/href="\/docs\/your-first-program"[^>]*><span>Your first program →<\/span>/);
    expect(html.indexOf("Previous")).toBeLessThan(html.indexOf("Next"));
  });

  // @lfy def/documentation/article.lfy:Pager#Pager:Pager:07dfa414c9d062bfbcead06f4006f2677582fc334e56b18e1af00cbb210dca3c
  test("Pager without a previous page keeps an empty left side", () => {
    const html = renderToStaticMarkup(<Pager slug="overview" />);
    expect(html).not.toContain("Previous");
    expect(html).toMatch(/<nav[^>]*><div[^>]*><\/div><div[^>]*><p[^>]*>Next<\/p>/);
  });

  // @lfy def/documentation/article.lfy:Pager#Pager:Pager:82bfbda4c90a051e8f917a75d44113c58adc8975081d7bc8395b0d253ed5b62c
  test("Pager is a nav named Pages", () => {
    expect(renderToStaticMarkup(<Pager slug="traits" />)).toMatch(/^<nav[^>]*aria-label="Pages"/);
  });

  // @lfy def/documentation/article.lfy:OnThisPage#OnThisPage:OnThisPage:cfbdf7c86e28315159990faced5b42e8af219772da40831765aee3eb98d09792
  test("OnThisPage lists one link per heading", () => {
    const html = renderToStaticMarkup(<OnThisPage headings={headingsOf(source)} />);
    expect(html).toContain("On this page</p>");
    expect(html).toMatch(/href="#first-part"[^>]*>First part<\/a>/);
    expect(html).toMatch(/href="#second-part"[^>]*>Second part<\/a>/);
  });

  // @lfy def/documentation/article.lfy:OnThisPage#OnThisPage:OnThisPage:401bdccc9daf43d0d148e4f27effb5b3e1703e3be07fc66f2bf68170ec7ce4f4
  test("OnThisPage ends with the issue link and the note", () => {
    const html = renderToStaticMarkup(<OnThisPage headings={[]} />);
    expect(html).toMatch(/<hr[^>]*\/?>[\s\S]*href="https:\/\/github.com\/elfie-lang\/elfie\/issues"/);
    expect(html).toContain("<span>Report an issue</span>");
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("Found something unclear? Share a documentation suggestion.");
  });

  // @lfy def/documentation/article.lfy:OnThisPage#OnThisPage:OnThisPage:1d4efd95c9c5c973c5d6731dd85de6d21676bd7044f35a53af1f465165b92068
  test("OnThisPage without headings leaves out the label and links", () => {
    const html = renderToStaticMarkup(<OnThisPage headings={[]} />);
    expect(html).not.toContain("On this page</p>");
    expect(html).not.toContain('href="#');
  });

  // @lfy def/documentation/article.lfy:OnThisPage#OnThisPage:OnThisPage:61fbcb9beba0a73f14bcf403f9ccaed5901b3188b1d5ed2475191b0fbac283a8
  test("OnThisPage is a nav named On this page", () => {
    expect(renderToStaticMarkup(<OnThisPage headings={[]} />)).toMatch(
      /<nav[^>]*aria-label="On this page"/,
    );
  });

  // @lfy def/documentation/article.lfy:OnThisPage#OnThisPage:OnThisPage:3eeec83ed9ce21e193ced687aa64640c0b333b94b813498ed97981bc8fcf4fbd
  // @lfy def/documentation/article.lfy:Article#Article:Article:7e1889d9734b3657b49b25e60f91ae1f09c5bf9e1024492d0a1bebbc15135b99
  test("the stylesheet keeps On this page in view and hides it below 1200px", async () => {
    const css = await Bun.file(new URL("./article.module.css", import.meta.url)).text();
    expect(css).toMatch(/\.onThisPage \{[^}]*position: sticky;[^}]*inset-block-start: var\(--space-32\);/);
    expect(css).toMatch(/\.aside \{\s*display: none;\s*\}/);
    expect(css).toMatch(/@media \(min-width: 1200px\) \{[\s\S]*\.aside \{\s*display: block;/);
  });

  // @lfy def/documentation/article.lfy:Article#Article:Article:e1a65f1d38024f5e766026760726feb2f47775ab202d572059982986c5717192
  // @lfy def/documentation/article.lfy:Article#Article:Article:0320878391025e794b379d293f06f8572c048fb69acd030de24102c8b2d0c20a
  test("the introduction shows the breadcrumb, the only h1, the description, and the section", () => {
    const html = renderToStaticMarkup(<Article slug="agentic-structures" source={source} />);
    expect(html).toMatch(/<a[^>]*href="\/docs"[^>]*>Documentation<\/a> \/ Agentic structures/);
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toMatch(/<h1[^>]*>Agentic structures<\/h1>/);
    expect(html).toMatch(/<code[^>]*>d<\/code> and <code[^>]*>fn<\/code> are the heart of Elfie/);
    expect(html).toMatch(/<span[^>]*>Language guide<\/span>/);
  });

  // @lfy def/documentation/article.lfy:Article#Article:Article:e3eece55da46c4626aa6ceb70035c3c7fb309c88ed04315478a0ae5e074d074f
  // @lfy def/documentation/article.lfy:Article#Article:Article:357302466d306ec3e28e0bbcfda181fad545648be1c16d3f6ebf1e88563ed0f9
  // @lfy def/documentation/article.lfy:Article#Article:Article:d221fdc1088c5029e148c0b48e9d97c64895017c86d7df51373a5c6c3a4a0db6
  test("the body is DocumentationContent and the side column OnThisPage", () => {
    const element = Article({ slug: "traits", source });
    const contents = elementsOfType(element, DocumentationContent);
    expect(contents).toHaveLength(1);
    expect((contents[0]?.props as { source: string }).source).toBe(source);
    const onThisPage = elementsOfType(element, OnThisPage);
    expect((onThisPage[0]?.props as { headings: unknown }).headings).toEqual(headingsOf(source));
    expect(renderToStaticMarkup(element)).not.toContain('aria-label="Documentation"');
  });

  // @lfy def/documentation/article.lfy:Article#Article:Article:59a30d7efff600994a49c1289a0d7a0a598466b68f5c2d6feb78d13112079e79
  test("after the body come a divider, the Pager, and the feedback row", () => {
    const element = Article({ slug: "traits", source });
    const pagers = elementsOfType(element, Pager);
    expect((pagers[0]?.props as { slug: string }).slug).toBe("traits");
    const html = renderToStaticMarkup(element);
    const after = html.slice(html.indexOf("Second part"));
    expect(after.indexOf("<hr")).toBeLessThan(after.indexOf('aria-label="Pages"'));
    expect(after.indexOf('aria-label="Pages"')).toBeLessThan(after.indexOf("Was this guide clear?"));
    expect(after).toMatch(/href="https:\/\/github.com\/elfie-lang\/elfie\/issues\/new"[^>]*><span>Share a suggestion<\/span>/);
  });

  // @lfy def/documentation/article.lfy:Article#Article:Article:359c8bbed50d641eac2168d3b3ca3594d908e826307257b38eb110d29e8d4d95
  test("the article column is an article element", () => {
    const html = renderToStaticMarkup(<Article slug="traits" source={source} />);
    expect(html).toMatch(/<article[^>]*>[\s\S]*<h1[\s\S]*Was this guide clear\?[\s\S]*<\/article>/);
  });

  // @lfy def/documentation/article.lfy:Pager#Pager:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  // @lfy def/documentation/article.lfy:OnThisPage#OnThisPage:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  // @lfy def/documentation/article.lfy:Article#Article:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  test("the components render as JSX elements", () => {
    expect((<Pager slug="traits" />).type).toBe(Pager);
    expect((<OnThisPage headings={[]} />).type).toBe(OnThisPage);
    expect((<Article slug="traits" source="" />).type).toBe(Article);
  });
});
