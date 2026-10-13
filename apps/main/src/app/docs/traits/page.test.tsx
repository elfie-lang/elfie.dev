import { describe, expect, test } from "bun:test";
import type { ReactElement } from "react";

import { Article } from "@/components/documentation/article";
import { DocumentationLayout } from "@/components/documentation/layout";

import TraitsPage, { metadata } from "./page";

type PageElement = ReactElement<{
  currentSlug: string;
  content: ReactElement<{ slug: string; source: string }>;
}>;

// @lfy def/documentation/pages/traits.lfy:TraitsPage
describe("TraitsPage", () => {
  // @lfy def/documentation/pages/traits.lfy:TraitsPage#TraitsPage:page:82b23a83e82a2f05d1a71cc8add9d3a294920727dc22e31acc17c94b3c8139e6
  // @lfy def/documentation/pages/traits.lfy:TraitsPage#TraitsPage:documentationPage:cd8115343e241cd19d7110ba980500439075d4f2d688fe0f66b975aff14dbcb4
  test("is an async page shown in a DocumentationLayout for traits", async () => {
    const page = (await TraitsPage()) as PageElement;
    expect(page.type).toBe(DocumentationLayout);
    expect(page.props.currentSlug).toBe("traits");
  });

  // @lfy def/documentation/pages/traits.lfy:TraitsPage#TraitsPage:documentationPage:58e83c22b5eb1ce25a8579129f4fc4fd2d5dc5680d324a4432d50de677216a94
  test("has its title and its description without backticks as metadata", () => {
    expect(metadata.title).toBe("Traits · Elfie documentation");
    expect(metadata.description).toBe(
      "A trait packages members, criteria, and rules so that many entities can share them. Traits are how Elfie composes behavior, and how targets, frameworks, and team conventions reach your code.",
    );
  });

  // @lfy def/documentation/pages/traits.lfy:TraitsPage#TraitsPage:documentationArticle:6a114a2f7d4598fa3aabfd34f597639b9553f34e463573e06fa3ee276c92cf60
  test("shows an Article for traits as the layout's content", async () => {
    const page = (await TraitsPage()) as PageElement;
    expect(page.props.content.type).toBe(Article);
    expect(page.props.content.props.slug).toBe("traits");
  });

  // @lfy def/documentation/pages/traits.lfy:TraitsPage#TraitsPage:documentationArticle:f2d03f23e35a174d59bea554deee0234291fb4ad84243c866f8437866bee56a3
  // @lfy def/documentation/pages/traits.lfy:TraitsPage#TraitsPage:documentationArticle:5a9c1bdd02c4bccfed1d7ab79ed5e1ba840895d26218715ea303eff22724bc40
  test("holds the Markdown of content/docs/traits.md", async () => {
    const page = (await TraitsPage()) as PageElement;
    const file = await Bun.file(
      new URL("../../../../../../content/docs/traits.md", import.meta.url),
    ).text();
    expect(page.props.content.props.source).toBe(file);
    expect(file).toHaveLength(4759);
  });
});
