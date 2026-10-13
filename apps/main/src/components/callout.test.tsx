import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import * as callout from "./callout";
import { Callout, CalloutKind, InfoImage } from "./callout";

describe("callout", () => {
  // @lfy def/components/callout.lfy:Callout#Callout:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
  test("Callout is a named component and there is no default export", () => {
    expect(callout.Callout).toBeFunction();
    expect(callout.Callout.name).toBe("Callout");
    expect("default" in callout).toBe(false);
  });

  // @lfy def/components/callout.lfy:Callout#Callout:Callout:661a5b3d6c48efed7635c264e756a0991b9df5a29386ba24da69002906cfdef0
  test("Callout renders its content", () => {
    const html = renderToStaticMarkup(
      <Callout header="An early guide" content={<em>Still evolving</em>} />,
    );
    expect(html).toContain("<em>Still evolving</em>");
  });

  // @lfy def/components/callout.lfy:Callout#Callout:Callout:8f62ee75c8b6930689caad67fd0cfdddb2713fb9b7674ce711d4b7551386fca2
  test("Callout's title is its header, string or element", () => {
    const html = renderToStaticMarkup(
      <Callout header="An early guide" content="Body" />,
    );
    expect(html).toMatch(/aria-labelledby="([^"]+)".*id="\1"[^>]*>An early guide</);
    const element = renderToStaticMarkup(
      <Callout header={<strong>Bold title</strong>} content="Body" />,
    );
    expect(element).toContain("<strong>Bold title</strong>");
  });

  // @lfy def/components/callout.lfy:Callout#Callout:Callout:927104a6212cb123555706f56e71ea66ea3e5d4a7d30c24c3990b29d43d797b3
  test("Callout shows InfoImage as its icon for every kind", () => {
    expect(InfoImage).toBe("/elfie/info.svg");
    for (const kind of Object.values(CalloutKind)) {
      const html = renderToStaticMarkup(
        <Callout header="Note" content="Body" kind={kind} />,
      );
      expect(html).toMatch(new RegExp(`<img [^>]*src="${InfoImage}"[^>]*alt="[^"]+"`));
    }
  });

  // @lfy def/components/callout.lfy:Callout#Callout:Callout:542ebb55e82cdc4d6ed671dcab621a050671f910978c6ed41793756aa64b6915
  test("Callout has the kinds info, warning, and danger, and info is the default", () => {
    expect(Object.values(CalloutKind).toSorted()).toEqual(["danger", "info", "warning"]);
    expect(renderToStaticMarkup(<Callout header="N" content="B" />)).toBe(
      renderToStaticMarkup(<Callout header="N" content="B" kind={CalloutKind.info} />),
    );
  });

  // @lfy def/components/callout.lfy:Callout#Callout:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  test("Callout renders as a JSX element", () => {
    const element = <Callout header="Note" content="Body" />;
    expect(element.type).toBe(Callout);
    expect(renderToStaticMarkup(element)).toContain("Body");
  });
});
