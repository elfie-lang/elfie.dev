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

describe("Compile targets page", () => {
  // @lfy def/documentation/pages/compile-targets.lfy:CompileTargetsPage#CompileTargetsPage:page:301cd2eb456e2011a9b103ef1ac3e0e420c73fa17c7eb9b9a5fdd3616e729764
  test("The page is the async default export of app/docs/compile-targets/page.tsx", () => {
    expect(page.default.name).toBe("CompileTargetsPage");
    expect(page.default()).toBeInstanceOf(Promise);
  });

  // @lfy def/documentation/pages/compile-targets.lfy:CompileTargetsPage#CompileTargetsPage:documentationPage:af1e1ec16b33193813041026b4dd535e3ee495583dc72075e6892b14ae46c9c7
  test("The page is a DocumentationLayout whose current slug is compile-targets", async () => {
    const element = (await page.default()) as LayoutElement;
    expect(element.type).toBe(DocumentationLayout);
    expect(element.props.currentSlug).toBe("compile-targets");
  });

  // @lfy def/documentation/pages/compile-targets.lfy:CompileTargetsPage#CompileTargetsPage:documentationPage:bace31beb6af5546674f3a5f4948ad33362e5d58eef88b168475d98efc96d4eb
  test("The metadata names the page and describes it without backticks", () => {
    expect(page.metadata.title).toBe("Compile targets · Elfie documentation");
    const description = documentationPageOf("compile-targets")?.description ?? "";
    expect(description).not.toBe("");
    expect(page.metadata.description).toBe(description.replaceAll("`", ""));
  });

  // @lfy def/documentation/pages/compile-targets.lfy:CompileTargetsPage#CompileTargetsPage:documentationArticle:91f670fcdb943eb50b2fada2d778b74e0ffaff13ecdec0ae86a70334d8795d53
  test("The content is an Article for compile-targets", async () => {
    const element = (await page.default()) as LayoutElement;
    expect(element.props.content.type).toBe(Article);
    expect(element.props.content.props.slug).toBe("compile-targets");
  });

  // @lfy def/documentation/pages/compile-targets.lfy:CompileTargetsPage#CompileTargetsPage:documentationArticle:20994f63c3bafa7ef6b54c4eabdef7839a0f533e41894028b6b6e1cc0969094e
  // @lfy def/documentation/pages/compile-targets.lfy:CompileTargetsPage#CompileTargetsPage:documentationArticle:2a3a19885da8a24fe6f92b43897eb785f487c5de9059aab3eb869bee649d2956
  test("The Markdown equals content/docs/compile-targets.md", async () => {
    const element = (await page.default()) as LayoutElement;
    const source = await Bun.file(
      new URL("../../../../../../content/docs/compile-targets.md", import.meta.url),
    ).text();
    expect(element.props.content.props.source).toBe(source);
    expect(source).toHaveLength(5380);
  });
});
