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

describe("Custom compile targets page", () => {
  // @lfy def/documentation/pages/custom-compile-targets.lfy:CustomCompileTargetsPage#CustomCompileTargetsPage:documentationPage:55c366eba14ff0eb8120639eb5e13861ea4ab2bd07305ee8c48a04b321bc95ec
  test("The page is a DocumentationLayout whose current slug is custom-compile-targets", async () => {
    const element = (await page.default()) as LayoutElement;
    expect(element.type).toBe(DocumentationLayout);
    expect(element.props.currentSlug).toBe("custom-compile-targets");
  });

  // @lfy def/documentation/pages/custom-compile-targets.lfy:CustomCompileTargetsPage#CustomCompileTargetsPage:documentationPage:48277fba9b4aa728f7889fdcbde77716294018b64d921af4a96c4ba09c4fa735
  test("The metadata names the page", () => {
    expect(page.metadata.title).toBe(
      "Custom compile targets · Elfie documentation",
    );
    expect(page.metadata.description).toBe(
      "The Custom compile targets page of the documentation",
    );
  });

  // @lfy def/documentation/pages/custom-compile-targets.lfy:CustomCompileTargetsPage#CustomCompileTargetsPage:documentationArticle:7a6e175893db297697bc44a2627460e9a0237bacae538ee48d956a78f775151d
  test("The content is an Article for custom-compile-targets", async () => {
    const element = (await page.default()) as LayoutElement;
    expect(element.props.content.type).toBe(Article);
    expect(element.props.content.props.slug).toBe("custom-compile-targets");
  });

  // @lfy def/documentation/pages/custom-compile-targets.lfy:CustomCompileTargetsPage#CustomCompileTargetsPage:documentationArticle:bfc7db7e9da6a2e7c8612a428a9a2c329513f0bc7007bb2b0ff15c28a609ff8f
  // @lfy def/documentation/pages/custom-compile-targets.lfy:CustomCompileTargetsPage#CustomCompileTargetsPage:documentationArticle:9142a19096fef5086c63ebede5c9fbf4d1be77d092de375b5828339f77d87754
  test("The Markdown equals content/docs/custom-compile-targets.md", async () => {
    const element = (await page.default()) as LayoutElement;
    const source = await Bun.file(
      new URL(
        "../../../../../../content/docs/custom-compile-targets.md",
        import.meta.url,
      ),
    ).text();
    expect(element.props.content.props.source).toBe(source);
    expect(source).toHaveLength(5359);
  });
});
