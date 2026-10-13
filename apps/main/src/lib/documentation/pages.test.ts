import { describe, expect, test } from "bun:test";

import {
  documentationPageOf,
  documentationPages,
  documentationPath,
  neighborsOf,
  searchDocumentation,
} from "./pages";

describe("documentationPath", () => {
  // @lfy def/documentation/pages.lfy:documentationPath#documentationPath:documentationPath:1386956171ada7f193b9cdb749c21b4af0d935d4a8a5192d830765c17c1a6735
  test("overview gives /docs", () => {
    expect(documentationPath("overview")).toBe("/docs");
  });

  // @lfy def/documentation/pages.lfy:documentationPath#documentationPath:documentationPath:480f4f1bcf0d934e79588a39438733192775ac906076e92992d35d8c5adb0e5f
  test("traits gives /docs/traits", () => {
    expect(documentationPath("traits")).toBe("/docs/traits");
  });

  // @lfy def/documentation/pages.lfy:documentationPath#documentationPath:documentationPath:869b7f10260e9ceda20576d0b242ae8ab8be06560b7c395471103da97fe6609c
  test("When slug is overview: Returns /docs", () => {
    expect(documentationPath("overview")).toBe("/docs");
  });

  // @lfy def/documentation/pages.lfy:documentationPath#documentationPath:documentationPath:f6917cef9ea4711094c34a7effa2d0aff3b393ad84f47e8c6675b4ba562175fa
  test("When slug is not overview: Returns /docs/ followed by slug", () => {
    for (const page of documentationPages.filter((p) => p.slug !== "overview")) {
      expect(documentationPath(page.slug)).toBe(`/docs/${page.slug}`);
    }
  });
});

describe("documentationPageOf", () => {
  // @lfy def/documentation/pages.lfy:documentationPageOf#documentationPageOf:documentationPageOf:7b4b2366eba5d1fc4d815115e65b398128d3a15098cf97760f398a56ff8266f5
  test("traits gives the page titled Traits", () => {
    expect(documentationPageOf("traits")?.title).toBe("Traits");
  });

  // @lfy def/documentation/pages.lfy:documentationPageOf#documentationPageOf:documentationPageOf:23785b7ee09dd4bb39861dec4b354a54b46358eabd3134aa5066435104727928
  test("missing gives undefined", () => {
    expect(documentationPageOf("missing")).toBeUndefined();
  });
});

describe("neighborsOf", () => {
  // @lfy def/documentation/pages.lfy:neighborsOf#neighborsOf:neighborsOf:e7d3aca5889190227ae484dab18a4bf6f5ec7fd9bde3d46438d005d8c7641398
  test("getting-started is between Overview and Your first program", () => {
    const neighbors = neighborsOf("getting-started");
    expect(neighbors.previous?.title).toBe("Overview");
    expect(neighbors.next?.title).toBe("Your first program");
  });

  // @lfy def/documentation/pages.lfy:neighborsOf#neighborsOf:neighborsOf:f4095cd68112166bf58f6518c6792bfbf700009e80a6496b17916a2b7a4e0707
  test("standard-library follows Context API and is last", () => {
    const neighbors = neighborsOf("standard-library");
    expect(neighbors.previous?.title).toBe("Context API");
    expect(neighbors.next).toBeUndefined();
  });

  // @lfy def/documentation/pages.lfy:neighborsOf#neighborsOf:neighborsOf:311a75f234fec41f555ce7f6fb31ed41d84490d0d6cfee4204e203e6fb4cabc6
  test("When slug is the first page: previous is undefined", () => {
    expect(neighborsOf("overview").previous).toBeUndefined();
  });

  // @lfy def/documentation/pages.lfy:neighborsOf#neighborsOf:neighborsOf:e73c9a26cb6b7636d170b2b364886af32ba2c70a4c1f5b18c75308940874a866
  test("When slug is the last page: next is undefined", () => {
    const last = documentationPages[documentationPages.length - 1];
    expect(neighborsOf(last?.slug ?? "").next).toBeUndefined();
  });

  // @lfy def/documentation/pages.lfy:neighborsOf#neighborsOf:neighborsOf:ccdd1043805aedd00130a3ef20ff861ba5c08f1ceb537423157d4f736e72f058
  test("When No page has slug: previous and next are both undefined", () => {
    expect(neighborsOf("missing")).toEqual({ previous: undefined, next: undefined });
  });
});

