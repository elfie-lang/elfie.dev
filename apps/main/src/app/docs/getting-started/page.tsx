import type { Metadata } from "next";

import { Article } from "@/components/documentation/article";
import { DocumentationLayout } from "@/components/documentation/layout";

// @lfy def/documentation/pages/getting-started.lfy:GettingStartedPage#GettingStartedPage:documentationArticle:fb26f71669f88cf00b7f94fb1f7057a2e896e7f7f4306fb2211eace17c6ff0ec
const markdown = `## What you're setting up

Elfie treats a language model as a compiler. You write definitions: what each piece of your program is, what it must do, and how to test it. A compiler agent writes code in your target language that satisfies them, and a second agent checks that it did.

The \`elfie\` command handles everything that must be exact. It parses and checks your definitions, plans what needs to be built, hands each piece to the compiler, accepts the result, and records what was built from what. It does not contain a model. You choose the agent that writes code and name it in your project's configuration.

:::flow
Definitions | Your .lfy files
elfie | Checks them and plans the work
Compiler agent | Writes code that satisfies the criteria
elfie | Accepts the output and maps it back to the source
Verifier agent | Reviews each criterion against the code
Output | Generated code, tested and reviewed
:::

## Install the CLI

:::steps
### Download a release
Download the \`elfie\` binary for your platform from the [releases page](https://github.com/elfie-lang/elfie/releases). Builds are published for Linux, macOS, and Windows.

### Put it on your PATH
Move the binary into a directory on your \`PATH\`, such as \`~/.local/bin\` or \`/usr/local/bin\`.

### Check that it runs
\`\`\`bash title="Terminal"
elfie version
\`\`\`
\`\`\`text title="Output"
elfie 0.1.0
\`\`\`
:::

## Create a project

Run \`elfie init\` in an empty directory. Give it a name, or leave the name out to use the directory's name.

\`\`\`bash title="Terminal"
mkdir hello && cd hello
elfie init hello
\`\`\`

\`\`\`text title="Output"
created /home/you/hello/elfie.json
\`\`\`

\`init\` creates these files:

| Path | What it is |
| --- | --- |
| \`elfie.json\` | The project manifest. It starts with only the project's name. |
| \`def/\` | Where your definitions live. Every \`.lfy\` file under it is part of the program. |
| \`elfie-compile/\` | Data the compiler records: source maps and reviews. Check it in. |
| \`.gitignore\` | Gets the line \`/elfie-compile/cache/\`, the one part of \`elfie-compile/\` that is scratch space. |

## Connect a compiler

\`elfie compile\` runs the command that \`elfie.json\` names under \`compiler\`, once for each batch of work, with the request on standard input. The command can be any agent that can read that request, edit files, and run commands. A second command, under \`verifier\`, reviews the result.

\`\`\`json title="elfie.json"
{
  "name": "hello",
  "compiler": "scripts/compile.sh",
  "verifier": "scripts/verify.sh"
}
\`\`\`

Here is a minimal compiler script that uses Claude Code:

\`\`\`bash title="scripts/compile.sh"
#!/usr/bin/env bash
# Run by elfie compile once per batch, with the request on standard input.
set -e
exec claude -p \\
  --permission-mode acceptEdits \\
  --mcp-config .mcp.json \\
  --append-system-prompt "$(cat scripts/compiler-prompt.md)"
\`\`\`

:::callout tip No compiler yet?
Without a \`compiler\` key, \`elfie compile\` writes each batch's request to \`elfie-requests/\`, one file per batch. You can hand that file to an agent yourself, then record its work with \`elfie compile --accept\`.
:::

Starter compiler and verifier scripts, with the prompts that go with them, are in the [Elfie repository](https://github.com/elfie-lang/elfie). Copy them into \`scripts/\` and adjust them to your agent.

The [Configuration](/docs/configuration) page lists the environment variables the compiler receives. [Compiler details](/docs/compiler-details) describes what the request contains and what the compiler must do with it.

## Add packages

Targets, frameworks, and platforms come from packages. A package is a directory of \`.lfy\` files, and you list it in \`elfie.json\` under \`dependencies\` with the path to its root.

\`\`\`json title="elfie.json"
{
  "name": "hello",
  "compiler": "scripts/compile.sh",
  "verifier": "scripts/verify.sh",
  "dependencies": {
    "cli": { "root": "vendor/cli" },
    "platforms": { "root": "vendor/platforms" },
    "python": { "root": "vendor/python" }
  }
}
\`\`\`

Packages are available for TypeScript, Python, Rust, Bun, Node.js, npm, React, Next.js, HTTP, command lines, and platforms. Put the ones you need in \`vendor/\`, and list each one in \`elfie.json\`. The standard library, the package named \`elfie\`, is always loaded, so you never list it.

## Set up your editor and agents

\`elfie lsp\` is a language server. Editors that speak the Language Server Protocol get diagnostics, hover, go to definition, symbols, completion, semantic highlighting, and formatting. A Visual Studio Code extension lives in the repository under \`editors/vscode\`.

\`elfie mcp\` is an agent server: it gives agents tools to look up entities, references, problems, and generated code. Register it for Claude Code and other MCP clients in \`.mcp.json\`:

\`\`\`json title=".mcp.json"
{
  "mcpServers": {
    "elfie": { "command": "elfie", "args": ["mcp"] }
  }
}
\`\`\`

## Project layout

\`\`\`text title="A project after its first compile"
hello/
├── elfie.json          project manifest
├── def/                your definitions
├── vendor/             packages you depend on
├── elfie-compile/
│   ├── maps/           source maps, one file per unit
│   ├── reviews/        the verifier's verdicts
│   └── cache/          scratch space, ignored by git
├── elfie-requests/     compile log, and files for blocked work and questions
└── out/                generated code, wherever your target puts it
\`\`\`

:::cards
### Your first program
meta: Next · code
Write a small command-line program, compile it, and change it.
[Start building](/docs/your-first-program)

### Familiar concepts
meta: Language guide · book
Skim the parts of Elfie that work like the languages you already know.
[Read the language guide](/docs/familiar-concepts)
:::
`;

