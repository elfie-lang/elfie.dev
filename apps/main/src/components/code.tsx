"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./code.module.css";

// @lfy def/components/code.lfy:CopyImage
export const CopyImage: string = "/elfie/code-copy.svg";

// @lfy def/components/code.lfy:CodeBlock#CodeBlock:CodeBlock:486e6d023cd3e2591ff022850af2b1700c1205ff7f31f1c5b0d94a34672237a9
export const copiedDuration = 2000;

// @lfy def/components/code.lfy:CodeBlock#CodeBlock:CodeBlock:73925867fcc21a612acb006dfdbe1563eb812f918bc2662a9f88e7e8f4935485
function selectContents(element: HTMLElement) {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }
  const range = document.createRange();
  range.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(range);
}

// @lfy def/components/code.lfy:CodeBlock#CodeBlock:component:e0d5a65545a376a9b3621b003d41d99811ea7a3a87ce294d757d5ffac0e57a15
// @lfy def/components/code.lfy:CodeBlock#CodeBlock:component:85b63371a088bb4a894d438a609f6e91806c1dbdab78a0840b1858a9aa1459fe
export type CodeBlockProps = {
  readonly code: string;
  readonly label: string;
  readonly caption?: string;
};

// @lfy def/components/code.lfy:CodeBlock#CodeBlock:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
// @lfy def/components/code.lfy:CodeBlock#CodeBlock:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
export function CodeBlock({ code, label, caption }: CodeBlockProps) {
  const [copiedAt, setCopiedAt] = useState<number | null>(null);
  const copied = copiedAt !== null;
  const bodyRef = useRef<HTMLPreElement>(null);

  // @lfy def/components/code.lfy:CodeBlock#CodeBlock:CodeBlock:486e6d023cd3e2591ff022850af2b1700c1205ff7f31f1c5b0d94a34672237a9
  useEffect(() => {
    if (copiedAt === null) {
      return;
    }
    const timer = window.setTimeout(() => setCopiedAt(null), copiedDuration);
    return () => window.clearTimeout(timer);
  }, [copiedAt]);

  // @lfy def/components/code.lfy:CodeBlock#CodeBlock:CodeBlock:2280f3dd658357012806977fc9699f2fa06f86dee9b9ef0c94100987fc579bcc
  // @lfy def/components/code.lfy:CodeBlock#CodeBlock:CodeBlock:73925867fcc21a612acb006dfdbe1563eb812f918bc2662a9f88e7e8f4935485
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedAt(Date.now());
    } catch {
      setCopiedAt(null);
      if (bodyRef.current) {
        selectContents(bodyRef.current);
      }
    }
  }

  // @lfy def/components/code.lfy:CodeBlock#CodeBlock:fromFigma:1b56cb74e25e72156a181d74701087d7d6a795de3415eea342f589ebacabfc2f
  // @lfy def/components/code.lfy:CodeBlock#CodeBlock:CodeBlock:4cbae0aff3051a670e18bd0c4b3d14bda9db0437463ca9bf759b46bc9e297d4f
  // @lfy def/components/code.lfy:CodeBlock#CodeBlock:CodeBlock:eae42e76d538ee7740527bb41151f51f81156bc10d11ee2075fd80dfe912b057
  // @lfy def/components/code.lfy:CodeBlock#CodeBlock:CodeBlock:79f327b7295a200ff97cab8a9ea31ae57a993265f203bd2458c5ba1ceed7038c
  // @lfy def/components/code.lfy:CodeBlock#CodeBlock:CodeBlock:9a34705ece18c7065c03d21a13d662926e8e136a9e90120196339e7a86c171e9
  // @lfy def/components/code.lfy:CodeBlock#CodeBlock:CodeBlock:000965f7efd87b31425e91fffb5315be5c5dde877c05d254898cfd3d982e58c8
  // @lfy def/components/code.lfy:CodeBlock#CodeBlock:CodeBlock:a6db92d9fce9db52d1fa0a990f98bb6004328f61ffc8387a9fabd46d9f354685
  // @lfy def/components/code.lfy:CodeBlock#CodeBlock:CodeBlock:a9896b84ad8659ba6747b4a815ab4ca9a468f7548e19519f0b27755b7b4ef217
  return (
    <figure className={styles.codeBlock}>
      <div className={styles.example}>
        <div className={styles.header}>
          <span className={styles.label}>{label}</span>
          <button
            type="button"
            className={styles.copy}
            aria-label={copied ? "Copied" : "Copy code"}
            onClick={copy}
          >
            <img
              className={styles.copyIcon}
              src={CopyImage}
              alt=""
              width={16}
              height={16}
              decoding="async"
            />
          </button>
        </div>
        <pre className={styles.body} ref={bodyRef} tabIndex={0}>
          <code>{code}</code>
        </pre>
      </div>
      {caption === undefined ? null : (
        <figcaption className={styles.caption}>{caption}</figcaption>
      )}
    </figure>
  );
}
