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

describe("Configuration page", () => {
  // @lfy def/documentation/pages/configuration.lfy:ConfigurationPage#ConfigurationPage:documentationPage:bfdc4f6496727d05fe1e4203733050a291bbe26077689e24c6df929a924c5385
  test("The page is a DocumentationLayout whose current slug is configuration", async () => {
    const element = (await page.default()) as LayoutElement;
    expect(element.type).toBe(DocumentationLayout);
    expect(element.props.currentSlug).toBe("configuration");
  });

  // @lfy def/documentation/pages/configuration.lfy:ConfigurationPage#ConfigurationPage:documentationPage:bcbc46134506f3a5791f12ad24bd23e289701f8c15a5c57da7cdde3428f92d2f
  test("The metadata names the page", () => {
    expect(page.metadata.title).toBe("Configuration · Elfie documentation");
    expect(page.metadata.description).toBe(
      "The Configuration page of the documentation",
    );
  });

  // @lfy def/documentation/pages/configuration.lfy:ConfigurationPage#ConfigurationPage:documentationArticle:8558eb7036e8d6a43b73e22ebc6dae68b5383dd48a4c77766c1b44a6a3638c1b
  test("The content is an Article for configuration", async () => {
    const element = (await page.default()) as LayoutElement;
    expect(element.props.content.type).toBe(Article);
    expect(element.props.content.props.slug).toBe("configuration");
  });

  // @lfy def/documentation/pages/configuration.lfy:ConfigurationPage#ConfigurationPage:documentationArticle:af34a6add51662efd96ee94e04e1a91c732bc100c04566e57a538baecefcc6bc
  // @lfy def/documentation/pages/configuration.lfy:ConfigurationPage#ConfigurationPage:documentationArticle:f3374aebb468b0767ade962192896c3b6902d24ae62c1e6cc68b756fd76dee52
  test("The Markdown equals content/docs/configuration.md", async () => {
    const element = (await page.default()) as LayoutElement;
    const source = await Bun.file(
      new URL("../../../../../../content/docs/configuration.md", import.meta.url),
    ).text();
    expect(element.props.content.props.source).toBe(source);
    expect(source).toHaveLength(3362);
  });
});
