import type { Metadata } from "next";

import { Article } from "@/components/documentation/article";
import { DocumentationLayout } from "@/components/documentation/layout";
import { documentationPageOf } from "@/lib/documentation/pages";

// @lfy def/documentation/pages/cli.lfy:CliReferencePage#CliReferencePage:documentationArticle:b462821dc355f9e666c81598f761a090ea384e1d0aaf71cbc97561db3925796a
const markdown = `\`\`\`text title="Usage"
elfie <command> [arguments] [--root <dir>] [--json]
\`\`\`

## Options for every command

| Option | Effect |
| --- | --- |
| \`--root <dir>\` | The project directory. Defaults to the nearest directory at or above the current one that holds \`elfie.json\`. |
| \`--json\` | Print results as JSON lines, for scripts and agents. |
| \`--color <choice>\` | When to color output: \`auto\`, \`always\`, or \`never\`. Defaults to \`auto\`. |
| \`--help\`, \`-h\` | Print help. |
| \`--version\` | Print the version. |

## Commands

### init

Creates \`elfie.json\`, the \`def/\` source directory, and \`elfie-compile/\`, and adds \`/elfie-compile/cache/\` to \`.gitignore\`. The project is named after the argument, or after the directory when there is none. An existing \`elfie.json\` is left alone.

\`\`\`bash
elfie init my-app
\`\`\`

### check

Loads the project and prints every problem, then the number of files, problems, and stale units. A stale unit is one whose outputs are missing or out of date.

\`\`\`bash
elfie check
elfie check --strict
elfie check --json
\`\`\`

| Option | Effect |
| --- | --- |
| \`--strict\` | Fail on any warning, error, or stale unit. Use it in CI. |

\`\`\`text title="--json output"
{"file":"def/main.lfy","message":"hello main: no output has been generated for it","severity":"warning","stage":"generation"}
\`\`\`

### format

Rewrites source files in the standard layout. With \`--check\`, it only lists the files that would change, and fails if there are any.

\`\`\`bash
elfie format
elfie format --check
\`\`\`

### tree and tokens

Print how one file parses, as a tree of rules or as a list of tokens. Use them when syntax surprises you.

\`\`\`bash
elfie tree def/main.lfy
elfie tokens def/main.lfy
\`\`\`

### compile

Plans the units that need building, then runs the compiler on each batch and the verifier on what it accepts. With unit names, it compiles those units whether they are stale or not.

\`\`\`bash
elfie compile
elfie compile main
elfie compile --dry-run
elfie compile --target hello --jobs 2
\`\`\`

| Option | Effect |
| --- | --- |
| \`--dry-run\` | Print the plan and generate nothing. |
| \`--all\` | Request every unit, up to date or not. |
| \`--target <name>\` | Only the target named. |
| \`--accept\` | Check the outputs already on disk instead of running the compiler, and record them. |
| \`--continue\` | Keep running the batches that don't depend on a stopped one. |
| \`--no-verify\` | Don't run the verifier on accepted batches. |
| \`--jobs <count>\` | How many batches run the compiler, the verifier, or a target command at once. Defaults to 4. |

\`\`\`text title="--dry-run output"
hello main fresh []
batch main [main]
\`\`\`

Each plan line gives the target, the unit, and the reason it's planned. Each batch line gives the batch and its units. When \`elfie.json\` names no compiler, \`compile\` writes each batch's request to \`elfie-requests/\` instead.

### verify

Runs the verifier on outputs that were already recorded, compiling nothing.

\`\`\`bash
elfie verify
elfie verify main --full
elfie verify --global
\`\`\`

| Option | Effect |
| --- | --- |
| \`--target <name>\` | Only the target named. |
| \`--global\` | Review only the global criteria and tests. |
| \`--full\` | Review every criterion and test again, carrying no earlier verdict. |
| \`--jobs <count>\` | How many batches run at once. Defaults to 4. |

### lsp

Serves an editor over standard input and output with the Language Server Protocol.

\`\`\`bash
elfie lsp
\`\`\`

### mcp

Serves agents over standard input and output with the Model Context Protocol. See [Compiler details](/docs/compiler-details#the-agent-server) for the tools.

\`\`\`bash
elfie mcp
\`\`\`

### help and version

\`\`\`bash
elfie help
elfie version
\`\`\`

## Exit codes

| Code | Means |
| --- | --- |
| \`0\` | Done, with nothing to report. |
| \`1\` | Done, and problems were found or outputs were rejected. |
| \`2\` | The arguments could not be read. |
| \`3\` | Something the command relies on failed, such as a compiler command that could not run. |
`;

// @lfy def/documentation/pages/cli.lfy:CliReferencePage#CliReferencePage:documentationPage:9742ce36113b09322b83a4366f23a2e841b6532e740711c264053ad7033ed57e
export const metadata: Metadata = {
  title: "CLI reference · Elfie documentation",
  description: documentationPageOf("cli")?.description.replaceAll("`", ""),
};

// @lfy def/documentation/pages/cli.lfy:CliReferencePage#CliReferencePage:page:2c42043d038ab94b5a271eb3f46ba57f4bf1db64a5c81cc7d63c60ba983b2c71
// @lfy def/documentation/pages/cli.lfy:CliReferencePage#CliReferencePage:page:7e498f85b4465a587c517900f5df35f8eccfb588bc03f62331be6036cf36d1f2
export default async function CliReferencePage() {
  // @lfy def/documentation/pages/cli.lfy:CliReferencePage#CliReferencePage:documentationArticle:20d0c006c1ce005a18a9777c0f7ff3608486116242978b094bcb4718e59c2bad
  // @lfy def/documentation/pages/cli.lfy:CliReferencePage#CliReferencePage:documentationPage:fa91d894edf1e512e320d180f5a950ff3178aa6fc05e55ce96e58b6d2f832707
  // @lfy def/documentation/pages/cli.lfy:CliReferencePage#CliReferencePage:page:f0f581c3adddedcbd2cd7360dc5eccfc92a03684edeb5d673e318ef92eff0e1b
  // @lfy def/documentation/pages/cli.lfy:CliReferencePage#CliReferencePage:page:6fc30fb3472a15a08cb00ba684dc437fa0a69257292ddf2512e95844c5cad06a
  // @lfy def/documentation/pages/cli.lfy:CliReferencePage#CliReferencePage:page:9b214c9dc59fcca1fb5bcdafc3e7ff3f93945beca1cd3a0e0d65da2c94706e34
  return (
    <DocumentationLayout
      currentSlug="cli"
      content={<Article slug="cli" source={markdown} />}
    />
  );
}
