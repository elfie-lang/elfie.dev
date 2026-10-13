import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { Logo } from "@/components/atoms";
import Home from "./page";

describe("Home", () => {
  // @lfy def/main.lfy:Home#Home:page:4969c847679bc932b419a832239427a8e8adf8036bc320ecd1c199b1a8a23755
  test("renders the page at /", async () => {
    expect(import.meta.path).toEndWith("/src/app/page.test.tsx");
    const html = renderToStaticMarkup(await Home());
    expect(html).toContain("<h1");
  });

  // @lfy def/main.lfy:Home#Home:Home:e914d50b37e6d75226fe156880116e527e9cd280d68106b639f6cd83cc9dd7f6
  test("uses Logo for the logo", async () => {
    const html = renderToStaticMarkup(await Home());
    const logo = renderToStaticMarkup(<Logo />).replace(/^(<link [^>]*>)*/, "");
    expect(html).toContain(logo);
  });

  // @lfy def/main.lfy:Home#Home:Home:147d9ea5c7d10f23936017a645932752133057536fe375b9ef640bd0a004a842
  test("Download button links to the releases", async () => {
    const html = renderToStaticMarkup(await Home());
    expect(html).toMatch(
      /<a[^>]*href="https:\/\/github\.com\/elfie-lang\/elfie\/releases"[^>]*>(?:(?!<\/a>).)*Download Elfie/s,
    );
  });

  // @lfy def/main.lfy:Home#Home:Home:61d7edf461c5b23551a24cdf511883a533e986ff50f675dca04ea6a8f25fff5d
  test("Community link links to the repository", async () => {
    const html = renderToStaticMarkup(await Home());
    expect(html).toMatch(
      /<a[^>]*href="https:\/\/github\.com\/elfie-lang\/elfie"[^>]*>(?:(?!<\/a>).)*More/s,
    );
  });

  // @lfy def/main.lfy:Home#Home:Home:aa6756d38dc289634ab70893caef5d8b1aea420bb3e6c46be8073b52d3e28ba6
  test("Learn more button and Documentation link link to /docs", async () => {
    const html = renderToStaticMarkup(await Home());
    expect(html).toMatch(
      /<a[^>]*href="\/docs"[^>]*>(?:(?!<\/a>).)*Learn More/s,
    );
    expect(html).toMatch(
      /<a[^>]*href="\/docs"[^>]*>(?:(?!<\/a>).)*Documentation/s,
    );
  });

  // @lfy def/main.lfy:Home#Home:Home:68b35d7ce54271c9776e50c4adc5a71a0589ec4c3181e2c6353a86783a0ef77a
  test("renders every Button link as an <a> with an href", async () => {
    const html = renderToStaticMarkup(await Home());
    expect(html).not.toContain("<form");
    expect(html).not.toMatch(/<button[^>]*>(?:(?!<\/button>).)*(?:Learn More|Download Elfie)/s);
    expect(html).toMatch(/<a[^>]*href="[^"]+"[^>]*>(?:(?!<\/a>).)*Learn More/s);
    expect(html).toMatch(/<a[^>]*href="[^"]+"[^>]*>(?:(?!<\/a>).)*Download Elfie/s);
  });

  // @lfy def/main.lfy:Home#Home:Home:6433e78acd259c764c6fd5d0c878e85c1e3dd1761e653f0b6d59d429df028bcb
  test("shows the illustration exported from Figma as an SVG", async () => {
    const html = renderToStaticMarkup(await Home());
    expect(html).toMatch(/<img[^>]*src="\/elfie\/illustration\.svg"[^>]*alt="[^"]+"/);
    const svg = await Bun.file(`${import.meta.dir}/../../public/elfie/illustration.svg`).text();
    expect(svg).toStartWith("<svg");
  });

  // @lfy def/main.lfy:Home#Home:page:9b214c9dc59fcca1fb5bcdafc3e7ff3f93945beca1cd3a0e0d65da2c94706e34
  test("keeps its styles in a CSS module beside the page", async () => {
    const page = await Bun.file(`${import.meta.dir}/page.tsx`).text();
    expect(page).toContain('import styles from "./page.module.css";');
    expect(await Bun.file(`${import.meta.dir}/page.module.css`).exists()).toBe(true);
  });
});
