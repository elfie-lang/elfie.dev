import { Button, ButtonEmphasis, ButtonSize, Link, Logo } from "@/components/atoms";

// @lfy def/main.lfy:Home#Home:page:9b214c9dc59fcca1fb5bcdafc3e7ff3f93945beca1cd3a0e0d65da2c94706e34
import styles from "./page.module.css";

// @lfy def/main.lfy:Home#Home:Home:aa6756d38dc289634ab70893caef5d8b1aea420bb3e6c46be8073b52d3e28ba6
const learnMoreHref = "/docs";

// @lfy def/main.lfy:Home#Home:Home:147d9ea5c7d10f23936017a645932752133057536fe375b9ef640bd0a004a842
const downloadHref = "https://github.com/elfie-lang/elfie/releases";

// @lfy def/main.lfy:Home#Home:Home:aa6756d38dc289634ab70893caef5d8b1aea420bb3e6c46be8073b52d3e28ba6
const documentationHref = "/docs";

// @lfy def/main.lfy:Home#Home:Home:61d7edf461c5b23551a24cdf511883a533e986ff50f675dca04ea6a8f25fff5d
const communityHref = "https://github.com/elfie-lang/elfie";

// @lfy def/main.lfy:Home
const resources = [
  {
    href: documentationHref,
    label: "Documentation ↗",
    caption: "Explore the language",
  },
  { href: "#tutorials", label: "Tutorials ↗", caption: "Build step by step" },
  { href: communityHref, label: "More ↗", caption: "GitHub · Community" },
] as const;

// @lfy def/main.lfy:Home
const transformCode = [
  "fn minify(input: string): `Strips extra space` -> string {",
  "  @acceptanceCriteria",
  "    .add({",
  "      situation = `Input is code`,",
  "      behavior = `Preserve spaces in literals`,",
  "    });",
  "  @test.add({",
  "    input = [`  remove      extra   space     `],",
  "    output = `remove extra space`,",
  "  });",
  "}",
].join("\n");

// @lfy def/main.lfy:Home
const signupCode = [
  "fn signup(email: string) -> User {",
  "  where (`[[email]] is already in DB`) -> `Throw error`;",
  "  where (`[[email]] not in DB`) -> `Save it`;",
  "}",
].join("\n");

// @lfy def/main.lfy:Home
const signupRustCode = [
  "#[derive(Debug, thiserror::Error)] ",
  "pub enum SignupError { ",
  '    #[error("{0} is already registered")] ',
  "    EmailAlreadyRegistered(String), ",
  "    #[error(transparent)] ",
  "    Db(#[from] DbError), ",
  "} ",
  " ",
  "// Compiled from fn signup ",
  "pub fn signup(store: &impl UserStore, email: &str) -> Result<User, SignupError> { ",
  "    if store.exists_by_email(email)? { ",
  "        return Err(SignupError::EmailAlreadyRegistered(email.to_owned())); ",
  "    } ",
  "    Ok(store.insert_user(email)?) ",
  "}",
].join("\n");

// @lfy def/main.lfy:Home
const outputLanguages = ["Rust", "Go", "Typescript", "Python", "C#", "C++"] as const;

// @lfy def/main.lfy:Home#Home:Home:6433e78acd259c764c6fd5d0c878e85c1e3dd1761e653f0b6d59d429df028bcb
const illustrationSrc = "/elfie/illustration.svg";

// @lfy def/main.lfy:Home
function CodeBlock({
  filename,
  code,
}: {
  readonly filename: string;
  readonly code: string;
}) {
  return (
    <figure className={styles.codeBlock}>
      <figcaption className={styles.codeHeader}>{filename}</figcaption>
      <pre className={styles.codeBody} tabIndex={0}>
        <code>{code}</code>
      </pre>
    </figure>
  );
}

