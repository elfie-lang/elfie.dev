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

describe("CLI reference page", () => {
  // @lfy def/documentation/pages/cli.lfy:CliReferencePage#CliReferencePage:page:2c42043d038ab94b5a271eb3f46ba57f4bf1db64a5c81cc7d63c60ba983b2c71
  test("The page is the async default export of app/docs/cli/page.tsx", () => {
    expect(page.default.name).toBe("CliReferencePage");
    expect(page.default()).toBeInstanceOf(Promise);
  });

  // @lfy def/documentation/pages/cli.lfy:CliReferencePage#CliReferencePage:documentationPage:fa91d894edf1e512e320d180f5a950ff3178aa6fc05e55ce96e58b6d2f832707
  test("The page is a DocumentationLayout whose current slug is cli", async () => {
    const element = (await page.default()) as LayoutElement;
    expect(element.type).toBe(DocumentationLayout);
    expect(element.props.currentSlug).toBe("cli");
  });

  // @lfy def/documentation/pages/cli.lfy:CliReferencePage#CliReferencePage:documentationPage:9742ce36113b09322b83a4366f23a2e841b6532e740711c264053ad7033ed57e
  test("The metadata names the page and describes it without backticks", () => {
    expect(page.metadata.title).toBe("CLI reference · Elfie documentation");
    const description = documentationPageOf("cli")?.description ?? "";
    expect(description).not.toBe("");
    expect(page.metadata.description).toBe(description.replaceAll("`", ""));
  });

  // @lfy def/documentation/pages/cli.lfy:CliReferencePage#CliReferencePage:documentationArticle:20d0c006c1ce005a18a9777c0f7ff3608486116242978b094bcb4718e59c2bad
  test("The content is an Article for cli", async () => {
    const element = (await page.default()) as LayoutElement;
    expect(element.props.content.type).toBe(Article);
    expect(element.props.content.props.slug).toBe("cli");
  });

  // @lfy def/documentation/pages/cli.lfy:CliReferencePage#CliReferencePage:documentationArticle:b462821dc355f9e666c81598f761a090ea384e1d0aaf71cbc97561db3925796a
  // @lfy def/documentation/pages/cli.lfy:CliReferencePage#CliReferencePage:documentationArticle:a4444fa9337392710fd6b7b2d2f46b6567d798c3181fd19f542a517aa406107f
  test("The Markdown equals content/docs/cli.md", async () => {
    const element = (await page.default()) as LayoutElement;
    const source = await Bun.file(
      new URL("../../../../../../content/docs/cli.md", import.meta.url),
    ).text();
    expect(element.props.content.props.source).toBe(source);
    expect(source).toHaveLength(3971);
  });
});
