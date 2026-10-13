import NextLink from "next/link";

import { Link } from "@/components/atoms";
import {
  DocumentationContent,
  headingsOf,
  type DocumentationHeading,
} from "@/components/documentation/content";
import {
  documentationPageOf,
  documentationPath,
  neighborsOf,
} from "@/lib/documentation/pages";

import styles from "./article.module.css";

// @lfy def/documentation/article.lfy:Pager#Pager:component:e0d5a65545a376a9b3621b003d41d99811ea7a3a87ce294d757d5ffac0e57a15
// @lfy def/documentation/article.lfy:Pager#Pager:component:85b63371a088bb4a894d438a609f6e91806c1dbdab78a0840b1858a9aa1459fe
export type PagerProps = {
  readonly slug: string;
};

// @lfy def/documentation/article.lfy:Pager#Pager:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
// @lfy def/documentation/article.lfy:Pager#Pager:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
export function Pager({ slug }: PagerProps) {
  // @lfy def/documentation/article.lfy:Pager#Pager:Pager:b17b9e48392af4fb2dc73cc59488877e40abe5cac02d484f9696f4998514f7e9
  const { previous, next } = neighborsOf(slug);
  // @lfy def/documentation/article.lfy:Pager#Pager:fromFigma:14942874828b963da2a2bdd400e1066d04d8c92cb23fcfb704effca373d7b726
  // @lfy def/documentation/article.lfy:Pager#Pager:Pager:6493642acc7e89d3b572efebd62e6b08afad88fa0b21f0230c3773c484ef4294
  // @lfy def/documentation/article.lfy:Pager#Pager:Pager:57aefce53ef117b3ed5b5e89d9734e6dd89f45212508dfceef1f5a4cb0112355
  // @lfy def/documentation/article.lfy:Pager#Pager:Pager:07dfa414c9d062bfbcead06f4006f2677582fc334e56b18e1af00cbb210dca3c
  // @lfy def/documentation/article.lfy:Pager#Pager:Pager:82bfbda4c90a051e8f917a75d44113c58adc8975081d7bc8395b0d253ed5b62c
  return (
    <nav className={styles.pager} aria-label="Pages">
      <div className={styles.previous}>
        {previous && (
          <>
            <p className={styles.pagerLabel}>Previous</p>
            <Link
              href={documentationPath(previous.slug)}
              content={`← ${previous.title}`}
              showIndicator={false}
            />
          </>
        )}
      </div>
      <div className={styles.next}>
        {next && (
          <>
            <p className={styles.pagerLabel}>Next</p>
            <Link
              href={documentationPath(next.slug)}
              content={`${next.title} →`}
              showIndicator={false}
            />
          </>
        )}
      </div>
    </nav>
  );
}

// @lfy def/documentation/article.lfy:OnThisPage#OnThisPage:component:e0d5a65545a376a9b3621b003d41d99811ea7a3a87ce294d757d5ffac0e57a15
// @lfy def/documentation/article.lfy:OnThisPage#OnThisPage:component:85b63371a088bb4a894d438a609f6e91806c1dbdab78a0840b1858a9aa1459fe
export type OnThisPageProps = {
  readonly headings: readonly DocumentationHeading[];
};

