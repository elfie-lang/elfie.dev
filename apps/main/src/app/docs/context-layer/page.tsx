import type { Metadata } from "next";

import { Article } from "@/components/documentation/article";
import { DocumentationLayout } from "@/components/documentation/layout";

// @lfy def/documentation/pages/context-layer.lfy:ContextLayerPage#ContextLayerPage:documentationArticle:9e665534f006b5f3b53b9f8c69c45c58c5d008160ffc29ff67a7d4523042185f
const markdown = `## Three layers

Every entity has three layers, and each one has its own accessor.

| Layer | Accessor | Holds | Example |
| --- | --- | --- | --- |
| Value | \`.\` | What the entity is at run time. | \`order.status\` |
| Context | \`@\` | What the compiler knows about it: description, type, criteria, tests. | \`Order@acceptanceCriteria\` |
| Scope | \`$\` | The members it declares, as entities of their own. | \`Order$status\` |

The value layer works like it does in other languages. The scope layer is covered in [Scope management](/docs/scope-management). This page is about the context layer, the one most languages don't have.

Take \`const x = 2;\`. The value of \`x\` is \`2\`, and \`x@type\` is \`number\`. In a \`fn\`, the context layer holds nearly everything: a \`fn\` has no body for you to write, only context for the compiler to satisfy.

## Descriptions

A description in backticks after a colon becomes the entity's \`@definition\`. You can describe data, functions, traits, types, enums, members, and variables.

\`\`\`lfy title="def/library.lfy"
d Book: \`A book in the library\` {
  $title: \`The title on the cover\` = string;
  $pages: \`How many pages it has\` = number;
}
\`\`\`

Write descriptions as plain facts that someone could check: what a thing is, what it holds, and what it returns. The compiler treats them as part of the specification.

:::callout tip Describe what can be observed
"The price of one item, in whole cents" says more than "Price". It names the unit and rules out fractions, so the generated code and the tests agree.
:::

## Reading context

\`Name@member\` reads one part of an entity's context. Inside a declaration's body, \`@\` on its own is the entity being declared.

\`\`\`lfy title="def/library.lfy"
/// book: the book to summarize
fn summary(book: Book): \`A one line summary of [[book]]\` => string {
  @acceptanceCriteria
    .add({ behavior = \`Begins with [[Book.title]]\` })
    .add({ behavior = \`Ends with the page count, such as 312 pages\` });
  @test({ input = [{ title = "Dune", pages = 412 }], expect = "Dune, 412 pages" });
}

const bookName = Book@identifier;
const titleType = Book$title@type;
const summaryInputs = summary@parameters;
const generated = summary@agentic;
\`\`\`

| Member | What it holds |
| --- | --- |
| \`@identifier\` | The declared name. |
| \`@definition\` | The description. |
| \`@type\` | The declared or inferred type. |
| \`@acceptanceCriteria\` | Its own criteria, then those of each trait, in order. |
| \`@tests\` | Every test added. |
| \`@traits\` | Every trait applied to it, directly or inherited. |
| \`@references\` | Every entity its description, documentation, or value refers to. |
| \`@knowledge\` | What the compiler is given to read for it. |
| \`@commands\` | Shell commands for operations such as build and test. |
| \`@targets\` | The targets it is built for. |

Functions add \`@parameters\`, \`@output\`, and \`@agentic\`. Traits add \`@entities\` and \`@extenders\`. The [Context API](/docs/context-api) lists every member for every kind of entity.

## Writing context

You add to the context layer with calls that read like method calls but run while the program is compiled.

| Call | Adds |
| --- | --- |
| \`@acceptanceCriteria.add({ ... })\` | One acceptance criterion. |
| \`@test({ input, expect }, ...)\` | One or more test cases. |
| \`@knowledge.add({ topic, kind, source })\` | Reading material for the compiler. |
| \`@commands.add({ operation, line })\` | A shell command for one operation. |
| \`@targets.add(target)\` | A target to build the entity for. |

Each \`add\` returns the list, so calls chain. To add context to an entity from outside its body, start with its name:

\`\`\`lfy title="def/targets.lfy"
mainApp
  @acceptanceCriteria
  .add({ behavior = \`Favicon is [[favicon]]\` });
\`\`\`

## References

A template, a description, or a documentation line can refer to anything in scope with \`[[...]]\`.

| Reference | Refers to |
| --- | --- |
| \`[[Order]]\` | A declared entity. |
| \`[[Order.status]]\` | A member of an entity. |
| \`[[items]]\` | A parameter of the current \`fn\` or trait. |
| \`[[.]]\` | The current entity, such as the entity a trait is applied to. |
| \`[[&owner]]\` | The entity a parameter is bound to, rather than its value. |

References are checked: \`elfie check\` reports one that resolves to nothing. They also connect your definitions, so \`@references\`, find references in your editor, and the planner all see them. To write double brackets as plain text, escape them: \`\\[[\`.

## Executions

\`{{expression}}\` evaluates an expression while the program is compiled and writes its value into the text.

\`\`\`lfy title="def/traits.lfy"
trait audited: \`Every change to it is recorded\` {
  where (\`It changes\`) -> \`One audit record names {{@identifier}} and what changed\`;
}
\`\`\`

In a trait, \`{{@identifier}}\` is the name of the entity the trait is applied to. Parameters work too: a trait \`endpoint(method, path)\` can say \`It answers {{method}} {{path}}\`. See [At Compile Execution (ace)](/docs/ace).

## Values only the compiler chooses

\`Type@like(prompt)\` stands for any value of a type that a prompt describes. You use it in tests, where writing out a full value would be noise.

\`\`\`lfy
@test({ input = [string@like(\`text with no number in it\`)], expect = undefined });
\`\`\`

The compiler chooses the value. Generated code never calls \`like\`. See [Tests & documentation](/docs/tests-and-documentation).

:::callout info Context is part of the contract
Changing a description, a criterion, or a test changes what a unit must satisfy, so the unit is planned again. A criterion whose wording changes gets a new id, and the verifier reviews it again. A \`//\` comment changes nothing.
:::
`;

