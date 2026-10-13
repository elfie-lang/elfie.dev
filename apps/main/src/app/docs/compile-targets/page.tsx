import type { Metadata } from "next";

import { Article } from "@/components/documentation/article";
import { DocumentationLayout } from "@/components/documentation/layout";
import { documentationPageOf } from "@/lib/documentation/pages";

// @lfy def/documentation/pages/compile-targets.lfy:CompileTargetsPage#CompileTargetsPage:documentationArticle:20994f63c3bafa7ef6b54c4eabdef7839a0f533e41894028b6b6e1cc0969094e
const markdown = `## Declaring a target

A target is an \`ace const\` whose value is a \`Target\`. The const's name is the target's identifier, and the CLI, the maps folder, and the agent tools all use it.

\`\`\`lfy title="def/targets.lfy"
use "elfie/target";
use "cli";
use "platforms";
use "python" as Python;

ace const hello: \`A greeting on the command line\` = targetOf({
  output = "out/hello",
  language = Python.python,
  runtime = Python.cpython.layer("3.12"),
  platforms = [posix],
  ecosystem = Python.uv,
  frameworks = [Python.argparse],
  interfaces = [commandLine],
  layout = Python.uvScript.layer("hello.py"),
});

global@targets.add(hello);
\`\`\`

\`targetOf\` gives a record written in braces the type \`Target\`. A trait that takes arguments goes in a slot as a layer: \`Python.cpython.layer("3.12")\`.

## Slots

| Slot | How many | What it says | Examples |
| --- | --- | --- | --- |
| \`output\` | 1 | The directory everything is written under. | \`"out/hello"\` |
| \`language\` | 1 | What the code is written in. | \`typescript\`, \`python\`, \`rust\` |
| \`runtime\` | 0–1 | What runs the code, when the platform doesn't. | \`bun\`, \`node\`, \`cpython("3.12")\` |
| \`platforms\` | any | Where the code runs. | \`posix\`, \`windows\`, \`browser\` |
| \`ecosystem\` | 0–1 | Where dependencies come from. | \`bunPackages\`, \`npm\`, \`uv\`, \`cargo\` |
| \`frameworks\` | any | What the code is built on. | \`react\`, \`nextjs(root)\`, \`argparse\`, \`clap\` |
| \`interfaces\` | any | What it offers people and programs. | \`website\`, \`restApi\`, \`commandLine\` |
| \`layout\` | 1 | Where each unit's files go. | \`npmLayout\`, \`uvScript\`, \`cargoWorkspace\` |
| \`layers\` | any | Anything else, such as a house style. | Your own layers |
| \`dependencies\` | any | Packages the generated code needs. | \`{ name = "zod", version = "^4" }\` |

A layer in the wrong slot is reported at the const. Dependencies need an ecosystem.

## Presets

Packages can offer an \`ace function\` that fills in the slots for you. This site is built with the Next.js preset:

\`\`\`lfy title="def/targets.lfy"
use "bun";
use "nextjs" as NextJS;

ace const mainApp: \`Elfie.dev main app\` = NextJS.app({
  root = \`apps/main\`,
  runtime = bun,
  ecosystem = bunPackages,
});

global@targets.add(mainApp);
\`\`\`

\`NextJS.app\` sets the language to TypeScript, the platforms to POSIX and browsers, the frameworks to Next.js and React, and the interfaces to a website and a REST API. It also adds \`next\`, \`react\`, \`react-dom\`, and \`zod\` as dependencies.

## Choosing what gets built

Each entity is built for the targets in its own \`@targets\`. If that list is empty, it uses its file's list, and if that's empty too, it uses \`global\`'s.

\`\`\`lfy
global@targets.add(mainApp);
\`\`\`

\`\`\`lfy title="def/tools/cleanup.lfy"
@targets.add(tools);
\`\`\`

\`\`\`lfy
cleanup@targets.add(tools);
\`\`\`

Traits, \`ace\` declarations, and anything declared in a package are never built. A member, a parameter, or an enum member is built with its owner.

## Rules for one target

Criteria on a target const are guidance for every unit built for it:

\`\`\`lfy title="def/targets.lfy"
mainApp
  @acceptanceCriteria
  .add({ behavior = \`Favicon is [[favicon]]\` });
\`\`\`

:::callout warning Guidance isn't reviewed
A target's criteria, and those of its layers, are rules the compiler follows for every unit. No unit answers for them and the verifier doesn't review them. When something must be checked, put it on an entity, or in \`global\`'s criteria.
:::

## Capabilities

Layers say what they provide and what they require, as plain strings. \`elfie check\` reports a requirement that no layer of the target provides.

| Layer | Provides | Requires |
| --- | --- | --- |
| \`bun\` | \`javascript-runtime\`, \`node-api\` | \`javascript-language\` |
| \`nextjs(root)\` | \`http-server\`, \`html-pages\`, \`css-modules\` | \`react\`, \`node-api\`, \`npm-registry\`, \`browser\` |
| \`commandLine\` | | \`process\`, \`argument-parser\` |
| \`argparse\` | \`argument-parser\` | \`python\` |

That's why the greeter above lists \`argparse\`: \`commandLine\` needs an argument parser.

## Commands

Layers name a shell command for each operation they support: install, add, build, test, lint, format, and run. The compiler runs the build, test, and lint commands, and they must pass with no warnings before the work is accepted. The \`uv\` layer, for example, tests with \`uv run --with pytest pytest\` and lints with \`uvx ruff check . && uvx pyright\`. See [Custom compile targets](/docs/custom-compile-targets) to write your own.

## Several targets

A project can declare any number of targets. Each needs its own \`output\` directory, and no output may sit inside another's. Pass \`--target name\` to \`elfie compile\` or \`elfie verify\` to work on one.

## Bundled packages

| Package | Layers and traits |
| --- | --- |
| \`typescript\` | \`typescript\`, \`npmLayout(name, root)\` |
| \`python\` | \`python\`, \`cpython(version)\`, \`uv\`, \`uvScript(file)\`, \`uvProject(name, root)\`, \`argparse\` |
| \`rust\` | \`rust\`, \`cargo\`, \`cargoCrate(...)\`, \`cargoWorkspace(...)\`, \`clap\` |
| \`lfy\` | \`elfie\`, \`lfyPackage(root)\`, for targets whose output is Elfie |
| \`bun\` | \`bun\`, \`bunPackages\` |
| \`node\` | \`node\` |
| \`npm\` | \`npm\`, \`pnpm\`, \`yarn\` |
| \`react\` | \`react\`, \`component\` |
| \`nextjs\` | \`nextjs(root)\`, \`app(settings)\` |
| \`http\` | \`website\`, \`restApi\`, \`page(path)\`, \`endpoint(method, path)\` |
| \`cli\` | \`commandLine\`, \`command(name)\` |
| \`platforms\` | \`posix\`, \`windows\`, \`browser\` |
`;

