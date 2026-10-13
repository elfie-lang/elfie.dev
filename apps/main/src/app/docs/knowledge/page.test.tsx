import { describe, expect, test } from "bun:test";
import type { ReactElement } from "react";

import { Article } from "@/components/documentation/article";
import { DocumentationLayout } from "@/components/documentation/layout";

import KnowledgePage, { metadata } from "./page";

type PageElement = ReactElement<{
  currentSlug: string;
  content: ReactElement<{ slug: string; source: string }>;
}>;

// @lfy def/documentation/pages/knowledge.lfy:KnowledgePage
describe("KnowledgePage", () => {
  // @lfy def/documentation/pages/knowledge.lfy:KnowledgePage#KnowledgePage:page:01f8e003ecf76538661d92e9e5a9206e11f7654a647c8609c311d739e0ae2b26
  // @lfy def/documentation/pages/knowledge.lfy:KnowledgePage#KnowledgePage:documentationPage:f5fcf8892c0d282bdeef5aaa63c7eacf4b252db70e43560701ef46907a61af58
  test("is an async page shown in a DocumentationLayout for knowledge", async () => {
    const page = (await KnowledgePage()) as PageElement;
    expect(page.type).toBe(DocumentationLayout);
    expect(page.props.currentSlug).toBe("knowledge");
  });

  // @lfy def/documentation/pages/knowledge.lfy:KnowledgePage#KnowledgePage:documentationPage:9e030346e1c8d579be5002379d5d124ea62aad3a7e643263d9dab60810799dd4
  test("has its title and its description without backticks as metadata", () => {
    expect(metadata.title).toBe("Knowledge · Elfie documentation");
    expect(metadata.description).toBe(
      "Knowledge is reading material for the compiler: references, examples, and definitions it might not already know. It ships with your code, so every compile reads the same text.",
    );
  });

  // @lfy def/documentation/pages/knowledge.lfy:KnowledgePage#KnowledgePage:documentationArticle:7c3b95e24e097d4e111e4edf7a5b8a6edf10b01f5823bb12fbaaf15bd00dbe05
  test("shows an Article for knowledge as the layout's content", async () => {
    const page = (await KnowledgePage()) as PageElement;
    expect(page.props.content.type).toBe(Article);
    expect(page.props.content.props.slug).toBe("knowledge");
  });

  // @lfy def/documentation/pages/knowledge.lfy:KnowledgePage#KnowledgePage:documentationArticle:ac4787182664a4993d0f8ae900eb3897055038823a25048bdbef58c7770cc1a6
  // @lfy def/documentation/pages/knowledge.lfy:KnowledgePage#KnowledgePage:documentationArticle:e2f377d13559fe87735cb0300dac3384efcf899f25619a87a2eb160912878c47
  test("holds the Markdown of content/docs/knowledge.md", async () => {
    const page = (await KnowledgePage()) as PageElement;
    const file = await Bun.file(
      new URL("../../../../../../content/docs/knowledge.md", import.meta.url),
    ).text();
    expect(page.props.content.props.source).toBe(file);
    expect(file).toHaveLength(2952);
  });
});
