import { describe, expect, test } from "bun:test";
import type { ReactElement } from "react";

import { Article } from "@/components/documentation/article";
import { DocumentationLayout } from "@/components/documentation/layout";

import CompilerDetailsPage, { metadata } from "./page";

type PageElement = ReactElement<{
  currentSlug: string;
  content: ReactElement<{ slug: string; source: string }>;
}>;

// @lfy def/documentation/pages/compiler-details.lfy:CompilerDetailsPage
describe("CompilerDetailsPage", () => {
  // @lfy def/documentation/pages/compiler-details.lfy:CompilerDetailsPage#CompilerDetailsPage:page:0efca0dd3c3b3f356b343f3f16acb6a5dc5ef9a25f8d3644d549b167ae5cbb47
  // @lfy def/documentation/pages/compiler-details.lfy:CompilerDetailsPage#CompilerDetailsPage:documentationPage:4ceb3f22d087cac11f00919a268cd895422f46cab08b573d07d4edaa62e9f119
  test("is an async page shown in a DocumentationLayout for compiler-details", async () => {
    const page = (await CompilerDetailsPage()) as PageElement;
    expect(page.type).toBe(DocumentationLayout);
    expect(page.props.currentSlug).toBe("compiler-details");
  });

  // @lfy def/documentation/pages/compiler-details.lfy:CompilerDetailsPage#CompilerDetailsPage:documentationPage:fa680a6af2fffb5f8797ab440f5979e934678442ae7ee51e8750060205913acb
  test("has its title and its description without backticks as metadata", () => {
    expect(metadata.title).toBe("Compiler details · Elfie documentation");
    expect(metadata.description).toBe(
      "What happens between elfie compile and reviewed output, and the choices behind the design.",
    );
  });

  // @lfy def/documentation/pages/compiler-details.lfy:CompilerDetailsPage#CompilerDetailsPage:documentationArticle:68fc0e28d65350069ff8589203f3bff8f3761109081f1e1839a15a97e141a239
  test("shows an Article for compiler-details as the layout's content", async () => {
    const page = (await CompilerDetailsPage()) as PageElement;
    expect(page.props.content.type).toBe(Article);
    expect(page.props.content.props.slug).toBe("compiler-details");
  });

  // @lfy def/documentation/pages/compiler-details.lfy:CompilerDetailsPage#CompilerDetailsPage:documentationArticle:849bc562b9bc2fab33153e90692d221b6f521e621f82846fa46f70f35b3504d2
  // @lfy def/documentation/pages/compiler-details.lfy:CompilerDetailsPage#CompilerDetailsPage:documentationArticle:a4a42f88cc2f535837968e7ce4b7e453d5bdce5f3a09bd6ab2f2282a475f4e30
  test("holds the Markdown of content/docs/compiler-details.md", async () => {
    const page = (await CompilerDetailsPage()) as PageElement;
    const file = await Bun.file(
      new URL("../../../../../../content/docs/compiler-details.md", import.meta.url),
    ).text();
    expect(page.props.content.props.source).toBe(file);
    expect(file).toHaveLength(7386);
  });
});
