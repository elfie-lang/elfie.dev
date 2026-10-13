import type { Metadata } from "next";

import { Article } from "@/components/documentation/article";
import { DocumentationLayout } from "@/components/documentation/layout";
import { documentationPageOf } from "@/lib/documentation/pages";

// @lfy def/documentation/pages/compiler-details.lfy:CompilerDetailsPage
const slug = "compiler-details";

// @lfy def/documentation/pages/compiler-details.lfy:CompilerDetailsPage#CompilerDetailsPage:documentationArticle:849bc562b9bc2fab33153e90692d221b6f521e621f82846fa46f70f35b3504d2
const markdown = `## The pipeline

:::flow
Load | Read elfie.json, your definitions, packages, and the standard library
Bind | Resolve names, run traits and ace code, collect criteria and tests
Plan | Find the units that need building, and group them into batches
Request | Write one request per batch: obligations, guidance, interfaces
Generate | The compiler agent writes code, runs the target's commands, and submits
Accept | Check the outputs structurally: paths, markers, every entity covered
Verify | The verifier agent judges every criterion and test
Record | Write source maps and reviews under elfie-compile
:::

\`elfie\` does every step but *Generate* and *Verify* itself, and those steps are deterministic. The two agent steps are the only places a model is involved, and both are checked by the steps after them.

## Units and batches

A **unit** is one definition file compiled for one target: \`def/main.lfy\` for \`hello\` is the unit \`main\`. A unit's name, its *stem*, is its path under \`def/\` without \`.lfy\`. A file that declares nothing to build, such as one holding only targets, traits, or global criteria, gives no unit.

Units are grouped into **batches** in plan order, by the first segment of their stem: at most six units, or 60,000 characters of source, per batch. One request goes out per batch, so guidance and interfaces are sent once.

## Why a unit is planned

| Reason | Means |
| --- | --- |
| \`requested\` | You named it, or passed \`--all\`. |
| \`fresh\` | Nothing has been generated for it yet. |
| \`changed\` | Its source differs from what its output was generated from. |
| \`requirements\` | Its criteria or tests changed, but nothing else did. |
| \`dependency\` | The interface of a unit it depends on changed. |
| \`violated\` | A global criterion or test its output answers for was reviewed as violated. |

Dependencies are compared by **interface**, meaning each entity's name, kind, description, type, parameters, and output. A change inside a dependency's criteria or body plans only that dependency, not every unit that uses it.

## Markers and source maps

The compiler marks every item it writes with a comment that names the entity it comes from, and, for code written to satisfy one criterion or test, that criterion's id.

\`\`\`ts title="apps/main/src/components/callout.tsx" caption="From this site's own source. Ids are shortened here."
// @\lfy def/components/callout.lfy:InfoImage
export const InfoImage: string = "/elfie/info.svg";

// @\lfy def/components/callout.lfy:Callout#Callout:component:dcdaadb98aeb…
export function Callout({ header, content }: CalloutProps) {
\`\`\`

A marker starts with the target language's line comment, then \`@lfy\`, the definition file, and the entity. After \`#\` comes the id of a criterion: here one that \`Callout\` received from the \`component\` trait. A marker names an entity, never a line, so markers survive edits that move lines. A **region** runs from one marker to the line before the next. When a unit is accepted, its regions are recorded in \`elfie-compile/maps/<target>/<stem>.json\`. The CLI, the language server, and the agent tools use these maps to trace between definitions and code in both directions.

## Outcomes

The compiler ends each run by submitting one of three outcomes.

| Outcome | Then |
| --- | --- |
| \`done\` | The outputs go to acceptance and review. |
| \`blocked\` | The compile stops. The reason, quoting the criterion, is written to \`elfie-requests/<batch>.blocked.md\`. |
| \`clarify\` | The compile stops. The question is written under \`elfie-requests/\` for a person to answer. |

A batch whose outputs fail acceptance, or whose review finds a violation, is sent back to the compiler once with the problems appended. A second failure stops it. With \`--continue\`, batches that don't depend on a stopped one keep going.

## Verification

The verifier is a second agent that didn't write the code. It reads each criterion and test, the regions marked for it, and, when it has to, runs the tests.

| Verdict | Means |
| --- | --- |
| \`satisfied\` | The code does what the criterion says in every situation it names. |
| \`violated\` | The verifier can point at code that does otherwise, or at missing code. |
| \`unverifiable\` | No output can be checked: no region, a stub, or a claim that can't be decided. Never rejects. |

Reviews are incremental. A verdict carries over while its entity's regions are unchanged, ignoring marker lines. \`elfie verify --full\` judges everything again. Global criteria are reviewed once for the whole program, after every merge.

## Shortcuts

- **Reworded only.** When a unit's criteria were only reworded in place, \`elfie\` moves the markers to the new ids and sends the batch straight to review, skipping the compiler.
- **Dependency only.** When every unit of a batch is planned only because a dependency changed, \`elfie\` runs the target's build and test first. If both pass, the outputs are accepted as they are.

## Running in parallel

With \`--jobs\` above 1 in a git repository, each batch runs in its own copy of the project, and a batch can start as soon as everything it depends on is accepted. Batches are merged into your working tree in dependency order, so it only ever holds reviewed work. When a batch is rejected twice, its work is kept under \`elfie-compile/cache/kept/\`, and the next compile resumes from it if nothing it was built against has changed.

## The agent server

The compiler and the verifier read your program through \`elfie\`'s agent server rather than raw files, so every answer is resolved and exact.

| Tools | For |
| --- | --- |
| \`elfie_problems\`, \`elfie_check\` | What's wrong, for a file or a unit. |
| \`elfie_find\`, \`elfie_entity\`, \`elfie_references\`, \`elfie_outline\` | Reading definitions. |
| \`elfie_grammar\` | The grammar, as EBNF. |
| \`elfie_units\`, \`elfie_request\`, \`elfie_changes\` | What is planned, and why. |
| \`elfie_output\`, \`elfie_search\`, \`elfie_source\` | Reading generated code, and tracing it back. |
| \`elfie_review\`, \`elfie_globalReview\` | The verifier's requests. |
| \`elfie_task\`, \`elfie_dependency\`, \`elfie_mark\`, \`elfie_submit\` | Compiler sessions only. |
| \`elfie_report\`, \`elfie_reportMany\` | Verifier sessions only. |
| \`elfie_build\`, \`elfie_test\`, \`elfie_lint\`, \`elfie_format\` | Running the target's commands, when it has them. |

## Language choices

:::cards
### Ambiguity is a compile error
meta: Choice · edit
A compiler that guesses produces code no one asked for. When a criterion reads two ways, the compiler stops and quotes it.

### The compiler is a command
meta: Choice · terminal
\`elfie\` embeds no model. \`elfie.json\` names any command, so you choose the agent and its harness, and can change them without changing your code.

### Criteria are never named
meta: Choice · book
Names drift and collide. A criterion is identified by an id built from what it's for, who wrote it, and what it says, and cited by file and line.

### Knowledge is vendored
meta: Choice · book
Knowledge is read from files, never fetched. Every compile reads the same text, and none depends on the network.

### Targets live in source
meta: Choice · code
A target is an \`ace const\` assembled from packages. Adding a stack never means changing the compiler.

### Markers name entities
meta: Choice · edit
Markers name the entity, not the line, so they don't drift when definitions move. Lines are derived when output is accepted.
:::
`;

