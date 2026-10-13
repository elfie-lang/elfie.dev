import { describe, expect, test } from "bun:test";
import type { ReactElement } from "react";

import { Article } from "@/components/documentation/article";
import { DocumentationLayout } from "@/components/documentation/layout";

import GlobalPropertiesPage, { metadata } from "./page";

type PageElement = ReactElement<{
  currentSlug: string;
  content: ReactElement<{ slug: string; source: string }>;
}>;

// @lfy def/documentation/pages/global-properties.lfy:GlobalPropertiesPage
describe("GlobalPropertiesPage", () => {
  // @lfy def/documentation/pages/global-properties.lfy:GlobalPropertiesPage#GlobalPropertiesPage:page:9fa7fad4db4f65c68f86a2c6f88833da1035c8f92a589d2d91d6dfd2495d8022
  // @lfy def/documentation/pages/global-properties.lfy:GlobalPropertiesPage#GlobalPropertiesPage:documentationPage:7f3808f124c2d529e7bee81f09ad8d04386427b04d46050f05f341c3de96ecee
  test("is an async page shown in a DocumentationLayout for global-properties", async () => {
    const page = (await GlobalPropertiesPage()) as PageElement;
    expect(page.type).toBe(DocumentationLayout);
    expect(page.props.currentSlug).toBe("global-properties");
  });

  // @lfy def/documentation/pages/global-properties.lfy:GlobalPropertiesPage#GlobalPropertiesPage:documentationPage:1e15b7e7740c3e53ba6fd3cca648067af72584ec803e88c464d4032595a38bfc
  test("has its title and its description without backticks as metadata", () => {
    expect(metadata.title).toBe("Global properties · Elfie documentation");
    expect(metadata.description).toBe(
      "global is the entity that stands for your whole program. What you add to it reaches every entity of every file.",
    );
  });

  // @lfy def/documentation/pages/global-properties.lfy:GlobalPropertiesPage#GlobalPropertiesPage:documentationArticle:de4b45353048ddfb568374d9f88b0209069cdc65702b841de13b1c61a4a77a81
  test("shows an Article for global-properties as the layout's content", async () => {
    const page = (await GlobalPropertiesPage()) as PageElement;
    expect(page.props.content.type).toBe(Article);
    expect(page.props.content.props.slug).toBe("global-properties");
  });

  // @lfy def/documentation/pages/global-properties.lfy:GlobalPropertiesPage#GlobalPropertiesPage:documentationArticle:ba27a69551db43c766420c5e1a0227d5102b668d883b538bd37931f6379c54d1
  // @lfy def/documentation/pages/global-properties.lfy:GlobalPropertiesPage#GlobalPropertiesPage:documentationArticle:52817296c7daa595ca7551548ed3d2ae948991138532ceb71d69349a63f8bc15
  test("holds the Markdown of content/docs/global-properties.md", async () => {
    const page = (await GlobalPropertiesPage()) as PageElement;
    const file = await Bun.file(
      new URL("../../../../../../content/docs/global-properties.md", import.meta.url),
    ).text();
    expect(page.props.content.props.source).toBe(file);
    expect(file).toHaveLength(2458);
  });
});
