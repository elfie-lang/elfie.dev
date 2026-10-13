import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import * as sequence from "./sequence";
import { Columns, Flow, Steps, type FlowStage, type Step } from "./sequence";

const steps: readonly Step[] = [
  { title: "Install", content: <p>Run the installer.</p> },
  { title: "Write", content: <p>Write a definition.</p> },
  { title: "Compile", content: <p>Compile it.</p> },
];

const stages: readonly FlowStage[] = [
  { label: "Parse", description: "Read the source" },
  { label: "Check", description: "Find problems" },
  { label: "Generate", description: "Write the outputs" },
];

describe("sequence", () => {
  // @lfy def/components/sequence.lfy:Steps#Steps:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
  test("Steps, Flow, and Columns are named components and there is no default export", () => {
    expect(sequence.Steps.name).toBe("Steps");
    expect(sequence.Flow.name).toBe("Flow");
    expect(sequence.Columns.name).toBe("Columns");
    expect("default" in sequence).toBe(false);
  });

  // @lfy def/components/sequence.lfy:Steps#Steps:Steps:8cecc0b7410ec5af4037f0c6c68ad192bb70c9d056a60b8d584aa8bd1327db7b
  test("Steps renders an ordered list with one item per step, in order", () => {
    const html = renderToStaticMarkup(<Steps steps={steps} />);
    expect(html.startsWith("<ol")).toBe(true);
    expect(html.match(/<li[ >]/g)?.length).toBe(3);
    const install = html.indexOf("Install");
    const write = html.indexOf("Write");
    const compile = html.indexOf("Compile");
    expect(install).toBeLessThan(write);
    expect(write).toBeLessThan(compile);
  });

  // @lfy def/components/sequence.lfy:Steps#Steps:Steps:9cebe131992d9ff4df970e5af51699c1fdd767f198d3ddebb5cf2bb2605a858a
  test("Steps numbers its markers from 1", () => {
    const html = renderToStaticMarkup(<Steps steps={steps} />);
    const numbers = [...html.matchAll(/<span[^>]*>(\d+)<\/span>/g)].map((m) => m[1]);
    expect(numbers).toEqual(["1", "2", "3"]);
  });

  // @lfy def/components/sequence.lfy:Steps#Steps:Steps:d87fa3ebdef3f977513cf31e0ae303cc5d1bb1226c8e4ff1be441f2c0624b9b6
  test("Steps draws a line after every marker but the last", () => {
    const html = renderToStaticMarkup(<Steps steps={steps} />);
    expect(html.match(/aria-hidden="true"/g)?.length).toBe(2);
  });

  // @lfy def/components/sequence.lfy:Steps#Steps:Steps:f0593b7edb5a22d26fe00049f67e57cf451ca75876a26d021a28bde921b7aeba
  test("Steps shows each title as a level 3 heading before its content", () => {
    const html = renderToStaticMarkup(<Steps steps={steps} />);
    expect(html).toMatch(/<h3[^>]*>Install<\/h3><div[^>]*><p>Run the installer.<\/p><\/div>/);
  });

  // @lfy def/components/sequence.lfy:Flow#Flow:Flow:5221f7540bc7fa6038cdab346bb8c64a9a60180b42f4baf978c9415821257756
  test("Flow renders one list item per stage, in order", () => {
    const html = renderToStaticMarkup(<Flow stages={stages} />);
    expect(html).toContain("<ul");
    expect(html.match(/<li[ >]/g)?.length).toBe(3);
    expect(html.indexOf("Parse")).toBeLessThan(html.indexOf("Check"));
    expect(html.indexOf("Check")).toBeLessThan(html.indexOf("Generate"));
  });

  // @lfy def/components/sequence.lfy:Flow#Flow:Flow:a3dc18b74ca2487e7ba059765dfb6e9af24e473a9b69e1e5a456a6f5ba13fb89
  test("Flow puts a hidden arrow between each stage and the next", () => {
    const html = renderToStaticMarkup(<Flow stages={stages} />);
    expect(html.match(/aria-hidden="true">→<\/span>/g)?.length).toBe(2);
  });

  // @lfy def/components/sequence.lfy:Columns#Columns:Columns:4b8b2aa30315aa8618f135122203e5aa65ff30a1b5ebd11ac02cf1ef1360e397
  test("Columns renders each child of content", () => {
    const html = renderToStaticMarkup(
      <Columns
        content={
          <>
            <pre>left</pre>
            <pre>right</pre>
          </>
        }
      />,
    );
    expect(html).toMatch(/<div[^>]*><pre>left<\/pre><pre>right<\/pre><\/div>/);
  });

  // @lfy def/components/sequence.lfy:Steps#Steps:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  test("Steps renders as a JSX element", () => {
    expect((<Steps steps={steps} />).type).toBe(Steps);
  });
});
