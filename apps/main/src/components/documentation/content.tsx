import NextLink from "next/link";
import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { Callout, CalloutKind } from "@/components/callout";
import { CardGrid, CardIcon, ResourceCard } from "@/components/card";
import { CodeBlock } from "@/components/code";
import { Columns, Flow, Steps } from "@/components/sequence";
import { Table } from "@/components/table";

import styles from "./content.module.css";

// @lfy def/documentation/content.lfy:DocumentationHeading
export type DocumentationHeading = {
  // @lfy def/documentation/content.lfy:DocumentationHeading.text
  readonly text: string;
  // @lfy def/documentation/content.lfy:DocumentationHeading.id
  readonly id: string;
};

// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:afc802280118cfb235eaccebd209449bbc6d253879df9e2ff6cd63769755e34d
const fenceOpening = /^ {0,3}(`{3,}|~{3,})(.*)$/;

// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:afc802280118cfb235eaccebd209449bbc6d253879df9e2ff6cd63769755e34d
const blockOpening = /^:::([A-Za-z][\w-]*)(.*)$/;

// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:afc802280118cfb235eaccebd209449bbc6d253879df9e2ff6cd63769755e34d
function nextFence(fence: string | undefined, line: string): string | undefined {
  if (fence === undefined) {
    const opening = fenceOpening.exec(line);
    if (!opening) {
      return undefined;
    }
    const marker = opening[1] ?? "";
    const info = opening[2] ?? "";
    return marker.startsWith("`") && info.includes("`") ? undefined : marker;
  }
  const closing = /^ {0,3}(`{3,}|~{3,})\s*$/.exec(line)?.[1];
  if (
    closing !== undefined &&
    closing[0] === fence[0] &&
    closing.length >= fence.length
  ) {
    return undefined;
  }
  return fence;
}

// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:afc802280118cfb235eaccebd209449bbc6d253879df9e2ff6cd63769755e34d
type Segment =
  | { readonly kind: "markdown"; readonly lines: readonly string[] }
  | {
      readonly kind: "block";
      readonly name: string;
      readonly args: string;
      readonly lines: readonly string[];
    };

// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:afc802280118cfb235eaccebd209449bbc6d253879df9e2ff6cd63769755e34d
function segmentsOf(source: string): Segment[] {
  const segments: Segment[] = [];
  let markdown: string[] = [];
  let block: { name: string; args: string; lines: string[] } | undefined;
  let fence: string | undefined;
  for (const line of source.split("\n")) {
    if (block) {
      if (fence === undefined && line === ":::") {
        segments.push({ kind: "block", ...block });
        block = undefined;
        continue;
      }
      fence = nextFence(fence, line);
      block.lines.push(line);
      continue;
    }
    const opening = fence === undefined ? blockOpening.exec(line) : null;
    if (opening) {
      if (markdown.length > 0) {
        segments.push({ kind: "markdown", lines: markdown });
        markdown = [];
      }
      block = { name: opening[1] ?? "", args: (opening[2] ?? "").trim(), lines: [] };
      continue;
    }
    fence = nextFence(fence, line);
    markdown.push(line);
  }
  if (block) {
    segments.push({ kind: "block", ...block });
  }
  if (markdown.length > 0) {
    segments.push({ kind: "markdown", lines: markdown });
  }
  return segments;
}

// @lfy def/documentation/content.lfy:headingsOf#headingsOf:headingsOf:5926789a4d6d04b9b955a8596f2f6bb75bcfd2fe9e197694d9e2989994c06b01
function headingLineIndexes(lines: readonly string[]): number[] {
  const indexes: number[] = [];
  let fence: string | undefined;
  lines.forEach((line, index) => {
    if (fence === undefined && line.startsWith("## ")) {
      indexes.push(index);
    }
    fence = nextFence(fence, line);
  });
  return indexes;
}

