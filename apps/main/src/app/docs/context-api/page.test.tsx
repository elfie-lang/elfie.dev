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

describe("Context API page", () => {
  // @lfy def/documentation/pages/context-api.lfy:ContextApiPage#ContextApiPage:documentationPage:b5d7e93315026e3a61ba8074f287aea08f6fc8289936e5c4172c8b7068c6f7b4
  test("The page is a DocumentationLayout whose current slug is context-api", async () => {
    const element = (await page.default()) as LayoutElement;
    expect(element.type).toBe(DocumentationLayout);
    expect(element.props.currentSlug).toBe("context-api");
  });

  // @lfy def/documentation/pages/context-api.lfy:ContextApiPage#ContextApiPage:documentationPage:781eec0f6f1829c8eec2be02a8c12039e6ea342caaa012fba836c306a6947ad5
  test("The metadata names the page", () => {
    expect(page.metadata.title).toBe("Context API · Elfie documentation");
    expect(page.metadata.description).toBe(
      "The Context API page of the documentation",
    );
  });

  // @lfy def/documentation/pages/context-api.lfy:ContextApiPage#ContextApiPage:documentationArticle:10b7bd28f2616fbf27104c15d81745d67c402923f4ef4f2e336279fe6c1feb36
  test("The content is an Article for context-api", async () => {
    const element = (await page.default()) as LayoutElement;
    expect(element.props.content.type).toBe(Article);
    expect(element.props.content.props.slug).toBe("context-api");
  });

  // @lfy def/documentation/pages/context-api.lfy:ContextApiPage#ContextApiPage:documentationArticle:ab5115b986655c5b84cde2e3a46dfd2ab414a39a17ada3c4805eb1e31fe74cf0
  // @lfy def/documentation/pages/context-api.lfy:ContextApiPage#ContextApiPage:documentationArticle:47100568f245a173d481704e4a4c143223e8c65b8d9943bc2ebaee4e0a4e7017
  test("The Markdown equals content/docs/context-api.md", async () => {
    const element = (await page.default()) as LayoutElement;
    const source = await Bun.file(
      new URL("../../../../../../content/docs/context-api.md", import.meta.url),
    ).text();
    expect(element.props.content.props.source).toBe(source);
    expect(source).toHaveLength(4582);
  });
});
