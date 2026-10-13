import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import * as content from "./content";
import { DocumentationContent, headingsOf } from "./content";

function render(source: string): string {
  return renderToStaticMarkup(<DocumentationContent source={source} />);
}

describe("headingsOf", () => {
  // @lfy def/documentation/content.lfy:headingsOf#headingsOf:headingsOf:4e09564eb3bdaed01008a0694f0550b776cfbd3592deeea1797765946fbebe93
  test("headings outside code fences, without Markdown", () => {
    expect(
      headingsOf("## The agent server\n\n```text\n## not a heading\n```\n\n## `use` and names"),
    ).toEqual([
      { text: "The agent server", id: "the-agent-server" },
      { text: "use and names", id: "use-and-names" },
    ]);
  });

  // @lfy def/documentation/content.lfy:headingsOf#headingsOf:headingsOf:85cd37ac6f89c6036d4d2f742e88f20121486468e9e56eaf233fac8fb036e270
  test("repeated headings get numbered ids", () => {
    expect(headingsOf("## Data with d\n## Data with d")).toEqual([
      { text: "Data with d", id: "data-with-d" },
      { text: "Data with d", id: "data-with-d-2" },
    ]);
  });

  // @lfy def/documentation/content.lfy:headingsOf#headingsOf:headingsOf:7a642be87545d3f59455fd89f1e7d96e3e74ceb5095780c7949aae1b41589a6f
  test("no headings gives an empty list", () => {
    expect(headingsOf("No headings here")).toEqual([]);
  });

  // @lfy def/documentation/content.lfy:headingsOf#headingsOf:headingsOf:5926789a4d6d04b9b955a8596f2f6bb75bcfd2fe9e197694d9e2989994c06b01
  test("only ## lines outside fences and ::: blocks are headings", () => {
    const source = "## One\n### Two\n:::callout info Note\n## Inside\n:::\n~~~\n## Fenced\n~~~\n## Three";
    expect(headingsOf(source).map((heading) => heading.text)).toEqual(["One", "Three"]);
  });

  // @lfy def/documentation/content.lfy:headingsOf#headingsOf:headingsOf:99312b604528fa358ade0f7955e92b0394383a7dacafe361b4c1e517ef4fbc26
  test("text drops backticks, emphasis, and link targets", () => {
    expect(headingsOf("##   The **bold** `code` and [a link](/docs/x)  ")[0]?.text).toBe(
      "The bold code and a link",
    );
  });

  // @lfy def/documentation/content.lfy:headingsOf#headingsOf:headingsOf:25a1bf424d004822504d7b9685ce51ee2c463a4bbd252949804f9f707501a6b0
  test("ids are lower case runs of a to z and 0 to 9 joined by single hyphens", () => {
    expect(headingsOf("## -- Tests & Documentation (v2)! --")[0]?.id).toBe(
      "tests-documentation-v2",
    );
  });

  // @lfy def/documentation/content.lfy:headingsOf#headingsOf:headingsOf:64ca219ed80b90ac9868cb367c959b3a7398e8237b38de44f7573465b000f32d
  test("third and later duplicates continue the numbering", () => {
    expect(headingsOf("## A\n## A\n## A").map((heading) => heading.id)).toEqual(["a", "a-2", "a-3"]);
  });
});

