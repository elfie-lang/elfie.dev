import { describe, expect, mock, test } from "bun:test";
import type { ReactElement } from "react";

mock.module("next/navigation", () => ({
  useRouter: () => ({ push: () => undefined }),
}));

const { Article } = await import("@/components/documentation/article");
const { DocumentationLayout } = await import("@/components/documentation/layout");
const page = await import("./page");

type LayoutElement = ReactElement<{
  currentSlug: string;
  content: ReactElement<{ slug: string; source: string }>;
}>;

describe("Context layer page", () => {
  // @lfy def/documentation/pages/context-layer.lfy:ContextLayerPage#ContextLayerPage:documentationPage:0560e0fdecab875ca8d6ee52ed4930cac9b15b47432fb615e9058956bb2f2660
  test("The page is a DocumentationLayout whose current slug is context-layer", async () => {
    const element = (await page.default()) as LayoutElement;
    expect(element.type).toBe(DocumentationLayout);
    expect(element.props.currentSlug).toBe("context-layer");
  });

  // @lfy def/documentation/pages/context-layer.lfy:ContextLayerPage#ContextLayerPage:documentationPage:c67bba916dbfdac224bd8db9878c9134d5189a004d9c76dae5b5828bd558de42
  test("The metadata names the page", () => {
    expect(page.metadata.title).toBe("Context layer · Elfie documentation");
    expect(page.metadata.description).toBe(
      "The Context layer page of the documentation",
    );
  });

  // @lfy def/documentation/pages/context-layer.lfy:ContextLayerPage#ContextLayerPage:documentationArticle:2b3ce126822f989c8bf007088f29c5d61cef4e088c3bb3744e0cd72ea7922834
  test("The content is an Article for context-layer", async () => {
    const element = (await page.default()) as LayoutElement;
    expect(element.props.content.type).toBe(Article);
    expect(element.props.content.props.slug).toBe("context-layer");
  });

  // @lfy def/documentation/pages/context-layer.lfy:ContextLayerPage#ContextLayerPage:documentationArticle:9e665534f006b5f3b53b9f8c69c45c58c5d008160ffc29ff67a7d4523042185f
  // @lfy def/documentation/pages/context-layer.lfy:ContextLayerPage#ContextLayerPage:documentationArticle:be7f177120459c24d022d7a3d2b9531e6e6fe9e423632d1ba59f6799588b2f98
  test("The Markdown equals content/docs/context-layer.md", async () => {
    const element = (await page.default()) as LayoutElement;
    const source = await Bun.file(
      new URL("../../../../../../content/docs/context-layer.md", import.meta.url),
    ).text();
    expect(element.props.content.props.source).toBe(source);
    expect(source).toHaveLength(5645);
  });
});
