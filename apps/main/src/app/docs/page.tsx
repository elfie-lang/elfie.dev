import type { Metadata } from "next";

import { Button, Link } from "@/components/atoms";
import { Callout } from "@/components/callout";
import { CardGrid, CardIcon, ResourceCard } from "@/components/card";
import { CodeBlock } from "@/components/code";
import { DocumentationLayout } from "@/components/documentation/layout";
import { documentationPageOf } from "@/lib/documentation/pages";

// @lfy def/documentation/main.lfy:Documentation#Documentation:page:9b214c9dc59fcca1fb5bcdafc3e7ff3f93945beca1cd3a0e0d65da2c94706e34
import styles from "./page.module.css";

// @lfy def/documentation/main.lfy:Documentation#Documentation:Documentation:bc4eb5a8e9953e0f97ec55afb42f3d46dde20cfcde16c73a1b54e3b79e323ac5
// @lfy def/documentation/main.lfy:Documentation
const helloCode = [
  "fn hello(): `Greets the world` {",
  "  @acceptanceCriteria.add({",
  '    behavior = `Prints "Hello world!"`,',
  "  });",
  "}",
].join("\n");

// @lfy def/documentation/main.lfy:Documentation#Documentation:documentationPage:1d0d6564d52373071a6ef6c9916ff4f842ecc06339aa563a77e7645a2bd49844
// @lfy def/documentation/main.lfy:Documentation
export const metadata: Metadata = {
  title: "Overview · Elfie documentation",
  description: documentationPageOf("overview")?.description.replaceAll("`", ""),
};

// @lfy def/documentation/main.lfy:Documentation#Documentation:page:cfa99fa23eb35e6c4f01179626fa0dea067d3d44bdd25418869f20e78093fb9b
// @lfy def/documentation/main.lfy:Documentation#Documentation:page:b50661584d4a33f85db5fb765f35b8ad836346e6f4ddbd25c14de78f46e941df
export default async function Documentation() {
  // @lfy def/documentation/main.lfy:Documentation#Documentation:Documentation:735f29c6fb82c7b663da6baba133452f79e9594540a54a2ff903371e347350a8
  const introduction = (
    <section className={styles.introduction} aria-labelledby="docs-title">
      <p className={styles.eyebrow}>Documentation</p>
      <h1 id="docs-title" className={styles.title}>
        A little guidance. A lot to build.
      </h1>
      <p className={styles.lead}>
        Explore the ideas behind Elfie, learn the shape of the language, and
        find your way from intent to a first program.
      </p>
      <Callout
        header="An early guide to an early language"
        content={
          <>
            The syntax, commands, and capabilities shown here are where the
            language stands today, and it is still changing quickly. Share
            feedback, ask questions, or report problems with the guide or the
            compiler in our{" "}
            <a className={styles.inlineLink} href="https://github.com/elfie-lang/elfie">
              GitHub repository
            </a>
            .
          </>
        }
      />
    </section>
  );

  // @lfy def/documentation/main.lfy:Documentation#Documentation:Documentation:f2475185e510d4ab57205b2883e56b1a3ac3e2e8023df4b022ad1c0af848d155
  const feature = (
    <section className={styles.feature} aria-labelledby="feature-title">
      <div className={styles.featureCopy}>
        <p className={styles.eyebrow}>New to Elfie?</p>
        <h2 id="feature-title" className={styles.featureTitle}>
          Start with a small idea.
        </h2>
        <p className={styles.featureBody}>
          Take a tour of the core ideas of the language and what it can do.
          Then build your first program with a guided example.
        </p>
        <Button
          href="/docs/getting-started"
          content={
            <>
              Read the getting started guide
              <span aria-hidden="true">→</span>
            </>
          }
        />
      </div>
      <div className={styles.featureCode}>
        <CodeBlock
          label="hello.lfy"
          code={helloCode}
          caption="A tiny example to start"
        />
      </div>
    </section>
  );

  // @lfy def/documentation/main.lfy:Documentation#Documentation:Documentation:9ae6830e4c2071bde0d5435294a05194a15eafc63ca59388d5f792a38ee5bf7d
  const explore = (
    <section className={styles.explore} aria-labelledby="explore-title">
      <h2 id="explore-title" className={styles.exploreTitle}>
        Find your next step
      </h2>
      <CardGrid
        content={
          <>
            <ResourceCard
              icon={CardIcon.book}
              label="Core concepts"
              title="Language guide"
              content="Understand the building blocks you can use to build your next piece of software."
              action="Explore the guide"
              href="/docs/familiar-concepts"
            />
            <ResourceCard
              icon={CardIcon.code}
              label="Diving deeper"
              title="Building with agents"
              content={
                <>
                  See how <code className={styles.inlineCode}>d</code>,{" "}
                  <code className={styles.inlineCode}>fn</code>, and acceptance
                  criteria turn intent into code that an agent writes and
                  another agent checks.
                </>
              }
              action="See agentic structures"
              href="/docs/agentic-structures"
            />
            <ResourceCard
              icon={CardIcon.terminal}
              label="Compiling code"
              title="CLI reference"
              content="A reference to the Elfie CLI: how to build your app, and every flag, setting, and file you need to get going."
              action="View command examples"
              href="/docs/cli"
            />
            <ResourceCard
              icon={CardIcon.notebook}
              label="Behind the language"
              title="Compiler details"
              content="Explore how a compile works and the language choices behind it."
              action="Read the compiler details"
              href="/docs/compiler-details"
            />
          </>
        }
      />
    </section>
  );

  // @lfy def/documentation/main.lfy:Documentation#Documentation:Documentation:2e108cfb87507712ac22bbefd19cf19a8ddaabcf68e68de84df601205558192d
  const route = (
    <section className={styles.route} aria-labelledby="route-title">
      <div className={styles.routeCopy}>
        <h2 id="route-title" className={styles.routeTitle}>
          Prefer learning by doing?
        </h2>
        <p className={styles.routeBody}>
          Follow a step-by-step tutorial and build a small program from the
          ground up.
        </p>
      </div>
      <Link href="/tutorials" content="Explore tutorials" showIndicator={false} />
    </section>
  );

  // @lfy def/documentation/main.lfy:Documentation#Documentation:documentationPage:352b964a716b2ee92c582f46963ffdd7f0f90ae8e5c084e0105c9a418915b6c2
  // @lfy def/documentation/main.lfy:Documentation#Documentation:fromFigma:c208cf7bab311dcb76280ab6931f70fa336e14becbfc8919e88b85c176be9650
  // @lfy def/documentation/main.lfy:Documentation#Documentation:page:6fc30fb3472a15a08cb00ba684dc437fa0a69257292ddf2512e95844c5cad06a
  // @lfy def/documentation/main.lfy:Documentation#Documentation:page:f0f581c3adddedcbd2cd7360dc5eccfc92a03684edeb5d673e318ef92eff0e1b
  // @lfy def/documentation/navigation.lfy:Navigation#Navigation:Navigation:5f0476ea1bc845fc2f770cf5edb331003302365dd7dbcc4f3c399384038d927e
  // @lfy def/documentation/navigation.lfy:Navigation#Navigation:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  return (
    <DocumentationLayout
      currentSlug="overview"
      content={
        <div className={styles.documentation}>
          {introduction}
          {feature}
          {explore}
          <hr className={styles.divider} />
          {route}
        </div>
      }
    />
  );
}