// @lfy def/documentation/pages/compiler-details.lfy:CompilerDetailsPage#CompilerDetailsPage:documentationPage:fa680a6af2fffb5f8797ab440f5979e934678442ae7ee51e8750060205913acb
export const metadata: Metadata = {
  title: "Compiler details · Elfie documentation",
  description: documentationPageOf(slug)?.description.replaceAll("`", ""),
};

// @lfy def/documentation/pages/compiler-details.lfy:CompilerDetailsPage#CompilerDetailsPage:page:6fc30fb3472a15a08cb00ba684dc437fa0a69257292ddf2512e95844c5cad06a
// @lfy def/documentation/pages/compiler-details.lfy:CompilerDetailsPage#CompilerDetailsPage:page:0efca0dd3c3b3f356b343f3f16acb6a5dc5ef9a25f8d3644d549b167ae5cbb47
export default async function CompilerDetailsPage() {
  // @lfy def/documentation/pages/compiler-details.lfy:CompilerDetailsPage#CompilerDetailsPage:documentationPage:4ceb3f22d087cac11f00919a268cd895422f46cab08b573d07d4edaa62e9f119
  // @lfy def/documentation/pages/compiler-details.lfy:CompilerDetailsPage#CompilerDetailsPage:documentationArticle:68fc0e28d65350069ff8589203f3bff8f3761109081f1e1839a15a97e141a239
  return (
    <DocumentationLayout
      currentSlug={slug}
      content={<Article slug={slug} source={markdown} />}
    />
  );
}
