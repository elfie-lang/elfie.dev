import { describe, expect, test } from "bun:test";
import type { ReactElement } from "react";

import { Article } from "@/components/documentation/article";
import { DocumentationLayout } from "@/components/documentation/layout";

import TestsAndDocumentationPage, { metadata } from "./page";

type PageElement = ReactElement<{
  currentSlug: string;
  content: ReactElement<{ slug: string; source: string }>;
}>;

// @lfy def/documentation/pages/tests-and-documentation.lfy:TestsAndDocumentationPage
describe("TestsAndDocumentationPage", () => {
  // @lfy def/documentation/pages/tests-and-documentation.lfy:TestsAndDocumentationPage#TestsAndDocumentationPage:page:a368b4de2ed9d1f80e1e5828dd830a6364042b361f2733ab4d8a62702f93ee22
  // @lfy def/documentation/pages/tests-and-documentation.lfy:TestsAndDocumentationPage#TestsAndDocumentationPage:documentationPage:8193afa3f19313af2aee46891116d24bd76c3d522fcebf3ea90aec9edf393577
  test("is an async page shown in a DocumentationLayout for tests-and-documentation", async () => {
    const page = (await TestsAndDocumentationPage()) as PageElement;
    expect(page.type).toBe(DocumentationLayout);
    expect(page.props.currentSlug).toBe("tests-and-documentation");
  });

  // @lfy def/documentation/pages/tests-and-documentation.lfy:TestsAndDocumentationPage#TestsAndDocumentationPage:documentationPage:b9f9e73c57c37379383bf6cc58167eec7b3001c92396f5cde579e381e68db877
  test("has its title and its description without backticks as metadata", () => {
    expect(metadata.title).toBe("Tests & documentation · Elfie documentation");
    expect(metadata.description).toBe(
      "Tests pin down the cases that prose leaves open. Documentation explains your intent to the people who read your definitions, and to the compiler.",
    );
  });

  // @lfy def/documentation/pages/tests-and-documentation.lfy:TestsAndDocumentationPage#TestsAndDocumentationPage:documentationArticle:b6325a635ccb163dbceba10f31ad030933725effc8eb9ad8f3a5bb969975f547
  test("shows an Article for tests-and-documentation as the layout's content", async () => {
    const page = (await TestsAndDocumentationPage()) as PageElement;
    expect(page.props.content.type).toBe(Article);
    expect(page.props.content.props.slug).toBe("tests-and-documentation");
  });

  // @lfy def/documentation/pages/tests-and-documentation.lfy:TestsAndDocumentationPage#TestsAndDocumentationPage:documentationArticle:9db3f0db0c59cf9f54107c04d410487af659d188d81a9f41d1b1c891b21cb496
  // @lfy def/documentation/pages/tests-and-documentation.lfy:TestsAndDocumentationPage#TestsAndDocumentationPage:documentationArticle:d598a3a15faf2d182eefd31a15eaa3f4ee95b1feca7d56eecbc8f0825db7f34e
  test("holds the Markdown of content/docs/tests-and-documentation.md", async () => {
    const page = (await TestsAndDocumentationPage()) as PageElement;
    const file = await Bun.file(
      new URL("../../../../../../content/docs/tests-and-documentation.md", import.meta.url),
    ).text();
    expect(page.props.content.props.source).toBe(file);
    expect(file).toHaveLength(3841);
  });
});