// @lfy def/documentation/pages/getting-started.lfy:GettingStartedPage#GettingStartedPage:documentationPage:b12e752cc415eb5332b785efd04b26d4cdf891830121077fd16ffa56cf9d44c7
export const metadata: Metadata = {
  title: "Getting started · Elfie documentation",
  description: "The Getting started page of the documentation",
};

// @lfy def/documentation/pages/getting-started.lfy:GettingStartedPage#GettingStartedPage:page:5c02f254dd9ee62fd8cd811a024bd29777b2a86878d9b6f4d03cc4f61da1c8a0
export default async function GettingStartedPage() {
  // @lfy def/documentation/pages/getting-started.lfy:GettingStartedPage#GettingStartedPage:documentationArticle:02bc7340b83c048a5515205607bc37d625e9f24b2a58d94b9c3d11116cb39eff
  // @lfy def/documentation/pages/getting-started.lfy:GettingStartedPage#GettingStartedPage:documentationPage:5508b8284c897385c88e847845aec57d4a1248f6c866fe3e047dcf725f995ac2
  // @lfy def/documentation/pages/getting-started.lfy:GettingStartedPage#GettingStartedPage:page:f0f581c3adddedcbd2cd7360dc5eccfc92a03684edeb5d673e318ef92eff0e1b
  // @lfy def/documentation/pages/getting-started.lfy:GettingStartedPage#GettingStartedPage:page:6fc30fb3472a15a08cb00ba684dc437fa0a69257292ddf2512e95844c5cad06a
  return (
    <DocumentationLayout
      currentSlug="getting-started"
      content={<Article slug="getting-started" source={markdown} />}
    />
  );
}
