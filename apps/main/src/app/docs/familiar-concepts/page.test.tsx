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

describe("Familiar concepts page", () => {
  // @lfy def/documentation/pages/familiar-concepts.lfy:FamiliarConceptsPage#FamiliarConceptsPage:documentationPage:75119a6b5f536f1e555870f1a4125d18bc0e6e6fca7a80e9f219b9ad39d41954
  test("The page is a DocumentationLayout whose current slug is familiar-concepts", async () => {
    const element = (await page.default()) as LayoutElement;
    expect(element.type).toBe(DocumentationLayout);
    expect(element.props.currentSlug).toBe("familiar-concepts");
  });

  // @lfy def/documentation/pages/familiar-concepts.lfy:FamiliarConceptsPage#FamiliarConceptsPage:documentationPage:ea92972ec7da8f14f47b437c1000561d363271b156c835ff95b4c5f598a569f8
  test("The metadata names the page", () => {
    expect(page.metadata.title).toBe("Familiar concepts · Elfie documentation");
    expect(page.metadata.description).toBe(
      "The Familiar concepts page of the documentation",
    );
  });

  // @lfy def/documentation/pages/familiar-concepts.lfy:FamiliarConceptsPage#FamiliarConceptsPage:documentationArticle:c913482a865285c8a589c179ac8d0425a15929cc31c52b03d6fc512a3bc264ad
  test("The content is an Article for familiar-concepts", async () => {
    const element = (await page.default()) as LayoutElement;
    expect(element.props.content.type).toBe(Article);
    expect(element.props.content.props.slug).toBe("familiar-concepts");
  });

  // @lfy def/documentation/pages/familiar-concepts.lfy:FamiliarConceptsPage#FamiliarConceptsPage:documentationArticle:28d99c78dc528618b28e2ad8bb2a952937fb5092e65ccb27f250f6df3ad5e465
  // @lfy def/documentation/pages/familiar-concepts.lfy:FamiliarConceptsPage#FamiliarConceptsPage:documentationArticle:711e8db8a5259d2e377beaa3d7c9555f59020216d561724315ba45743668b006
  test("The Markdown equals content/docs/familiar-concepts.md", async () => {
    const element = (await page.default()) as LayoutElement;
    const source = await Bun.file(
      new URL(
        "../../../../../../content/docs/familiar-concepts.md",
        import.meta.url,
      ),
    ).text();
    expect(element.props.content.props.source).toBe(source);
    expect(source).toHaveLength(8591);
  });
});
