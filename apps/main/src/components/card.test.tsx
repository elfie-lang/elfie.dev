import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import * as card from "./card";
import {
  BookIcon,
  CardGrid,
  CardIcon,
  CodeIcon,
  NotebookIcon,
  ResourceCard,
  TerminalIcon,
  type ResourceCardProps,
} from "./card";

const props: ResourceCardProps = {
  icon: CardIcon.book,
  label: "Core concepts",
  title: "Language guide",
  content: "Understand the building blocks.",
  href: "/docs",
  action: "Explore the guide",
};

describe("card", () => {
  // @lfy def/components/card.lfy:ResourceCard#ResourceCard:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
  test("ResourceCard is a named component and there is no default export", () => {
    expect(card.ResourceCard).toBeFunction();
    expect(card.ResourceCard.name).toBe("ResourceCard");
    expect("default" in card).toBe(false);
  });

  // @lfy def/components/card.lfy:ResourceCard#ResourceCard:ResourceCard:d1b964502b54b676ee04d751d4351ee08cc47cb3970cc765b77b4ac38e4988a3
  test("ResourceCard shows the icon of the same name", () => {
    const expected = {
      book: BookIcon,
      code: CodeIcon,
      notebook: NotebookIcon,
      terminal: TerminalIcon,
    } as const;
    for (const icon of Object.values(CardIcon)) {
      const html = renderToStaticMarkup(<ResourceCard {...props} icon={icon} />);
      expect(html).toMatch(new RegExp(`<img [^>]*src="${expected[icon]}"[^>]*alt="[^"]+"`));
    }
  });

  // @lfy def/components/card.lfy:ResourceCard#ResourceCard:ResourceCard:787d7eeb2d2904b3a185464f3aa69569a0d97a7459cc7766d1c16a82a01b8aeb
  test("ResourceCard shows label, title, and content in order", () => {
    const html = renderToStaticMarkup(<ResourceCard {...props} />);
    const label = html.indexOf(">Core concepts</p>");
    const title = html.indexOf(">Language guide</h3>");
    const content = html.indexOf("Understand the building blocks.");
    expect(label).toBeGreaterThan(-1);
    expect(title).toBeGreaterThan(label);
    expect(content).toBeGreaterThan(title);
  });

  // @lfy def/components/card.lfy:ResourceCard#ResourceCard:ResourceCard:1ad29294d72b8ed87aefdded18324673e1bdf76c8a7f33c7b5f86fafdce2f3df
  test("ResourceCard ends with a link reading action and an arrow", () => {
    const html = renderToStaticMarkup(
      <ResourceCard {...props} href="https://example.com/guide" />,
    );
    expect(html).toMatch(
      /<a [^>]*href="https:\/\/example.com\/guide"[^>]*>Explore the guide <span aria-hidden="true">→<\/span><\/a><\/article>$/,
    );
  });

  // @lfy def/components/card.lfy:ResourceCard#ResourceCard:ResourceCard:e213f3ce70b625b3e98135acbe921982081956e62c3e634f0ddb05d00e679c4c
  test("ResourceCard links to a path beginning with a slash", () => {
    const html = renderToStaticMarkup(<ResourceCard {...props} href="/docs" />);
    expect(html).toContain('href="/docs"');
  });

  // @lfy def/components/card.lfy:ResourceCard#ResourceCard:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  test("ResourceCard renders as a JSX element", () => {
    const element = <ResourceCard {...props} />;
    expect(element.type).toBe(ResourceCard);
  });

  // @lfy def/components/card.lfy:CardGrid#CardGrid:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
  test("CardGrid is a named component", () => {
    expect(card.CardGrid).toBeFunction();
    expect(card.CardGrid.name).toBe("CardGrid");
  });

  // @lfy def/components/card.lfy:CardGrid#CardGrid:CardGrid:26710262abee46e978c9cf314d5653f928f5620219731d6e88b8f14664d3c286
  test("CardGrid lays out its content", () => {
    const html = renderToStaticMarkup(
      <CardGrid
        content={
          <>
            <ResourceCard {...props} />
            <ResourceCard {...props} icon={CardIcon.code} />
          </>
        }
      />,
    );
    expect(html.match(/<article[ >]/g)?.length).toBe(2);
  });
});
