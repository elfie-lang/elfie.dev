import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { LogoImage } from "./atoms";
import * as footer from "./footer";
import { Footer } from "./footer";

function hrefOf(html: string, label: string): string | undefined {
  const match = new RegExp(`<a [^>]*href="([^"]*)"[^>]*><span>${label}</span>`).exec(html);
  return match?.[1];
}

describe("footer", () => {
  // @lfy def/components/footer.lfy:Footer#Footer:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
  test("Footer is a named component and there is no default export", () => {
    expect(footer.Footer).toBeFunction();
    expect(footer.Footer.name).toBe("Footer");
    expect("default" in footer).toBe(false);
  });

  // @lfy def/components/footer.lfy:Footer#Footer:Footer:661a5b3d6c48efed7635c264e756a0991b9df5a29386ba24da69002906cfdef0
  test("Footer renders its content", () => {
    const html = renderToStaticMarkup(<Footer content={<p>A draft.</p>} />);
    expect(html).toContain("<p>A draft.</p>");
  });

  // @lfy def/components/footer.lfy:Footer#Footer:Footer:e914d50b37e6d75226fe156880116e527e9cd280d68106b639f6cd83cc9dd7f6
  test("Footer uses Logo for the logo", () => {
    const html = renderToStaticMarkup(<Footer content={null} />);
    expect(html).toContain(`src="${LogoImage}"`);
  });

  // @lfy def/components/footer.lfy:Footer#Footer:Footer:f51fb74eec047d1f9f432cbc0bd2c04e138bde4a8ae90e3cc267f2766cdfd067
  test("Footer links go where they should", () => {
    const html = renderToStaticMarkup(<Footer content={null} />);
    expect(hrefOf(html, "Documentation")).toBe("/docs");
    expect(hrefOf(html, "Tutorials")).toBe("/tutorials");
    expect(hrefOf(html, "The Elfie language")).toBe("/");
    expect(hrefOf(html, "GitHub")).toBe("https://github.com/elfie-lang/elfie");
    expect(hrefOf(html, "Community")).toBe("https://github.com/elfie-lang/elfie");
    expect(hrefOf(html, "Download")).toBe(
      "https://github.com/elfie-lang/elfie/releases",
    );
  });

  // @lfy def/components/footer.lfy:Footer#Footer:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  test("Footer renders as a JSX element", () => {
    const element = <Footer content="Notes" />;
    expect(element.type).toBe(Footer);
    expect(renderToStaticMarkup(element)).toContain("Notes");
  });
});
