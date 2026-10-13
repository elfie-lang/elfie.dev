import { describe, expect, mock, test } from "bun:test";
import type { ReactElement } from "react";

mock.module("next/navigation", () => ({
  useRouter: () => ({ push: () => undefined }),
}));

const { Article } = await import("@/components/documentation/article");
const { DocumentationLayout } = await import("@/components/documentation/layout");
const { documentationPageOf } = await import("@/lib/documentation/pages");
const page = await import("./page");

type LayoutElement = ReactElement<{
  currentSlug: string;
  content: ReactElement<{ slug: string; source: string }>;
}>;

describe("Agentic structures page", () => {
  // @lfy def/documentation/pages/agentic-structures.lfy:AgenticStructuresPage#AgenticStructuresPage:page:46628d9a4fdd9ef1cd41375e30fe362add9f622981322977cc571bddf95c362c
  test("The page is the async default export of app/docs/agentic-structures/page.tsx", () => {
    expect(page.default.name).toBe("AgenticStructuresPage");
    expect(page.default()).toBeInstanceOf(Promise);
  });

  // @lfy def/documentation/pages/agentic-structures.lfy:AgenticStructuresPage#AgenticStructuresPage:documentationPage:903c3754f8453aa21646bf87bcade5f1b930559d8ab09bb7c739a1fea8f82799
  test("The page is a DocumentationLayout whose current slug is agentic-structures", async () => {
    const element = (await page.default()) as LayoutElement;
    expect(element.type).toBe(DocumentationLayout);
    expect(element.props.currentSlug).toBe("agentic-structures");
  });

  // @lfy def/documentation/pages/agentic-structures.lfy:AgenticStructuresPage#AgenticStructuresPage:documentationPage:43d80e041dc55726cd86dd51129069895e83107f3cb46c58a052453786087287
  test("The metadata names the page and describes it without backticks", () => {
    expect(page.metadata.title).toBe("Agentic structures · Elfie documentation");
    const description = documentationPageOf("agentic-structures")?.description ?? "";
    expect(description).not.toBe("");
    expect(page.metadata.description).toBe(description.replaceAll("`", ""));
  });

  // @lfy def/documentation/pages/agentic-structures.lfy:AgenticStructuresPage#AgenticStructuresPage:documentationArticle:c86880e541148a76af77b4247b633e818703c945193f34fa0e84fcf9d91b30cc
  test("The content is an Article for agentic-structures", async () => {
    const element = (await page.default()) as LayoutElement;
    expect(element.props.content.type).toBe(Article);
    expect(element.props.content.props.slug).toBe("agentic-structures");
  });

  // @lfy def/documentation/pages/agentic-structures.lfy:AgenticStructuresPage#AgenticStructuresPage:documentationArticle:7621cbe9f82bc1d2effdd6afe4dc603c2956e7a9f68ff3c1ee402dd6cedba02c
  // @lfy def/documentation/pages/agentic-structures.lfy:AgenticStructuresPage#AgenticStructuresPage:documentationArticle:8d2bd0442ca450b14cc234a42daf031071e2e7fb1250009901584113abe40f8d
  test("The Markdown equals content/docs/agentic-structures.md", async () => {
    const element = (await page.default()) as LayoutElement;
    const source = await Bun.file(
      new URL("../../../../../../content/docs/agentic-structures.md", import.meta.url),
    ).text();
    expect(element.props.content.props.source).toBe(source);
    expect(source).toHaveLength(6133);
  });
});