describe("searchDocumentation", () => {
  // @lfy def/documentation/pages.lfy:searchDocumentation#searchDocumentation:searchDocumentation:dd9c2bb8e7b17b4cbcbc914e25dd78a3c997140195ea0daf672379688ee77830
  test("traits gives Traits first, then pages whose description mentions traits", () => {
    const results = searchDocumentation("traits");
    expect(results[0]?.title).toBe("Traits");
    for (const page of results.slice(1)) {
      expect(page.description.toLowerCase()).toContain("traits");
    }
    expect(results.length).toBeGreaterThan(1);
  });

  // @lfy def/documentation/pages.lfy:searchDocumentation#searchDocumentation:searchDocumentation:379146657c12717c185282bd302ddf9cf18260f1e53bdd03abf02fe98b5e1c72
  test("CLI gives CLI reference first", () => {
    expect(searchDocumentation("CLI")[0]?.title).toBe("CLI reference");
  });

  // @lfy def/documentation/pages.lfy:searchDocumentation#searchDocumentation:searchDocumentation:3ac1943efb45d8d98e34177631933bf7095b848b82deef133d520033b77bfb7b
  test("whitespace gives nothing", () => {
    expect(searchDocumentation("  ")).toEqual([]);
  });

  // @lfy def/documentation/pages.lfy:searchDocumentation#searchDocumentation:searchDocumentation:69c11a4bf725795a6ba061bac6d0e9bc26a6afc0ac5b8b207e4e34d7c6577263
  test("zebra gives nothing", () => {
    expect(searchDocumentation("zebra")).toEqual([]);
  });

  // @lfy def/documentation/pages.lfy:searchDocumentation#searchDocumentation:searchDocumentation:eddc4a90f3dfac235065a5b7d6eda4c7f46948ab75d4a8a46b9ebe1e1d30c740
  test("every word must occur in the title or description, ignoring case and backticks", () => {
    const results = searchDocumentation("ELFIE.JSON holds");
    expect(results.map((page) => page.slug)).toEqual(["configuration"]);
  });

  // @lfy def/documentation/pages.lfy:searchDocumentation#searchDocumentation:searchDocumentation:048e51fd0b6a8f3356f91d23120d501bf835f8b79ae9db878379a5d1a487c7f8
  test("title matches come first, then navigation order", () => {
    const results = searchDocumentation("compile");
    const titled = results.filter((page) => page.title.toLowerCase().includes("compile"));
    expect(results.slice(0, titled.length)).toEqual(titled);
    const order = (slug: string) => documentationPages.findIndex((page) => page.slug === slug);
    const rest = results.slice(titled.length).map((page) => order(page.slug));
    expect(rest).toEqual([...rest].sort((a, b) => a - b));
  });

  // @lfy def/documentation/pages.lfy:searchDocumentation#searchDocumentation:searchDocumentation:c9d336deef5d2083402d082c38347b7c0607b896d6035dd973a0e983a2c6265d
  test("returns at most 8 pages", () => {
    expect(searchDocumentation("the").length).toBeLessThanOrEqual(8);
    expect(searchDocumentation("the").length).toBe(8);
  });

  // @lfy def/documentation/pages.lfy:searchDocumentation#searchDocumentation:searchDocumentation:440bb2c08fc1f5f744f66a3a89f6d261707cb59a8f7f216470a459fda74af175
  test("When query is empty or only whitespace: Returns an empty list", () => {
    expect(searchDocumentation("")).toEqual([]);
    expect(searchDocumentation(" \t\n")).toEqual([]);
  });
});
