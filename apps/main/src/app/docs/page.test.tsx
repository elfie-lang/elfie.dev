import { describe, expect, mock, test } from "bun:test";
import type { ReactElement } from "react";

mock.module("next/navigation", () => ({
  useRouter: () => ({ push: () => undefined }),
}));

const { renderToStaticMarkup } = await import("react-dom/server");
const { Button, Link } = await import("@/components/atoms");
const { Callout } = await import("@/components/callout");
const { CardGrid, ResourceCard } = await import("@/components/card");
const { CodeBlock } = await import("@/components/code");
const { DocumentationLayout } = await import("@/components/documentation/layout");
const { Navigation } = await import("@/components/documentation/navigation");
const { documentationPageOf } = await import("@/lib/documentation/pages");
const page = await import("./page");
const Documentation = page.default;

type Props = Record<string, unknown>;

function elementsOf(root: unknown, type: unknown): ReactElement<Props>[] {
  const found: ReactElement<Props>[] = [];
  const walk = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node && typeof node === "object" && "props" in node) {
      const element = node as ReactElement<Props>;
      if (element.type === type) found.push(element);
      Object.values(element.props).forEach(walk);
    }
  };
  walk(root);
  return found;
}

async function rendered(): Promise<ReactElement<Props>> {
  return (await Documentation()) as ReactElement<Props>;
}

function text(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ");
}

