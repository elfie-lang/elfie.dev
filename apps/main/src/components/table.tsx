import type { ReactNode } from "react";

import styles from "./table.module.css";

// @lfy def/components/table.lfy:Table#Table:component:e0d5a65545a376a9b3621b003d41d99811ea7a3a87ce294d757d5ffac0e57a15
// @lfy def/components/table.lfy:Table#Table:component:85b63371a088bb4a894d438a609f6e91806c1dbdab78a0840b1858a9aa1459fe
export type TableProps = {
  readonly columns: readonly ReactNode[];
  readonly rows: readonly (readonly ReactNode[])[];
};

// @lfy def/components/table.lfy:Table#Table:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
// @lfy def/components/table.lfy:Table#Table:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
export function Table({ columns, rows }: TableProps) {
  // @lfy def/components/table.lfy:Table#Table:Table:8203d6dcb572a99e87e4b216ac34fb28829ce4f43bd4132813ce260e461b0cbe
  // @lfy def/components/table.lfy:Table#Table:Table:d21c965ee41f429bda349719f2b06c28711bafcfc37411210dadee2b20c61997
  // @lfy def/components/table.lfy:Table#Table:Table:1b06226f736e389d7ce5384fea4e7ec6995752e478146a1a90f9f5b54ae841b2
  // @lfy def/components/table.lfy:Table#Table:Table:9647ab9d95bedeb420c7b7a6dc15e282232ed27d10b9c938ed2135494df51ed3
  // @lfy def/components/table.lfy:Table#Table:Table:8ddea2c3ef64e737b69b764925cb5aafdd20a4899c718618d6141e997d293d92
  // @lfy def/components/table.lfy:Table#Table:Table:31c3da355e2dfd075dade52cbea150cd69385b6d22a9aa8296b2180da8d62691
  return (
    <div className={styles.frame} tabIndex={0}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th className={styles.headerCell} scope="col" key={index}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td className={styles.cell} key={cellIndex}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
