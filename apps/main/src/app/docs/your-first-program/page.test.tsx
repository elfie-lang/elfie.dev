import { describe, expect, test } from "bun:test";
import type { ReactElement } from "react";

import { Article } from "@/components/documentation/article";
import { DocumentationLayout } from "@/components/documentation/layout";

import * as page from "./page";
import YourFirstProgramPage, { metadata } from "./page";

type LayoutElement = ReactElement<{
  currentSlug: string;
  content: ReactElement<{ slug: string; source: string }>;
}>;

async function render(): Promise<LayoutElement> {
  return (await YourFirstProgramPage()) as LayoutElement;
}

describe("your first program page", () => {
  // @lfy def/documentation/pages/your-first-program.lfy:YourFirstProgramPage#YourFirstProgramPage:page:abbd789e3adb0bffa6643337f3722f3addde08247dc5ffd9db68f4048b221189
  test("The page is the default export of app/docs/your-first-program/page.tsx and is async", () => {
    expect(page.default).toBe(YourFirstProgramPage);
    expect(YourFirstProgramPage()).toBeInstanceOf(Promise);
  });

  // @lfy def/documentation/pages/your-first-program.lfy:YourFirstProgramPage#YourFirstProgramPage:documentationPage:f0b4238fd60647ec2c32a0df472f4eae4f8ed2598bd20936821030c23f2dd3da
  test("The page is a DocumentationLayout whose current slug is your-first-program", async () => {
    const root = await render();
    expect(root.type).toBe(DocumentationLayout);
    expect(root.props.currentSlug).toBe("your-first-program");
  });

  // @lfy def/documentation/pages/your-first-program.lfy:YourFirstProgramPage#YourFirstProgramPage:documentationPage:22c113dbea3f28ea44053859df94047e2eff71fb3f781bfcccfd433de90b77a0
  test("The page's metadata title and description", () => {
    expect(metadata.title).toBe("Your first program · Elfie documentation");
    expect(metadata.description).toBe(
      "Build a small command-line greeter in Python. You'll go from an empty project to code that has been generated, tested, and reviewed, and then you'll change it.",
    );
  });

  // @lfy def/documentation/pages/your-first-program.lfy:YourFirstProgramPage#YourFirstProgramPage:documentationArticle:f9a4b642d78b53d7e68f39709fe36a131e0157c74edb5dea89243a215f81fb6b
  test("The layout's content is an Article for your-first-program", async () => {
    const content = (await render()).props.content;
    expect(content.type).toBe(Article);
    expect(content.props.slug).toBe("your-first-program");
  });

  // @lfy def/documentation/pages/your-first-program.lfy:YourFirstProgramPage#YourFirstProgramPage:documentationArticle:a3078eb83fced4349eb90eaf747d9254e866827b61ab60e8d3f810750e90403c
  test("The page holds the Markdown of content/docs/your-first-program.md", async () => {
    const source = (await render()).props.content.props.source;
    const markdown = await Bun.file(
      new URL("../../../../../../content/docs/your-first-program.md", import.meta.url),
    ).text();
    expect(source).toBe(markdown);
    expect(source).toHaveLength(6102);
  });
});