describe("DocumentationContent", () => {
  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
  test("is a named export and there is no default export", () => {
    expect(content.DocumentationContent.name).toBe("DocumentationContent");
    expect("default" in content).toBe(false);
  });

  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:4a507e6576a28341e9d9e526951fb2509112af45f2ef9ab29cfe3fd34af5e110
  test("renders CommonMark with GitHub tables", () => {
    const html = render("Some *emphasis* and **strong**.\n\n- one\n- two");
    expect(html).toContain("<em>emphasis</em>");
    expect(html).toContain("<strong>strong</strong>");
    expect(html).toContain("<li");
  });

  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:1a5968388df03002ba2616c987baf2d75a1833634a5a5feefc3ca3052f513f90
  test("HTML is shown as text", () => {
    const html = render('<div class="x">block</div>\n\nInline <b>bold</b> here.');
    expect(html).not.toContain("<b>");
    expect(html).not.toContain('<div class="x">');
    expect(html).toContain("&lt;b&gt;bold&lt;/b&gt;");
    expect(html).toContain("&lt;div class=&quot;x&quot;&gt;block&lt;/div&gt;");
  });

  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:14e2549438465360176f5048cafb900f9d5a8b3969b9b763e1bf9711168a0e17
  test("level 2 headings are h2 elements with the ids headingsOf gives", () => {
    const source = "## Data with d\n\nText\n\n:::callout info Hi\nBody\n:::\n\n## Data with d";
    const html = render(source);
    for (const heading of headingsOf(source)) {
      expect(html).toContain(`<h2 id="${heading.id}"`);
    }
  });

  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:b86381b3cf6be1182fd14317e2576d265d7cabccc02247a0c57159b3eda17640
  test("level 3 headings are h3 elements", () => {
    expect(render("### Small")).toMatch(/<h3[^>]*>Small<\/h3>/);
  });

  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:e36cdb3a82cf559940675900d106a0078e7029a6c556f190886e712996524861
  test("inline code is a code element", () => {
    expect(render("Use `fn` here")).toMatch(/<code[^>]*>fn<\/code>/);
  });

  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:a538eb2dbb24dff06fdc5519bb30c409485bd39f8c2f4449e5e8240ba0b5e0dd
  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:982c6b93e71e3b99e7ff02fdf3dbf3633670e9769128d77c806cc70d291df1d0
  test("site links stay in the tab and web links open a new one", () => {
    const html = render("[Traits](/docs/traits) and [GitHub](https://github.com)");
    expect(html).toMatch(/<a[^>]*href="\/docs\/traits"[^>]*>Traits<\/a>/);
    expect(html).not.toMatch(/<a[^>]*href="\/docs\/traits"[^>]*target=/);
    expect(html).toMatch(/<a[^>]*href="https:\/\/github.com"[^>]*target="_blank"[^>]*rel="noopener"/);
  });

  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:3ec809a287ee8c8209f2f3c37882029a3f17c9b8b5828d6a5419ee3cce068c8a
  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:1717bdb154b21f27d74e9555519f33f434801c1b5ca05e5b672afb9b0959e21c
  test("a fence is a CodeBlock with its title and caption", () => {
    const html = render('```ts title="a.ts" caption="A caption"\nconst a = 1;\n```');
    expect(html).toContain("<figure");
    expect(html).toContain("a.ts");
    expect(html).toContain("A caption</figcaption>");
    expect(html).toContain("<code>const a = 1;</code>");
  });

  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:01d90900c73d2e142a56dc349a344f96cbe412e56f2c8d9ce4e158d52c98c294
  test("fences without a title are labeled by their language", () => {
    const labels: [string, string][] = [
      ["lfy", "Elfie"],
      ["bash", "Terminal"],
      ["text", "Output"],
      ["json", "JSON"],
      ["ts", "TypeScript"],
      ["python", "Python"],
      ["rust", "Code"],
      ["", "Code"],
    ];
    for (const [language, label] of labels) {
      expect(render("```" + language + "\nx\n```")).toMatch(new RegExp(`>${label}</span>`));
    }
  });

  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:9374af4d0f7b4db0121ad3a542cc0ef6a63a9e659cadf9e1a9f7bc2590d68618
  test("a table is a Table with inline Markdown cells", () => {
    const html = render("| A | B |\n| --- | --- |\n| `x` | **y** |");
    expect(html).toMatch(/<th[^>]*scope="col"[^>]*>A<\/th>/);
    expect(html).toMatch(/<td[^>]*><code[^>]*>x<\/code><\/td>/);
    expect(html).toMatch(/<td[^>]*><strong>y<\/strong><\/td>/);
  });

  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:2ff91b35607d507e4a07832054d28d014fdf9d9f27aeff31153541f5a31012d3
  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:afc802280118cfb235eaccebd209449bbc6d253879df9e2ff6cd63769755e34d
  test("a callout block is a Callout", () => {
    const html = render(":::callout warning Mind `this`\nThe **body**\n```text\n:::\n```\n:::\nAfter");
    expect(html).toContain('role="note"');
    expect(html).toMatch(/Mind <code[^>]*>this<\/code>/);
    expect(html).toContain("<strong>body</strong>");
    expect(html).toContain("<code>:::</code>");
    expect(html).toMatch(/<p[^>]*>After<\/p>/);
  });

  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:be71616fcfaa4c59c044b77c9abd56015e6c3f6e475eea957e36a5053ea788b2
  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:0a3ebcfb083a3c6ba6abc1e017d8dedcedee1ce5d20ebc901aafef7816c94f23
  test("callout kinds map to CalloutKind", () => {
    expect(render(":::callout tip T\nx\n:::")).toContain('alt="Info"');
    expect(render(":::callout info T\nx\n:::")).toContain('alt="Info"');
    expect(render(":::callout warning T\nx\n:::")).toContain('alt="Warning"');
    expect(render(":::callout danger T\nx\n:::")).toContain('alt="Danger"');
  });

  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:6e261013d958cdd131de72417ba3cc6ea98fd34c0608d1732e6eb55b74fcbcda
  test("a cards block is a CardGrid of ResourceCards", () => {
    const html = render(
      ":::cards\n### First\nmeta: Guide · edit\nSome *text*.\n[Read it →](/docs/traits)\n### Second\nmeta: Ref · terminal\nMore.\n:::",
    );
    expect(html.match(/<article/g)).toHaveLength(2);
    expect(html).toContain("First</h3>");
    expect(html).toContain("Guide</p>");
    expect(html).toContain('alt="Notebook and pen"');
    expect(html).toContain('alt="Terminal"');
    expect(html).toContain('href="/docs/traits"');
    expect(html).toContain("Read it");
    expect(html).toContain("<em>text</em>");
    expect(html).not.toContain("meta:");
  });

  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:f6e9d533af364275e2567ed7cb9f1c3c25882eb947f9eaaeb1ede1c9db2b1d8b
  test("a steps block is Steps", () => {
    const html = render(":::steps\n### Install\nRun it.\n### Use\nCall it.\n:::");
    expect(html).toContain("<ol");
    expect(html.match(/<li/g)).toHaveLength(2);
    expect(html).toContain("Install</h3>");
    expect(html).toContain("Call it.");
  });

  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:1c0abc5b83fe799bea78a9090129a79e1de674b89ddd3113f4b426f019329761
  test("a flow block is a Flow", () => {
    const html = render(":::flow\nLoad | Read `elfie.json`\n\nBind | Resolve names\n:::");
    expect(html.match(/<li/g)).toHaveLength(2);
    expect(html).toContain(">Load</div>");
    expect(html).toMatch(/Read <code[^>]*>elfie.json<\/code>/);
  });

  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:08e19ac1887a7d172ede5dbf5107c185b21feb33f0fe70c34612d4676806ba56
  test("a compare block is Columns of CodeBlocks", () => {
    const html = render(':::compare\n```ts title="TypeScript"\nlet a = 1;\n```\n```lfy\nlet a = 1;\n```\n:::');
    expect(html.match(/<figure/g)).toHaveLength(2);
    expect(html).toContain(">TypeScript</span>");
    expect(html).toContain(">Elfie</span>");
  });

  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:17fce985ad3cfcd2c43c822f7d5ecff47cb1c3e4a87fe1ad26e6e1506bcd67c0
  test("other blocks render their lines as Markdown", () => {
    const html = render(":::aside\nPlain **text**\n:::");
    expect(html).toContain("<strong>text</strong>");
    expect(html).not.toContain(":::");
  });

  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:c1a36f23f6c2c04e1a8e0721d4d3059f36c4ac012620582563f5fad4aa572fd1
  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:982b05f95cabb0836f62205b05f1f032872094d0e7f1bb740d2882e4a6db0be6
  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:f84f38f9d945d70d8269470e25f3eef888fcdfc10f875b5a02aeac6cf3e88c88
  test("the stylesheet lays out one column and styles text from tokens", async () => {
    const css = await Bun.file(new URL("./content.module.css", import.meta.url)).text();
    const rule = (selector: string) =>
      css.match(new RegExp(`${selector.replaceAll(".", "\\.")} \\{([^}]*)\\}`))?.[1] ?? "";
    expect(rule(".content")).toContain("flex-direction: column;");
    expect(rule(".content")).toContain("gap: var(--space-20);");
    expect(rule(".content")).toContain("max-inline-size: 792px;");
    const text = rule(".listItem");
    expect(text).toContain("font-size: var(--font-size-16);");
    expect(text).toContain("line-height: var(--line-height-body);");
    expect(text).toContain("color: var(--color-ink);");
    expect(rule(".inlineLink")).toContain("color: var(--color-action);");
    expect(rule(".inlineLink")).toContain("text-decoration: underline;");
  });

  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  test("renders as a JSX element", () => {
    const element = <DocumentationContent source="Hello" />;
    expect(element.type).toBe(DocumentationContent);
    expect(renderToStaticMarkup(element)).toContain("Hello");
  });
});