// @lfy def/main.lfy:Home#Home:page:4969c847679bc932b419a832239427a8e8adf8036bc320ecd1c199b1a8a23755
// @lfy def/main.lfy:Home#Home:page:6fc30fb3472a15a08cb00ba684dc437fa0a69257292ddf2512e95844c5cad06a
// @lfy def/main.lfy:Home#Home:fromFigma:f1b64edebb3d25791d66dd1c2136448c96c6db54718d716b387af4564a3e2ec2
export default async function Home() {
  // @lfy def/main.lfy:Home#Home:Home:e914d50b37e6d75226fe156880116e527e9cd280d68106b639f6cd83cc9dd7f6
  // @lfy def/main.lfy:Home#Home:page:f0f581c3adddedcbd2cd7360dc5eccfc92a03684edeb5d673e318ef92eff0e1b
  // @lfy def/main.lfy:Home#Home:Home:68b35d7ce54271c9776e50c4adc5a71a0589ec4c3181e2c6353a86783a0ef77a
  return (
    <div className={styles.home}>
      <header className={styles.navigation}>
        <p className={styles.wordmark}>Elfie</p>
        <nav aria-label="Primary">
          <Link
            href="#language"
            content="The Elfie language ↗"
            showIndicator={false}
          />
        </nav>
      </header>
      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <Logo />
          <div className={styles.introduction}>
            <h1 id="hero-title" className={styles.heroTitle}>
              <span className={styles.heroLine}>A little code.</span>
              <span className={styles.heroLine}>A lot of magic.</span>
            </h1>
            <p className={styles.heroLead}>
              Meet Elfie, a programming language for an agentic world.
            </p>
          </div>
          <div className={styles.actions}>
            <Button
              href={learnMoreHref}
              className={styles.learnMore}
              size={ButtonSize.Large}
              content="Learn More"
            />
            <Button
              href={downloadHref}
              emphasis={ButtonEmphasis.Secondary}
              size={ButtonSize.Large}
              content={
                <>
                  Download Elfie<span aria-hidden="true">↓</span>
                </>
              }
            />
          </div>
        </section>
        <section
          id="language"
          className={styles.language}
          aria-labelledby="language-title"
        >
          <h2 id="language-title" className={styles.languageTitle}>
            The Elfie language
          </h2>
          <p className={styles.languageBody}>
            <span className={styles.languageLine}>
              A real programming language that treats your agent as a compiler.
            </span>
            <span className={styles.languageLine}>
              Codify your requirements, shape the logic, and keep building.
            </span>
          </p>
        </section>
        <ul className={styles.resources} aria-label="Resources">
          {resources.map((resource) => (
            <li key={resource.href} className={styles.resource}>
              <Link
                href={resource.href}
                content={resource.label}
                showIndicator={false}
              />
              <p className={styles.resourceCaption}>{resource.caption}</p>
            </li>
          ))}
        </ul>
        <section className={styles.why} aria-labelledby="why-title">
          <div className={styles.explainerHeader}>
            <img
              className={styles.divider}
              src="/elfie/divider.svg"
              alt=""
              width={436}
              height={1}
              decoding="async"
            />
            <h2 id="why-title" className={styles.whyTitle}>
              Why Choose Elfie
            </h2>
          </div>
          <article className={styles.example}>
            <div className={styles.exampleText}>
              <h3 className={styles.exampleTitle}>Get Deterministic Outcomes</h3>
              <p className={styles.exampleBody}>
                The Elfie language is built around specifying exactly what the
                outcomes of any piece of code are. And the compiler is built to
                enforce those outcomes are true.
              </p>
            </div>
            <div className={styles.exampleCode}>
              <CodeBlock filename="transform.lfy" code={transformCode} />
            </div>
          </article>
          <article className={styles.example}>
            <img
              className={styles.illustration}
              src={illustrationSrc}
              alt="The call hashFile(file, Algo.SHA256) points up to the signature hashFile(toHash: File, algorithm: Algo): string, which hashes the contents of a file with a specified algorithm; its file argument points to const file: `File to verify`, and Algo.SHA256 points to enum Algo { SHA256 = 'sha256' }."
              width={652}
              height={454}
              loading="lazy"
              decoding="async"
            />
            <div className={styles.exampleText}>
              <h3 className={styles.exampleTitle}>Empowers Agents Beyond Text</h3>
              <p className={styles.exampleBody}>
                The Elfie compiler is also an MCP server that empowers the agent
                to explore code, types, output and anything else it needs without
                needing to read or grep files. It’s like finally giving your agent
                its own IDE.
              </p>
            </div>
          </article>
          <article className={styles.compile}>
            <div className={styles.compileSource}>
              <div className={styles.compileText}>
                <h3 className={styles.exampleTitle}>Compile to Any Languages</h3>
                <p className={styles.exampleBody}>
                  Compile Elfie code to any language that your agent can write.
                  Or, teach your agent a brand new langauge and compile to that!
                  You can also compile to multiple languages from the same code
                </p>
              </div>
              <CodeBlock filename="signup.lfy" code={signupCode} />
            </div>
            <div className={styles.connector}>
              <code className={styles.connectorLabel}>elfie compile</code>
              <span className={styles.connectorArrow} aria-hidden="true">
                <img
                  className={styles.connectorArrowImage}
                  src="/elfie/compile-arrow.svg"
                  alt=""
                  width={132}
                  height={14.7279}
                  decoding="async"
                />
              </span>
            </div>
            <div className={styles.output}>
              <ul className={styles.outputLanguages} aria-label="Output languages">
                {outputLanguages.map((language) => (
                  <li
                    key={language}
                    className={styles.outputLanguage}
                    aria-current={language === "Rust" ? "true" : undefined}
                  >
                    {language}
                  </li>
                ))}
              </ul>
              <div className={styles.outputCode}>
                <CodeBlock filename="signup.rs" code={signupRustCode} />
              </div>
            </div>
          </article>
        </section>
      </main>
      <footer className={styles.footer}>
        <p className={styles.footerText}>© Elfie</p>
      </footer>
    </div>
  );
}