// @lfy def/documentation/pages/context-layer.lfy:ContextLayerPage#ContextLayerPage:documentationPage:c67bba916dbfdac224bd8db9878c9134d5189a004d9c76dae5b5828bd558de42
export const metadata: Metadata = {
  title: "Context layer · Elfie documentation",
  description: "The Context layer page of the documentation",
};

// @lfy def/documentation/pages/context-layer.lfy:ContextLayerPage#ContextLayerPage:page:a0cee54dc585cfaf5faa5f0837d2d3a2015da3bfe49b197947cbe5531af55009
export default async function ContextLayerPage() {
  // @lfy def/documentation/pages/context-layer.lfy:ContextLayerPage#ContextLayerPage:documentationArticle:2b3ce126822f989c8bf007088f29c5d61cef4e088c3bb3744e0cd72ea7922834
  // @lfy def/documentation/pages/context-layer.lfy:ContextLayerPage#ContextLayerPage:documentationPage:0560e0fdecab875ca8d6ee52ed4930cac9b15b47432fb615e9058956bb2f2660
  // @lfy def/documentation/pages/context-layer.lfy:ContextLayerPage#ContextLayerPage:page:f0f581c3adddedcbd2cd7360dc5eccfc92a03684edeb5d673e318ef92eff0e1b
  // @lfy def/documentation/pages/context-layer.lfy:ContextLayerPage#ContextLayerPage:page:6fc30fb3472a15a08cb00ba684dc437fa0a69257292ddf2512e95844c5cad06a
  return (
    <DocumentationLayout
      currentSlug="context-layer"
      content={<Article slug="context-layer" source={markdown} />}
    />
  );
}