// @lfy def/documentation/pages/compile-targets.lfy:CompileTargetsPage#CompileTargetsPage:documentationPage:bace31beb6af5546674f3a5f4948ad33362e5d58eef88b168475d98efc96d4eb
export const metadata: Metadata = {
  title: "Compile targets · Elfie documentation",
  description: documentationPageOf("compile-targets")?.description.replaceAll("`", ""),
};

// @lfy def/documentation/pages/compile-targets.lfy:CompileTargetsPage#CompileTargetsPage:page:301cd2eb456e2011a9b103ef1ac3e0e420c73fa17c7eb9b9a5fdd3616e729764
// @lfy def/documentation/pages/compile-targets.lfy:CompileTargetsPage#CompileTargetsPage:page:51caf736a037cbb7178d84ddb35dd38bfca6b7a2fb7515d4b12f99b901fe8d81
export default async function CompileTargetsPage() {
  // @lfy def/documentation/pages/compile-targets.lfy:CompileTargetsPage#CompileTargetsPage:documentationArticle:91f670fcdb943eb50b2fada2d778b74e0ffaff13ecdec0ae86a70334d8795d53
  // @lfy def/documentation/pages/compile-targets.lfy:CompileTargetsPage#CompileTargetsPage:documentationPage:af1e1ec16b33193813041026b4dd535e3ee495583dc72075e6892b14ae46c9c7
  // @lfy def/documentation/pages/compile-targets.lfy:CompileTargetsPage#CompileTargetsPage:page:f0f581c3adddedcbd2cd7360dc5eccfc92a03684edeb5d673e318ef92eff0e1b
  // @lfy def/documentation/pages/compile-targets.lfy:CompileTargetsPage#CompileTargetsPage:page:6fc30fb3472a15a08cb00ba684dc437fa0a69257292ddf2512e95844c5cad06a
  // @lfy def/documentation/pages/compile-targets.lfy:CompileTargetsPage#CompileTargetsPage:page:9b214c9dc59fcca1fb5bcdafc3e7ff3f93945beca1cd3a0e0d65da2c94706e34
  return (
    <DocumentationLayout
      currentSlug="compile-targets"
      content={<Article slug="compile-targets" source={markdown} />}
    />
  );
}
