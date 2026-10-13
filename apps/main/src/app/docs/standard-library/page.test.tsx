import { describe, expect, test } from "bun:test";
import type { ReactElement } from "react";

import { Article } from "@/components/documentation/article";
import { DocumentationLayout } from "@/components/documentation/layout";

import StandardLibraryPage, { metadata } from "./page";

type PageElement = ReactElement<{
  currentSlug: string;
  content: ReactElement<{ slug: string; source: string }>;
}>;

// @lfy def/documentation/pages/standard-library.lfy:StandardLibraryPage
describe("StandardLibraryPage", () => {
  // @lfy def/documentation/pages/standard-library.lfy:StandardLibraryPage#StandardLibraryPage:page:6a01d38139b100b7b8d9f4a6f601faaa6e766b62c0769607971eea266c168b58
  // @lfy def/documentation/pages/standard-library.lfy:StandardLibraryPage#StandardLibraryPage:documentationPage:9ade808f6afd80cf56c4b65ed47c4d3969a3420ae33888764348b0aeccd319dd
  test("is an async page shown in a DocumentationLayout for standard-library", async () => {
    const page = (await StandardLibraryPage()) as PageElement;
    expect(page.type).toBe(DocumentationLayout);
    expect(page.props.currentSlug).toBe("standard-library");
  });

  // @lfy def/documentation/pages/standard-library.lfy:StandardLibraryPage#StandardLibraryPage:documentationPage:7cb8cc1b043a2256e93b2d9e7bf44d6af8078b1727b458431796a7b071e6849e
  test("has its title and its description without backticks as metadata", () => {
    expect(metadata.title).toBe("Standard library · Elfie documentation");
    expect(metadata.description).toBe(
      "The package elfie: the values every program works with, the system modules for files, paths, JSON, time, and processes, and the vocabulary targets are built from.",
    );
  });

  // @lfy def/documentation/pages/standard-library.lfy:StandardLibraryPage#StandardLibraryPage:documentationArticle:b1bb802db482dc653b54421796d81a9da4dd7411b1c48263fdf30d9e615ae2a7
  test("shows an Article for standard-library as the layout's content", async () => {
    const page = (await StandardLibraryPage()) as PageElement;
    expect(page.props.content.type).toBe(Article);
    expect(page.props.content.props.slug).toBe("standard-library");
  });

  // @lfy def/documentation/pages/standard-library.lfy:StandardLibraryPage#StandardLibraryPage:documentationArticle:163d38f92bd7c1834105128c8f0449fb3e5d26191e0b8868591fa64df3698bb0
  // @lfy def/documentation/pages/standard-library.lfy:StandardLibraryPage#StandardLibraryPage:documentationArticle:4032c1f089535c40779a9f063474c29d7fc56ff0a5bc0a1cd57e6cd270731cfa
  test("holds the Markdown of content/docs/standard-library.md", async () => {
    const page = (await StandardLibraryPage()) as PageElement;
    const file = await Bun.file(
      new URL("../../../../../../content/docs/standard-library.md", import.meta.url),
    ).text();
    expect(page.props.content.props.source).toBe(file);
    expect(file).toHaveLength(6693);
  });
});