// @lfy def/documentation/content.lfy:headingsOf#headingsOf:headingsOf:99312b604528fa358ade0f7955e92b0394383a7dacafe361b4c1e517ef4fbc26
function headingText(line: string): string {
  return line
    .slice(3)
    .replace(/\s+#+\s*$/, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replaceAll("`", "")
    .replace(/(\*{1,3}|_{1,3}|~~)(\S(?:.*?\S)?)\1/g, "$2")
    .trim();
}

// @lfy def/documentation/content.lfy:headingsOf#headingsOf:headingsOf:25a1bf424d004822504d7b9685ce51ee2c463a4bbd252949804f9f707501a6b0
function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// @lfy def/documentation/content.lfy:headingsOf
export function headingsOf(source: string): readonly DocumentationHeading[] {
  const seen = new Map<string, number>();
  // @lfy def/documentation/content.lfy:headingsOf#headingsOf:headingsOf:5926789a4d6d04b9b955a8596f2f6bb75bcfd2fe9e197694d9e2989994c06b01
  const texts = segmentsOf(source).flatMap((segment) =>
    segment.kind === "markdown"
      ? headingLineIndexes(segment.lines).map((index) =>
          headingText(segment.lines[index] ?? ""),
        )
      : [],
  );
  // @lfy def/documentation/content.lfy:headingsOf#headingsOf:headingsOf:64ca219ed80b90ac9868cb367c959b3a7398e8237b38de44f7573465b000f32d
  return texts.map((text) => {
    const base = headingId(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return { text, id: count === 0 ? base : `${base}-${count + 1}` };
  });
}

// @lfy def/documentation/content.lfy:DocumentationContent
type MarkdownNode = {
  type: string;
  value?: string;
  depth?: number;
  children?: MarkdownNode[];
  position?: { start: { line: number } };
  data?: { hProperties?: Record<string, unknown> };
};

// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:1a5968388df03002ba2616c987baf2d75a1833634a5a5feefc3ca3052f513f90
const blockParents = new Set(["root", "blockquote", "listItem"]);

// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:1a5968388df03002ba2616c987baf2d75a1833634a5a5feefc3ca3052f513f90
// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:14e2549438465360176f5048cafb900f9d5a8b3969b9b763e1bf9711168a0e17
function remarkDocumentation(
  lines: readonly string[],
  headingIds: readonly string[],
) {
  return () => (tree: unknown) => {
    let next = 0;
    const walk = (node: MarkdownNode) => {
      if (
        node.type === "heading" &&
        node.depth === 2 &&
        node.position &&
        (lines[node.position.start.line - 1] ?? "").startsWith("## ")
      ) {
        const id = headingIds[next];
        next += 1;
        if (id !== undefined) {
          node.data = { ...node.data, hProperties: { id } };
        }
      }
      if (!node.children) {
        return;
      }
      node.children = node.children.map((child) => {
        if (child.type !== "html") {
          return child;
        }
        const text = { type: "text", value: child.value ?? "" };
        return blockParents.has(node.type)
          ? { type: "paragraph", children: [text] }
          : text;
      });
      node.children.forEach(walk);
    };
    walk(tree as MarkdownNode);
  };
}

// @lfy def/documentation/content.lfy:DocumentationContent
type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: { className?: unknown };
  children?: HastNode[];
  data?: { meta?: string | null };
};

// @lfy def/documentation/content.lfy:DocumentationContent
function textOf(node: HastNode | undefined): string {
  if (!node) {
    return "";
  }
  if (node.type === "text") {
    return node.value ?? "";
  }
  return (node.children ?? []).map(textOf).join("");
}

// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:01d90900c73d2e142a56dc349a344f96cbe412e56f2c8d9ce4e158d52c98c294
const defaultLabels = new Map([
  ["lfy", "Elfie"],
  ["bash", "Terminal"],
  ["text", "Output"],
  ["json", "JSON"],
  ["ts", "TypeScript"],
  ["python", "Python"],
]);

// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:1717bdb154b21f27d74e9555519f33f434801c1b5ca05e5b672afb9b0959e21c
// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:01d90900c73d2e142a56dc349a344f96cbe412e56f2c8d9ce4e158d52c98c294
function codeBlockOf(info: string, code: string, key?: number): ReactElement {
  const language = info.trim().split(/\s+/)[0] ?? "";
  const attributes = new Map(
    [...info.matchAll(/([\w-]+)="([^"]*)"/g)].map(
      (match) => [match[1] ?? "", match[2] ?? ""] as const,
    ),
  );
  const label = attributes.get("title") ?? defaultLabels.get(language) ?? "Code";
  return (
    <CodeBlock
      key={key}
      code={code}
      label={label}
      caption={attributes.get("caption")}
    />
  );
}

// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:9374af4d0f7b4db0121ad3a542cc0ef6a63a9e659cadf9e1a9f7bc2590d68618
function elementsIn(children: ReactNode): ReactElement<{ children?: ReactNode }>[] {
  return Children.toArray(children).filter(
    (child): child is ReactElement<{ children?: ReactNode }> => isValidElement(child),
  );
}

// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:9374af4d0f7b4db0121ad3a542cc0ef6a63a9e659cadf9e1a9f7bc2590d68618
function rowsOf(section: ReactElement<{ children?: ReactNode }> | undefined): ReactNode[][] {
  return elementsIn(section?.props.children).map((row) =>
    elementsIn(row.props.children).map((cell) => cell.props.children),
  );
}

// @lfy def/documentation/content.lfy:DocumentationContent
const nestedComponents: Components = {
  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:e36cdb3a82cf559940675900d106a0078e7029a6c556f190886e712996524861
  code: ({ children }) => <code className={styles.code}>{children}</code>,
  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:a538eb2dbb24dff06fdc5519bb30c409485bd39f8c2f4449e5e8240ba0b5e0dd
  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:982c6b93e71e3b99e7ff02fdf3dbf3633670e9769128d77c806cc70d291df1d0
  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:f84f38f9d945d70d8269470e25f3eef888fcdfc10f875b5a02aeac6cf3e88c88
  a: ({ href = "", children }) => {
    if (href.startsWith("/")) {
      return (
        <NextLink href={href} className={styles.inlineLink}>
          {children}
        </NextLink>
      );
    }
    if (href.startsWith("http")) {
      return (
        <a href={href} className={styles.inlineLink} target="_blank" rel="noopener">
          {children}
        </a>
      );
    }
    return (
      <a href={href} className={styles.inlineLink}>
        {children}
      </a>
    );
  },
  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:3ec809a287ee8c8209f2f3c37882029a3f17c9b8b5828d6a5419ee3cce068c8a
  pre: ({ node }) => {
    const code = (node as unknown as HastNode | undefined)?.children?.find(
      (child) => child.type === "element" && child.tagName === "code",
    );
    const classNames = Array.isArray(code?.properties?.className)
      ? (code.properties.className as unknown[])
      : [];
    const language =
      classNames
        .map(String)
        .find((name) => name.startsWith("language-"))
        ?.slice("language-".length) ?? "";
    const meta = code?.data?.meta ?? "";
    return codeBlockOf(`${language} ${meta}`, textOf(code).replace(/\n$/, ""));
  },
  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:9374af4d0f7b4db0121ad3a542cc0ef6a63a9e659cadf9e1a9f7bc2590d68618
  table: ({ children }) => {
    const sections = elementsIn(children);
    const head = sections.find((section) => section.type === "thead");
    const body = sections.find((section) => section.type === "tbody");
    return <Table columns={rowsOf(head)[0] ?? []} rows={rowsOf(body)} />;
  },
  blockquote: ({ children }) => (
    <blockquote className={styles.quote}>{children}</blockquote>
  ),
};

// @lfy def/documentation/content.lfy:DocumentationContent
const blockComponents: Components = {
  ...nestedComponents,
  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:14e2549438465360176f5048cafb900f9d5a8b3969b9b763e1bf9711168a0e17
  h2: ({ id, children }) => (
    <h2 id={id} className={styles.heading}>
      {children}
    </h2>
  ),
  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:b86381b3cf6be1182fd14317e2576d265d7cabccc02247a0c57159b3eda17640
  h3: ({ children }) => <h3 className={styles.subheading}>{children}</h3>,
  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:982b05f95cabb0836f62205b05f1f032872094d0e7f1bb740d2882e4a6db0be6
  p: ({ children }) => <p className={styles.paragraph}>{children}</p>,
  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:982b05f95cabb0836f62205b05f1f032872094d0e7f1bb740d2882e4a6db0be6
  li: ({ children }) => <li className={styles.listItem}>{children}</li>,
  ul: ({ children }) => <ul className={styles.list}>{children}</ul>,
  ol: ({ children, start }) => (
    <ol className={styles.list} start={start}>
      {children}
    </ol>
  ),
};

// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:4a507e6576a28341e9d9e526951fb2509112af45f2ef9ab29cfe3fd34af5e110
// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:1a5968388df03002ba2616c987baf2d75a1833634a5a5feefc3ca3052f513f90
function markdownOf(
  lines: readonly string[],
  components: Components,
  headingIds: readonly string[] = [],
  key?: number,
): ReactElement {
  return (
    <Markdown
      key={key}
      components={components}
      remarkPlugins={[remarkGfm, remarkDocumentation(lines, headingIds)]}
    >
      {lines.join("\n")}
    </Markdown>
  );
}

// @lfy def/documentation/content.lfy:DocumentationContent
function inlineMarkdownOf(text: string): ReactElement {
  return markdownOf([text], {
    ...nestedComponents,
    p: ({ children }) => <>{children}</>,
  });
}

// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:be71616fcfaa4c59c044b77c9abd56015e6c3f6e475eea957e36a5053ea788b2
// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:0a3ebcfb083a3c6ba6abc1e017d8dedcedee1ce5d20ebc901aafef7816c94f23
const calloutKinds = new Map<string, CalloutKind>([
  ["info", CalloutKind.info],
  ["tip", CalloutKind.info],
  ["warning", CalloutKind.warning],
  ["danger", CalloutKind.danger],
]);

// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:6e261013d958cdd131de72417ba3cc6ea98fd34c0608d1732e6eb55b74fcbcda
const cardIcons = new Map<string, CardIcon>([
  ["book", CardIcon.book],
  ["code", CardIcon.code],
  ["terminal", CardIcon.terminal],
  ["edit", CardIcon.notebook],
]);

// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:6e261013d958cdd131de72417ba3cc6ea98fd34c0608d1732e6eb55b74fcbcda
// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:f6e9d533af364275e2567ed7cb9f1c3c25882eb947f9eaaeb1ede1c9db2b1d8b
function sectionsOf(
  lines: readonly string[],
): { readonly title: string; readonly lines: readonly string[] }[] {
  const sections: { title: string; lines: string[] }[] = [];
  for (const line of lines) {
    if (line.startsWith("### ")) {
      sections.push({ title: line.slice(4).trim(), lines: [] });
    } else {
      sections[sections.length - 1]?.lines.push(line);
    }
  }
  return sections;
}

// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:6e261013d958cdd131de72417ba3cc6ea98fd34c0608d1732e6eb55b74fcbcda
const linkLine = /^\s*\[([^\]]+)\]\(([^)\s]+)\)\s*$/;

// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:6e261013d958cdd131de72417ba3cc6ea98fd34c0608d1732e6eb55b74fcbcda
function cardOf(
  card: { readonly title: string; readonly lines: readonly string[] },
  index: number,
): ReactElement {
  const metaIndex = card.lines.findIndex((line) => line.startsWith("meta:"));
  const [label = "", icon = ""] = (card.lines[metaIndex] ?? "")
    .slice("meta:".length)
    .split("·")
    .map((part) => part.trim());
  const linkIndex = card.lines.findLastIndex((line) => linkLine.test(line));
  const link = linkLine.exec(card.lines[linkIndex] ?? "");
  const content = card.lines.filter(
    (_, lineIndex) => lineIndex !== metaIndex && lineIndex !== linkIndex,
  );
  return (
    <ResourceCard
      key={index}
      title={card.title}
      label={label}
      icon={cardIcons.get(icon) ?? CardIcon.book}
      href={link?.[2] ?? ""}
      action={(link?.[1] ?? "").replace(/\s*→\s*$/, "")}
      content={markdownOf(content, nestedComponents)}
    />
  );
}

// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:08e19ac1887a7d172ede5dbf5107c185b21feb33f0fe70c34612d4676806ba56
function fencedCodeOf(lines: readonly string[]): ReactElement[] {
  const blocks: ReactElement[] = [];
  let open: { fence: string; info: string; code: string[] } | undefined;
  for (const line of lines) {
    if (open) {
      if (nextFence(open.fence, line) === undefined) {
        blocks.push(codeBlockOf(open.info, open.code.join("\n"), blocks.length));
        open = undefined;
      } else {
        open.code.push(line);
      }
      continue;
    }
    const fence = nextFence(undefined, line);
    if (fence !== undefined) {
      open = { fence, info: fenceOpening.exec(line)?.[2] ?? "", code: [] };
    }
  }
  return blocks;
}

// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:afc802280118cfb235eaccebd209449bbc6d253879df9e2ff6cd63769755e34d
function blockOf(segment: Segment & { kind: "block" }, key: number): ReactElement {
  switch (segment.name) {
    // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:2ff91b35607d507e4a07832054d28d014fdf9d9f27aeff31153541f5a31012d3
    case "callout": {
      const [, kind = "", title = ""] = /^(\S*)\s*(.*)$/.exec(segment.args) ?? [];
      return (
        <Callout
          key={key}
          kind={calloutKinds.get(kind) ?? CalloutKind.info}
          header={inlineMarkdownOf(title)}
          content={markdownOf(segment.lines, nestedComponents)}
        />
      );
    }
    // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:6e261013d958cdd131de72417ba3cc6ea98fd34c0608d1732e6eb55b74fcbcda
    case "cards":
      return <CardGrid key={key} content={sectionsOf(segment.lines).map(cardOf)} />;
    // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:f6e9d533af364275e2567ed7cb9f1c3c25882eb947f9eaaeb1ede1c9db2b1d8b
    case "steps":
      return (
        <Steps
          key={key}
          steps={sectionsOf(segment.lines).map((step) => ({
            title: step.title,
            content: <div className={styles.blocks}>{renderSource(step.lines)}</div>,
          }))}
        />
      );
    // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:1c0abc5b83fe799bea78a9090129a79e1de674b89ddd3113f4b426f019329761
    case "flow":
      return (
        <Flow
          key={key}
          stages={segment.lines
            .filter((line) => line.trim() !== "")
            .map((line) => {
              const bar = line.indexOf("|");
              const label = bar === -1 ? line : line.slice(0, bar);
              const description = bar === -1 ? "" : line.slice(bar + 1);
              return {
                label: inlineMarkdownOf(label.trim()),
                description: inlineMarkdownOf(description.trim()),
              };
            })}
        />
      );
    // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:08e19ac1887a7d172ede5dbf5107c185b21feb33f0fe70c34612d4676806ba56
    case "compare":
      return <Columns key={key} content={fencedCodeOf(segment.lines)} />;
    // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:17fce985ad3cfcd2c43c822f7d5ecff47cb1c3e4a87fe1ad26e6e1506bcd67c0
    default:
      return <div key={key} className={styles.blocks}>{renderSource(segment.lines)}</div>;
  }
}

// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:afc802280118cfb235eaccebd209449bbc6d253879df9e2ff6cd63769755e34d
// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:14e2549438465360176f5048cafb900f9d5a8b3969b9b763e1bf9711168a0e17
function renderSource(
  lines: readonly string[],
  headings: readonly DocumentationHeading[] = [],
): ReactElement[] {
  let used = 0;
  return segmentsOf(lines.join("\n")).map((segment, index) => {
    if (segment.kind === "block") {
      return blockOf(segment, index);
    }
    const count = headingLineIndexes(segment.lines).length;
    const ids = headings.slice(used, used + count).map((heading) => heading.id);
    used += count;
    return markdownOf(segment.lines, blockComponents, ids, index);
  });
}

// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:component:e0d5a65545a376a9b3621b003d41d99811ea7a3a87ce294d757d5ffac0e57a15
// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:component:85b63371a088bb4a894d438a609f6e91806c1dbdab78a0840b1858a9aa1459fe
export type DocumentationContentProps = {
  readonly source: string;
};

// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
// @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
export function DocumentationContent({ source }: DocumentationContentProps) {
  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:DocumentationContent:c1a36f23f6c2c04e1a8e0721d4d3059f36c4ac012620582563f5fad4aa572fd1
  // @lfy def/documentation/content.lfy:DocumentationContent#DocumentationContent:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  return (
    <div className={styles.content}>
      {renderSource(source.split("\n"), headingsOf(source))}
    </div>
  );
}
