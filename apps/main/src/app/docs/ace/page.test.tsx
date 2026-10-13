import { describe, expect, mock, test } from "bun:test";
import type { ReactElement } from "react";

mock.module("next/navigation", () => ({
  useRouter: () => ({ push: () => undefined }),
}));

const { Article } = await import("@/components/documentation/article");
const { DocumentationLayout } = await import("@/components/documentation/layout");
const { documentationPageOf } = await import("@/lib/documentation/pages");
const page = await import("./page");

type LayoutElement = ReactElement<{
  currentSlug: string;
  content: ReactElement<{ slug: string; source: string }>;
}>;

describe("At Compile Execution (ace) page", () => {
  // @lfy def/documentation/pages/ace.lfy:AtCompileExecutionPage#AtCompileExecutionPage:page:c5692ffaad4decd044d2837abf7bcc9ae62cc9fd74380d2b1ab0e9146c84bd80
  test("The page is the async default export of app/docs/ace/page.tsx", () => {
    expect(page.default.name).toBe("AtCompileExecutionPage");
    expect(page.default()).toBeInstanceOf(Promise);
  });

  // @lfy def/documentation/pages/ace.lfy:AtCompileExecutionPage#AtCompileExecutionPage:documentationPage:7f50f2539ca00c91bd651a63762f066a598c0442f87e4477dc16342208d4f466
  test("The page is a DocumentationLayout whose current slug is ace", async () => {
    const element = (await page.default()) as LayoutElement;
    expect(element.type).toBe(DocumentationLayout);
    expect(element.props.currentSlug).toBe("ace");
  });

  // @lfy def/documentation/pages/ace.lfy:AtCompileExecutionPage#AtCompileExecutionPage:documentationPage:5c061d1ab86b32cbab7372a3e654d203867ded8d9d40ed7c383bc3144e182c43
  test("The metadata names the page and describes it without backticks", () => {
    expect(page.metadata.title).toBe("At Compile Execution (ace) · Elfie documentation");
    const description = documentationPageOf("ace")?.description ?? "";
    expect(description).not.toBe("");
    expect(page.metadata.description).toBe(description.replaceAll("`", ""));
  });

  // @lfy def/documentation/pages/ace.lfy:AtCompileExecutionPage#AtCompileExecutionPage:documentationArticle:f5bcce66ff090346c573346bebee86e28f176c4acde0683da1a5eca020e2a67e
  test("The content is an Article for ace", async () => {
    const element = (await page.default()) as LayoutElement;
    expect(element.props.content.type).toBe(Article);
    expect(element.props.content.props.slug).toBe("ace");
  });

  // @lfy def/documentation/pages/ace.lfy:AtCompileExecutionPage#AtCompileExecutionPage:documentationArticle:8afa87c58e49edacbb2bd456a21d0684fc5737cdafe00dbfe44d33274a3c8267
  // @lfy def/documentation/pages/ace.lfy:AtCompileExecutionPage#AtCompileExecutionPage:documentationArticle:519f79cb44ec4f88f42d8fb890687392e9d67f0699d64a49bfa7cb4a01c4b94c
  test("The Markdown equals content/docs/ace.md", async () => {
    const element = (await page.default()) as LayoutElement;
    const source = await Bun.file(
      new URL("../../../../../../content/docs/ace.md", import.meta.url),
    ).text();
    expect(element.props.content.props.source).toBe(source);
    expect(source).toHaveLength(3283);
  });
});