describe("documentation page", () => {
  // @lfy def/documentation/main.lfy:Documentation#Documentation:page:cfa99fa23eb35e6c4f01179626fa0dea067d3d44bdd25418869f20e78093fb9b
  test("The page is the async default export of app/docs/page.tsx", async () => {
    expect(Documentation.name).toBe("Documentation");
    expect(Documentation()).toBeInstanceOf(Promise);
    expect(renderToStaticMarkup(await rendered())).toContain(
      "A little guidance. A lot to build.",
    );
  });

  // @lfy def/documentation/main.lfy:Documentation#Documentation:documentationPage:352b964a716b2ee92c582f46963ffdd7f0f90ae8e5c084e0105c9a418915b6c2
  test("The page is a DocumentationLayout whose current slug is overview", async () => {
    const element = await rendered();
    expect(element.type).toBe(DocumentationLayout);
    expect(element.props.currentSlug).toBe("overview");
  });

  // @lfy def/documentation/navigation.lfy:Navigation#Navigation:Navigation:5f0476ea1bc845fc2f770cf5edb331003302365dd7dbcc4f3c399384038d927e
  test("Navigation is in the left column of the two column body", async () => {
    const html = renderToStaticMarkup(await rendered());
    const aside = /<aside[^>]*>([\s\S]*?)<\/aside>/.exec(html)?.[1] ?? "";
    expect(aside).toBe(renderToStaticMarkup(<Navigation currentSlug="overview" />));
    expect(html.indexOf("<aside")).toBeLessThan(html.indexOf("<main"));
  });

  // @lfy def/documentation/main.lfy:Documentation#Documentation:documentationPage:1d0d6564d52373071a6ef6c9916ff4f842ecc06339aa563a77e7645a2bd49844
  test("The metadata names the overview and describes it without backticks", () => {
    expect(page.metadata.title).toBe("Overview · Elfie documentation");
    const description = documentationPageOf("overview")?.description ?? "";
    expect(description).not.toBe("");
    expect(page.metadata.description).toBe(description.replaceAll("`", ""));
  });

  // @lfy def/documentation/main.lfy:Documentation#Documentation:Documentation:735f29c6fb82c7b663da6baba133452f79e9594540a54a2ff903371e347350a8
  test("The introduction and its Callout", async () => {
    const element = await rendered();
    const html = renderToStaticMarkup(element);
    expect(html).toMatch(/<p[^>]*>Documentation<\/p><h1[^>]*>A little guidance\. A lot to build\.<\/h1>/);
    expect(text(html)).toContain(
      "Explore the ideas behind Elfie, learn the shape of the language, and find your way from intent to a first program.",
    );
    const [callout] = elementsOf(element, Callout);
    expect(callout?.props.header).toBe("An early guide to an early language");
    const content = renderToStaticMarkup(callout?.props.content as ReactElement);
    expect(text(content)).toBe(
      "The syntax, commands, and capabilities shown here are where the language stands today, and it is still changing quickly. Share feedback, ask questions, or report problems with the guide or the compiler in our GitHub repository.",
    );
    expect(content).toMatch(/<a [^>]*href="https:\/\/github\.com\/elfie-lang\/elfie"[^>]*>GitHub repository<\/a>/);
  });

  // @lfy def/documentation/main.lfy:Documentation#Documentation:Documentation:f2475185e510d4ab57205b2883e56b1a3ac3e2e8023df4b022ad1c0af848d155
  test("The Getting started feature", async () => {
    const element = await rendered();
    const html = renderToStaticMarkup(element);
    expect(html).toMatch(/<p[^>]*>New to Elfie\?<\/p><h2[^>]*>Start with a small idea\.<\/h2>/);
    expect(text(html)).toContain(
      "Take a tour of the core ideas of the language and what it can do. Then build your first program with a guided example.",
    );
    const [button] = elementsOf(element, Button);
    expect(button?.props.href).toBe("/docs/getting-started");
    expect(text(renderToStaticMarkup(button?.props.content as ReactElement))).toContain(
      "Read the getting started guide",
    );
    const [code] = elementsOf(element, CodeBlock);
    expect(code?.props.label).toBe("hello.lfy");
    expect(code?.props.caption).toBe("A tiny example to start");
  });

  // @lfy def/documentation/main.lfy:Documentation#Documentation:Documentation:bc4eb5a8e9953e0f97ec55afb42f3d46dde20cfcde16c73a1b54e3b79e323ac5
  test("The code example's five lines", async () => {
    const [code] = elementsOf(await rendered(), CodeBlock);
    expect(code?.props.code).toBe(
      [
        "fn hello(): `Greets the world` {",
        "  @acceptanceCriteria.add({",
        '    behavior = `Prints "Hello world!"`,',
        "  });",
        "}",
      ].join("\n"),
    );
  });

  // @lfy def/documentation/main.lfy:Documentation#Documentation:Documentation:9ae6830e4c2071bde0d5435294a05194a15eafc63ca59388d5f792a38ee5bf7d
  test("Four ResourceCards in a CardGrid under Find your next step", async () => {
    const element = await rendered();
    expect(renderToStaticMarkup(element)).toMatch(/<h2[^>]*>Find your next step<\/h2>/);
    const [grid] = elementsOf(element, CardGrid);
    const cards = elementsOf(grid, ResourceCard).map(({ props }) => ({
      icon: props.icon,
      label: props.label,
      title: props.title,
      content: text(renderToStaticMarkup(<>{props.content as ReactElement}</>)),
      action: props.action,
      href: props.href,
    }));
    expect(cards).toEqual([
      {
        icon: "book",
        label: "Core concepts",
        title: "Language guide",
        content: "Understand the building blocks you can use to build your next piece of software.",
        action: "Explore the guide",
        href: "/docs/familiar-concepts",
      },
      {
        icon: "code",
        label: "Diving deeper",
        title: "Building with agents",
        content:
          "See how d, fn, and acceptance criteria turn intent into code that an agent writes and another agent checks.",
        action: "See agentic structures",
        href: "/docs/agentic-structures",
      },
      {
        icon: "terminal",
        label: "Compiling code",
        title: "CLI reference",
        content:
          "A reference to the Elfie CLI: how to build your app, and every flag, setting, and file you need to get going.",
        action: "View command examples",
        href: "/docs/cli",
      },
      {
        icon: "notebook",
        label: "Behind the language",
        title: "Compiler details",
        content: "Explore how a compile works and the language choices behind it.",
        action: "Read the compiler details",
        href: "/docs/compiler-details",
      },
    ]);
    const second = renderToStaticMarkup(
      <>{elementsOf(grid, ResourceCard)[1]?.props.content as ReactElement}</>,
    );
    expect(second).toMatch(/<code[^>]*>d<\/code>/);
    expect(second).toMatch(/<code[^>]*>fn<\/code>/);
  });

  // @lfy def/documentation/main.lfy:Documentation#Documentation:Documentation:2e108cfb87507712ac22bbefd19cf19a8ddaabcf68e68de84df601205558192d
  test("The learning route", async () => {
    const element = await rendered();
    const html = renderToStaticMarkup(element);
    expect(html).toMatch(/<h2[^>]*>Prefer learning by doing\?<\/h2>/);
    expect(text(html)).toContain(
      "Follow a step-by-step tutorial and build a small program from the ground up.",
    );
    const links = elementsOf(element, Link).filter(({ props }) => props.href === "/tutorials");
    expect(links).toHaveLength(1);
    expect(links[0]?.props.content).toBe("Explore tutorials");
  });
});
