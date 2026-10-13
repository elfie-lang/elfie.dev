import type { Metadata } from "next";

import { Article } from "@/components/documentation/article";
import { DocumentationLayout } from "@/components/documentation/layout";
import { documentationPageOf } from "@/lib/documentation/pages";

// @lfy def/documentation/pages/ace.lfy:AtCompileExecutionPage#AtCompileExecutionPage:documentationArticle:8afa87c58e49edacbb2bd456a21d0684fc5737cdafe00dbfe44d33274a3c8267
const markdown = `## Two times your code runs

Most of an Elfie program describes code that runs later, after the compiler has generated it. Some of it runs earlier, while \`elfie\` binds your definitions:

- statements marked \`ace\`
- trait bodies, once for each entity the trait is applied to
- \`{{ }}\` executions in templates and descriptions
- the context statements in a \`fn\` body: \`@acceptanceCriteria\`, \`@test\`, \`where\`, \`with\`, and \`for\`

What runs at compile time shapes the program the compiler is asked to build. It never appears in the generated code.

## ace const

\`\`\`lfy title="def/statuses.lfy"
ace const statuses: \`HTTP statuses an endpoint may answer with\` = {
  notFound = 404,
  conflict = 409,
};
\`\`\`

An \`ace const\` exists only while compiling. You'll use one in every project, because a target is declared as an \`ace const\`:

\`\`\`lfy title="def/targets.lfy"
ace const mainApp: \`Elfie.dev main app\` = NextJS.app({
  root = \`apps/main\`,
  runtime = bun,
  ecosystem = bunPackages,
});
\`\`\`

## ace function

An \`ace function\` is a function, written in full, that you call while compiling. Packages use them for target presets, such as \`NextJS.app\` above. Your own can build prose.

\`\`\`lfy title="def/statuses.lfy"
ace function sentence(words: string[]): \`Joins words into one sentence\` -> string {
  return words.join(" ") + ".";
}

fn findUser(id: string) is answers([statuses.notFound]): \`{{sentence(["Looks", "up", "one", "user"])}}\` => string {
  @acceptanceCriteria.add({ behavior = \`Returns the user's name\` });
}
\`\`\`

## Generating criteria

Loops in a trait body run at compile time, so one trait can write as many criteria as its arguments call for:

\`\`\`lfy title="def/statuses.lfy"
trait answers(codes: number[]): \`Answers with each status in a list\` {
  for (const code in codes) {
    where (\`The request cannot be served with status {{code}}\`) -> \`The answer has status {{code}}\`;
  }
}
\`\`\`

\`findUser\` above carries \`answers([statuses.notFound])\`, so it gets one criterion: *When the request cannot be served with status 404, the answer has status 404.*

The compiler's own definitions use this to write its grammar. Each grammar rule is a \`d\` whose trait renders its EBNF, and \`{{ }}\` executions assemble the whole grammar from those rules.

## Reading files while compiling

\`ace\` code can call the system functions, so a definition can be built from a file in your project:

\`\`\`lfy title="def/release.lfy"
use "elfie/system/file";

ace const changelog: \`The release notes, read while compiling\` = read("CHANGELOG.md");

fn releaseNotes(): \`Shows the release notes\` => string {
  @acceptanceCriteria.add({ behavior = \`Returns this text: {{changelog}}\` });
}
\`\`\`

Whatever \`ace\` code reads becomes part of the specification, so the same source can bind to a different program when that file changes. Keep the files it reads in your project and under version control, and read them with paths relative to the project root.

\`Type@like(prompt)\` is different: it doesn't produce a value while binding. It stays a prompt for the compiler to fill in.

:::callout tip ace or fn?
Use \`ace\` when the result is part of the specification, such as a target, a table of cases, or a sentence of a criterion. Use \`fn\` when the result is behavior your program needs while it runs.
:::
`;

// @lfy def/documentation/pages/ace.lfy:AtCompileExecutionPage#AtCompileExecutionPage:documentationPage:5c061d1ab86b32cbab7372a3e654d203867ded8d9d40ed7c383bc3144e182c43
export const metadata: Metadata = {
  title: "At Compile Execution (ace) · Elfie documentation",
  description: documentationPageOf("ace")?.description.replaceAll("`", ""),
};

// @lfy def/documentation/pages/ace.lfy:AtCompileExecutionPage#AtCompileExecutionPage:page:c5692ffaad4decd044d2837abf7bcc9ae62cc9fd74380d2b1ab0e9146c84bd80
// @lfy def/documentation/pages/ace.lfy:AtCompileExecutionPage#AtCompileExecutionPage:page:04ef6e9ec149962b107c55e865511bb3dbf334266f8f7c3ce78203d3c7c44fcd
export default async function AtCompileExecutionPage() {
  // @lfy def/documentation/pages/ace.lfy:AtCompileExecutionPage#AtCompileExecutionPage:documentationArticle:f5bcce66ff090346c573346bebee86e28f176c4acde0683da1a5eca020e2a67e
  // @lfy def/documentation/pages/ace.lfy:AtCompileExecutionPage#AtCompileExecutionPage:documentationPage:7f50f2539ca00c91bd651a63762f066a598c0442f87e4477dc16342208d4f466
  // @lfy def/documentation/pages/ace.lfy:AtCompileExecutionPage#AtCompileExecutionPage:page:f0f581c3adddedcbd2cd7360dc5eccfc92a03684edeb5d673e318ef92eff0e1b
  // @lfy def/documentation/pages/ace.lfy:AtCompileExecutionPage#AtCompileExecutionPage:page:6fc30fb3472a15a08cb00ba684dc437fa0a69257292ddf2512e95844c5cad06a
  // @lfy def/documentation/pages/ace.lfy:AtCompileExecutionPage#AtCompileExecutionPage:page:9b214c9dc59fcca1fb5bcdafc3e7ff3f93945beca1cd3a0e0d65da2c94706e34
  return (
    <DocumentationLayout
      currentSlug="ace"
      content={<Article slug="ace" source={markdown} />}
    />
  );
}
