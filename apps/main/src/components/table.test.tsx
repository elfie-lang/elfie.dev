import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import * as tableModule from "./table";
import { Table } from "./table";

describe("table", () => {
  // @lfy def/components/table.lfy:Table#Table:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
  test("Table is a named component and there is no default export", () => {
    expect(tableModule.Table).toBeFunction();
    expect(tableModule.Table.name).toBe("Table");
    expect("default" in tableModule).toBe(false);
  });

  // @lfy def/components/table.lfy:Table#Table:Table:8203d6dcb572a99e87e4b216ac34fb28829ce4f43bd4132813ce260e461b0cbe
  test("Table renders columns in its header and one body row per row, in order", () => {
    const html = renderToStaticMarkup(
      <Table
        columns={["Name", <em key="m">Meaning</em>]}
        rows={[
          [<code key="c">intent</code>, "The outcome"],
          ["input", "The information"],
        ]}
      />,
    );
    expect(html).toMatch(
      /<thead><tr><th [^>]*scope="col"[^>]*>Name<\/th><th [^>]*><em>Meaning<\/em><\/th><\/tr><\/thead>/,
    );
    const body = /<tbody>(.*)<\/tbody>/.exec(html)?.[1] ?? "";
    expect(body.match(/<tr>/g)?.length).toBe(2);
    expect(body).toMatch(/<code>intent<\/code>.*The outcome.*input.*The information/);
  });

  // @lfy def/components/table.lfy:Table#Table:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  test("Table renders as a JSX element", () => {
    expect((<Table columns={[]} rows={[]} />).type).toBe(Table);
  });
});
