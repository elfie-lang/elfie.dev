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

describe("Getting started page", () => {
  // @lfy def/documentation/pages/getting-started.lfy:GettingStartedPage#GettingStartedPage:documentationPage:5508b8284c897385c88e847845aec57d4a1248f6c866fe3e047dcf725f995ac2
  test("The page is a DocumentationLayout whose current slug is getting-started", async () => {
    const element = (await page.default()) as LayoutElement;
    expect(element.type).toBe(DocumentationLayout);
    expect(element.props.currentSlug).toBe("getting-started");
  });

  // @lfy def/documentation/pages/getting-started.lfy:GettingStartedPage#GettingStartedPage:documentationPage:b12e752cc415eb5332b785efd04b26d4cdf891830121077fd16ffa56cf9d44c7
  test("The metadata names the page", () => {
    expect(page.metadata.title).toBe("Getting started · Elfie documentation");
    expect(page.metadata.description).toBe(
      "The Getting started page of the documentation",
    );
  });

  // @lfy def/documentation/pages/getting-started.lfy:GettingStartedPage#GettingStartedPage:documentationArticle:02bc7340b83c048a5515205607bc37d625e9f24b2a58d94b9c3d11116cb39eff
  test("The content is an Article for getting-started", async () => {
    const element = (await page.default()) as LayoutElement;
    expect(element.props.content.type).toBe(Article);
    expect(element.props.content.props.slug).toBe("getting-started");
  });

  // @lfy def/documentation/pages/getting-started.lfy:GettingStartedPage#GettingStartedPage:documentationArticle:fb26f71669f88cf00b7f94fb1f7057a2e896e7f7f4306fb2211eace17c6ff0ec
  // @lfy def/documentation/pages/getting-started.lfy:GettingStartedPage#GettingStartedPage:documentationArticle:007636efa7915027837c8ac1c77834e1dd5e459f2b8665d67861d060fb787512
  test("The Markdown equals content/docs/getting-started.md", async () => {
    const element = (await page.default()) as LayoutElement;
    const source = await Bun.file(
      new URL(
        "../../../../../../content/docs/getting-started.md",
        import.meta.url,
      ),
    ).text();
    expect(element.props.content.props.source).toBe(source);
    expect(source).toHaveLength(5724);
  });
});
