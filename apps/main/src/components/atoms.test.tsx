import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import * as atoms from "./atoms";
import { Button, Link, Logo } from "./atoms";

describe("atoms", () => {
  // @lfy def/atoms.lfy:Button#Button:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
  test("has no default export", () => {
    expect("default" in atoms).toBe(false);
  });

  // @lfy def/atoms.lfy:Button#Button:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
  test("Button is a named component", () => {
    expect(atoms.Button).toBeFunction();
    expect(atoms.Button.name).toBe("Button");
  });

  // @lfy def/atoms.lfy:Button#Button:Button:661a5b3d6c48efed7635c264e756a0991b9df5a29386ba24da69002906cfdef0
  test("Button renders its content", () => {
    const html = renderToStaticMarkup(
      <Button content={<strong>Create project</strong>} />,
    );
    expect(html).toStartWith("<button");
    expect(html).toContain("><strong>Create project</strong></button>");
  });

  // @lfy def/atoms.lfy:Button#Button:Button:c73df54c9921c04d7a68a74353ec343de9492586e0bb30c59885756315477f31
  test("Button given an href renders as a link", () => {
    const html = renderToStaticMarkup(
      <Button href="/download" content="Download Elfie" />,
    );
    expect(html).toStartWith("<a ");
    expect(html).toContain('href="/download"');
    expect(html).not.toContain("<button");
    expect(html).not.toContain('type="');
    expect(html).toEndWith(">Download Elfie</a>");
  });

  // @lfy def/atoms.lfy:Link#Link:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
  test("Link is a named component", () => {
    expect(atoms.Link).toBeFunction();
    expect(atoms.Link.name).toBe("Link");
  });

  // @lfy def/atoms.lfy:Link#Link:Link:661a5b3d6c48efed7635c264e756a0991b9df5a29386ba24da69002906cfdef0
  test("Link renders its content, a string or a component", () => {
    const text = renderToStaticMarkup(
      <Link href="/guide" content="Read the language guide" />,
    );
    expect(text).toContain('href="/guide"');
    expect(text).toContain("<span>Read the language guide</span>");

    const element = renderToStaticMarkup(
      <Link href="/guide" content={<em>Guide</em>} />,
    );
    expect(element).toContain("<span><em>Guide</em></span>");
  });

  // @lfy def/atoms.lfy:Logo#Logo:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
  test("Logo is a named component", () => {
    expect(atoms.Logo).toBeFunction();
    expect(atoms.Logo.name).toBe("Logo");
  });

  // @lfy def/atoms.lfy:Logo#Logo:Logo:6a2a5cdaceb28e43cb60c3a8d4b26f61d92622e8ef8de34a4d3a68b7076eb3d5
  test("Logo uses LogoImage as the image and links to the root URL", () => {
    const html = renderToStaticMarkup(<Logo />);
    expect(html).toMatch(
      new RegExp(`<a [^>]*href="/"[^>]*><img [^>]*src="${atoms.LogoImage}"[^>]*/></a>`),
    );
  });

  // @lfy def/atoms.lfy:Button#Button:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  test("Button renders as a JSX element", () => {
    const element = <Button content="Create project" />;
    expect(element.type).toBe(Button);
    expect(renderToStaticMarkup(element)).toContain("Create project");
  });

  // @lfy def/atoms.lfy:Link#Link:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  test("Link renders as a JSX element", () => {
    const element = <Link href="/guide" content="Guide" />;
    expect(element.type).toBe(Link);
    expect(renderToStaticMarkup(element)).toContain("Guide");
  });

  // @lfy def/atoms.lfy:Logo#Logo:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  test("Logo renders as a JSX element", () => {
    const element = <Logo />;
    expect(element.type).toBe(Logo);
    expect(renderToStaticMarkup(element)).toContain('href="/"');
  });
});
