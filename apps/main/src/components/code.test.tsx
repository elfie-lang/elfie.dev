import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import * as codeModule from "./code";
import { CodeBlock, CopyImage } from "./code";

const source = 'fn Hello(name: string);\n  // two spaces\n<a href="x">';

describe("code", () => {
  // @lfy def/components/code.lfy:CodeBlock#CodeBlock:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
  test("CodeBlock is a named component and there is no default export", () => {
    expect(codeModule.CodeBlock).toBeFunction();
    expect(codeModule.CodeBlock.name).toBe("CodeBlock");
    expect("default" in codeModule).toBe(false);
  });

  // @lfy def/components/code.lfy:CodeBlock#CodeBlock:CodeBlock:9a34705ece18c7065c03d21a13d662926e8e136a9e90120196339e7a86c171e9
  test("CodeBlock shows code character for character", () => {
    const html = renderToStaticMarkup(<CodeBlock code={source} label="hello.lfy" />);
    expect(html).toContain(
      "<code>fn Hello(name: string);\n  // two spaces\n&lt;a href=&quot;x&quot;&gt;</code>",
    );
  });

  // @lfy def/components/code.lfy:CodeBlock#CodeBlock:CodeBlock:eae42e76d538ee7740527bb41151f51f81156bc10d11ee2075fd80dfe912b057
  test("CodeBlock's header shows label", () => {
    const html = renderToStaticMarkup(<CodeBlock code="x" label="hello.lfy" />);
    expect(html).toContain(">hello.lfy</span>");
  });

  // @lfy def/components/code.lfy:CodeBlock#CodeBlock:CodeBlock:79f327b7295a200ff97cab8a9ea31ae57a993265f203bd2458c5ba1ceed7038c
  test("CodeBlock's header ends with a Copy code button showing CopyImage", () => {
    const html = renderToStaticMarkup(<CodeBlock code="x" label="Terminal" />);
    expect(html).toMatch(
      new RegExp(
        `<button type="button"[^>]*aria-label="Copy code"[^>]*><img [^>]*src="${CopyImage}"[^>]*/></button></div><pre`,
      ),
    );
  });

  // @lfy def/components/code.lfy:CodeBlock#CodeBlock:CodeBlock:a6db92d9fce9db52d1fa0a990f98bb6004328f61ffc8387a9fabd46d9f354685
  test("CodeBlock shows caption under the block", () => {
    const html = renderToStaticMarkup(
      <CodeBlock code="x" label="hello.lfy" caption="A tiny example" />,
    );
    expect(html).toMatch(/<\/pre><\/div><figcaption[^>]*>A tiny example<\/figcaption><\/figure>$/);
  });

  // @lfy def/components/code.lfy:CodeBlock#CodeBlock:CodeBlock:a9896b84ad8659ba6747b4a815ab4ca9a468f7548e19519f0b27755b7b4ef217
  test("CodeBlock shows nothing under the block without caption", () => {
    const html = renderToStaticMarkup(<CodeBlock code="x" label="hello.lfy" />);
    expect(html).not.toContain("figcaption");
    expect(html).toMatch(/<\/pre><\/div><\/figure>$/);
  });

  // @lfy def/components/code.lfy:CodeBlock#CodeBlock:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  test("CodeBlock renders as a JSX element", () => {
    const element = <CodeBlock code="x" label="y" />;
    expect(element.type).toBe(CodeBlock);
  });
});
