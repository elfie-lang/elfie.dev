import { describe, expect, test } from "bun:test";
import type { ReactElement } from "react";

import { Article } from "@/components/documentation/article";
import { DocumentationLayout } from "@/components/documentation/layout";

import ScopeManagementPage, { metadata } from "./page";

type PageElement = ReactElement<{
  currentSlug: string;
  content: ReactElement<{ slug: string; source: string }>;
}>;

// @lfy def/documentation/pages/scope-management.lfy:ScopeManagementPage
describe("ScopeManagementPage", () => {
  // @lfy def/documentation/pages/scope-management.lfy:ScopeManagementPage#ScopeManagementPage:page:b913d8e9cd95013756c8cc8bf37d2efed67f4bbfd231f47b0803e4fbda75609c
  // @lfy def/documentation/pages/scope-management.lfy:ScopeManagementPage#ScopeManagementPage:documentationPage:8066d7b3e0e291cd9a75a4feec28ccb41e55915e4e2df21b05b6daceabe9d897
  test("is an async page shown in a DocumentationLayout for scope-management", async () => {
    const page = (await ScopeManagementPage()) as PageElement;
    expect(page.type).toBe(DocumentationLayout);
    expect(page.props.currentSlug).toBe("scope-management");
  });

  // @lfy def/documentation/pages/scope-management.lfy:ScopeManagementPage#ScopeManagementPage:documentationPage:04edc50f47c1392c7414d3d9511f655e335f5b914d773cde7f286e66cf9c53ab
  test("has its title and its description without backticks as metadata", () => {
    expect(metadata.title).toBe("Scope management · Elfie documentation");
    expect(metadata.description).toBe(
      "The scope layer holds an entity's members. $ reaches into it, traits add to it, and with attaches rules to a single member.",
    );
  });

  // @lfy def/documentation/pages/scope-management.lfy:ScopeManagementPage#ScopeManagementPage:documentationArticle:f819a8120920b08c6baf11f1d5da0c9ef7f7f446b9adca791942fafb04b6296c
  test("shows an Article for scope-management as the layout's content", async () => {
    const page = (await ScopeManagementPage()) as PageElement;
    expect(page.props.content.type).toBe(Article);
    expect(page.props.content.props.slug).toBe("scope-management");
  });

  // @lfy def/documentation/pages/scope-management.lfy:ScopeManagementPage#ScopeManagementPage:documentationArticle:a9ab095d6b4858d910383454601a8edea1699cdc2ca4d41da4f572c2fa52bf75
  // @lfy def/documentation/pages/scope-management.lfy:ScopeManagementPage#ScopeManagementPage:documentationArticle:8757e788b1de6b7f2c13d846030f44b2f09d68e22b1456aea95dcddea2c656d7
  test("holds the Markdown of content/docs/scope-management.md", async () => {
    const page = (await ScopeManagementPage()) as PageElement;
    const file = await Bun.file(
      new URL("../../../../../../content/docs/scope-management.md", import.meta.url),
    ).text();
    expect(page.props.content.props.source).toBe(file);
    expect(file).toHaveLength(3422);
  });
});