// @lfy def/documentation/article.lfy:OnThisPage#OnThisPage:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
// @lfy def/documentation/article.lfy:OnThisPage#OnThisPage:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
export function OnThisPage({ headings }: OnThisPageProps) {
  // @lfy def/documentation/article.lfy:OnThisPage#OnThisPage:fromFigma:f4fd399ce6212adb354a3e1d5982a159e5f150155e8b39afc82041a9f4ffa15d
  // @lfy def/documentation/article.lfy:OnThisPage#OnThisPage:OnThisPage:61fbcb9beba0a73f14bcf403f9ccaed5901b3188b1d5ed2475191b0fbac283a8
  // @lfy def/documentation/article.lfy:OnThisPage#OnThisPage:OnThisPage:3eeec83ed9ce21e193ced687aa64640c0b333b94b813498ed97981bc8fcf4fbd
  // @lfy def/documentation/article.lfy:OnThisPage#OnThisPage:OnThisPage:cfbdf7c86e28315159990faced5b42e8af219772da40831765aee3eb98d09792
  // @lfy def/documentation/article.lfy:OnThisPage#OnThisPage:OnThisPage:1d4efd95c9c5c973c5d6731dd85de6d21676bd7044f35a53af1f465165b92068
  // @lfy def/documentation/article.lfy:OnThisPage#OnThisPage:OnThisPage:401bdccc9daf43d0d148e4f27effb5b3e1703e3be07fc66f2bf68170ec7ce4f4
  return (
    <nav className={styles.onThisPage} aria-label="On this page">
      {headings.length > 0 && (
        <>
          <p className={styles.onThisPageLabel}>On this page</p>
          <ul className={styles.headings}>
            {headings.map((heading) => (
              <li key={heading.id}>
                <a className={styles.headingLink} href={`#${heading.id}`}>
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
      <hr className={styles.onThisPageDivider} />
      <Link
        href="https://github.com/elfie-lang/elfie/issues"
        content="Report an issue"
      />
      <p className={styles.note}>
        Found something unclear? Share a documentation suggestion.
      </p>
    </nav>
  );
}

// @lfy def/documentation/article.lfy:Article#Article:Article:0320878391025e794b379d293f06f8572c048fb69acd030de24102c8b2d0c20a
function descriptionOf(description: string) {
  return description
    .split("`")
    .map((part, index) =>
      index % 2 === 1 ? (
        <code key={index} className={styles.inlineCode}>
          {part}
        </code>
      ) : (
        part
      ),
    );
}

// @lfy def/documentation/article.lfy:Article#Article:component:e0d5a65545a376a9b3621b003d41d99811ea7a3a87ce294d757d5ffac0e57a15
// @lfy def/documentation/article.lfy:Article#Article:component:85b63371a088bb4a894d438a609f6e91806c1dbdab78a0840b1858a9aa1459fe
export type ArticleProps = {
  readonly slug: string;
  readonly source: string;
};

// @lfy def/documentation/article.lfy:Article#Article:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
// @lfy def/documentation/article.lfy:Article#Article:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
export function Article({ slug, source }: ArticleProps) {
  // @lfy def/documentation/article.lfy:Article#Article:Article:e1a65f1d38024f5e766026760726feb2f47775ab202d572059982986c5717192
  const page = documentationPageOf(slug);
  const title = page?.title ?? slug;
  // @lfy def/documentation/article.lfy:Article#Article:fromFigma:da0be065b06c96fca675e5bbf8c0b944617cbf7dc8fb2ab70f58256e5b4de2a2
  // @lfy def/documentation/article.lfy:Article#Article:Article:d221fdc1088c5029e148c0b48e9d97c64895017c86d7df51373a5c6c3a4a0db6
  // @lfy def/documentation/article.lfy:Article#Article:Article:0320878391025e794b379d293f06f8572c048fb69acd030de24102c8b2d0c20a
  // @lfy def/documentation/article.lfy:Article#Article:Article:e3eece55da46c4626aa6ceb70035c3c7fb309c88ed04315478a0ae5e074d074f
  // @lfy def/documentation/article.lfy:Article#Article:Article:59a30d7efff600994a49c1289a0d7a0a598466b68f5c2d6feb78d13112079e79
  // @lfy def/documentation/article.lfy:Article#Article:Article:357302466d306ec3e28e0bbcfda181fad545648be1c16d3f6ebf1e88563ed0f9
  // @lfy def/documentation/article.lfy:Article#Article:Article:7e1889d9734b3657b49b25e60f91ae1f09c5bf9e1024492d0a1bebbc15135b99
  // @lfy def/documentation/article.lfy:Article#Article:Article:359c8bbed50d641eac2168d3b3ca3594d908e826307257b38eb110d29e8d4d95
  // @lfy def/documentation/article.lfy:Pager#Pager:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  // @lfy def/documentation/article.lfy:OnThisPage#OnThisPage:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  return (
    <div className={styles.article}>
      <article className={styles.column}>
        <header className={styles.introduction}>
          <p className={styles.breadcrumb}>
            <NextLink href="/docs" className={styles.breadcrumbLink}>
              Documentation
            </NextLink>{" "}
            / {title}
          </p>
          <h1 className={styles.title}>{title}</h1>
          {page && (
            <>
              <p className={styles.description}>
                {descriptionOf(page.description)}
              </p>
              <div className={styles.metadata}>
                <span className={styles.tag}>{page.section}</span>
              </div>
            </>
          )}
        </header>
        <DocumentationContent source={source} />
        <hr className={styles.divider} />
        <Pager slug={slug} />
        <div className={styles.feedback}>
          <p className={styles.feedbackQuestion}>Was this guide clear?</p>
          <Link
            href="https://github.com/elfie-lang/elfie/issues/new"
            content="Share a suggestion"
          />
        </div>
      </article>
      <aside className={styles.aside}>
        <OnThisPage headings={headingsOf(source)} />
      </aside>
    </div>
  );
}
