import type { Metadata } from "next";

import { Article } from "@/components/documentation/article";
import { DocumentationLayout } from "@/components/documentation/layout";

// @lfy def/documentation/pages/context-api.lfy:ContextApiPage#ContextApiPage:documentationArticle:ab5115b986655c5b84cde2e3a46dfd2ab414a39a17ada3c4805eb1e31fe74cf0
const markdown = `\`Name@member\` reads a member. Inside a declaration's body, \`@member\` reads the current entity's. \`@\` alone is the entity itself.

## Every entity

| Member | Type | Holds |
| --- | --- | --- |
| \`identifier\` | \`string \\| undefined\` | The declared name. Undefined when anonymous. |
| \`definition\` | \`string \\| undefined\` | The description. |
| \`type\` | \`Entity \\| undefined\` | The declared or inferred type. For a data, trait, type, or enum, the entity itself. |
| \`typeParameters\` | \`Entity[]\` | The type parameters it declares, in order. |
| \`typeArguments\` | \`Entity[]\` | The arguments a generic type was written with. |
| \`itemType\` | \`Entity \\| undefined\` | What a list-typed entity holds. |
| \`acceptanceCriteria\` | \`Criterion[]\` | Its own criteria, then each trait's, in application order. |
| \`tests\` | \`Test[]\` | Every test added, in order. |
| \`traits\` | \`Entity[]\` | Every trait applied, directly or inherited, in application order. |
| \`references\` | \`Entity[]\` | Every entity referred to with \`[[...]]\` in its description, documentation, or value. |
| \`knowledge\` | \`Knowledge[]\` | Its own items, then each trait's. |
| \`commands\` | \`Command[]\` | Shell commands for its operations. |
| \`targets\` | \`Entity[]\` | The target consts added to it. |

| Call | Does |
| --- | --- |
| \`@acceptanceCriteria.add(criterion)\` | Appends a criterion. Returns the list, so calls chain. |
| \`@test(...tests)\` | Appends test cases. Returns the entity. |
| \`@knowledge.add(item)\` | Appends a knowledge item. |
| \`@commands.add(command)\` | Appends a command. |
| \`@targets.add(target)\` | Appends a target const. Adding one twice, or adding to a member, a parameter, or an enum member, is a problem. |
| \`Type@like(prompt)\` | A value of the type that the prompt describes, chosen by the compiler. |

## Functions

Applies to \`fn\` and \`function\`.

| Member | Type | Holds |
| --- | --- | --- |
| \`parameters\` | \`Parameter[]\` | Its parameters, in order. |
| \`output\` | \`Entity\` | The type after the arrow, or the inferred type of what it returns. |
| \`agentic\` | \`boolean\` | \`true\` for a \`fn\`, whose body is generated, and \`false\` for a \`function\`. |

## Traits

| Member | Type | Holds |
| --- | --- | --- |
| \`entities\` | \`Entity[]\` | Everything the trait was applied to, directly or by inheritance. |
| \`extenders\` | \`Trait[]\` | Every trait that names it in \`extends\`. |
| \`apply(target, ...arguments)\` | \`Trait\` | Applies the trait to an entity or a list of entities, and returns the trait. |
| \`layer(...arguments)\` | \`Layer\` | The trait with arguments, for a target's slot. Applies it to nothing. |

## Other kinds

| Kind | Member | Type | Holds |
| --- | --- | --- | --- |
| Enum | \`members\` | \`Entity[]\` | Its named values, in order. |
| Member | \`owner\` | \`Entity\` | The entity that declares it. |
| Parameter | \`optional\` | \`boolean\` | Whether a call may leave it out. |
| Parameter | \`defaultValue\` | \`Entity \\| undefined\` | What it takes when left out. |
| Parameter | \`spread\` | \`boolean\` | Whether it takes the rest of the arguments. |
| Module | \`entities\` | \`Entity[]\` | Every entity its file declares. |

Data (\`d\`), types, and variables have only the members every entity has.

## Criterion

| Field | Type | Holds |
| --- | --- | --- |
| \`situation\` | \`string \\| string[] \\| undefined\` | When it applies. A list must all hold. Undefined means always. |
| \`behavior\` | \`string \\| string[] \\| undefined\` | What must happen. |
| \`sideEffects\` | \`string[] \\| undefined\` | What is written outside the value. |
| \`contributor\` | \`object\` | The entity whose body holds it: the entity itself, or one of its traits. |

A \`where\` statement adds a criterion too. Its conditions are the situation, and the text after \`->\` is the behavior.

## Test

| Field | Holds |
| --- | --- |
| \`input\` | For a function, the argument list. Otherwise, a value. |
| \`expect\` | For a function, what the call returns. Otherwise, a value. |

## Knowledge

| Field | Type | Holds |
| --- | --- | --- |
| \`topic\` | \`string\` | What it teaches, in a few words. |
| \`kind\` | \`KnowledgeKind\` | \`reference\`, \`example\`, \`definition\`, or \`tool\`. |
| \`source\` | \`string\` | A path relative to the declaring package or project, a \`use\` path, or a tool's name. |
| \`quote\` | \`boolean \\| undefined\` | Whether requests quote it in full. |

## Command

| Field | Type | Holds |
| --- | --- | --- |
| \`operation\` | \`Operation\` | \`install\`, \`add\`, \`build\`, \`test\`, \`lint\`, \`format\`, or \`run\`. |
| \`line\` | \`string \\| undefined\` | What \`sh -c\` runs in the target's output directory. Undefined turns the operation off. |
`;

// @lfy def/documentation/pages/context-api.lfy:ContextApiPage#ContextApiPage:documentationPage:781eec0f6f1829c8eec2be02a8c12039e6ea342caaa012fba836c306a6947ad5
export const metadata: Metadata = {
  title: "Context API · Elfie documentation",
  description: "The Context API page of the documentation",
};

// @lfy def/documentation/pages/context-api.lfy:ContextApiPage#ContextApiPage:page:262e7dba49d7c9e13e7484f9c60733a24d769e73fec8ed75b9ffbce8552ff488
export default async function ContextApiPage() {
  // @lfy def/documentation/pages/context-api.lfy:ContextApiPage#ContextApiPage:documentationArticle:10b7bd28f2616fbf27104c15d81745d67c402923f4ef4f2e336279fe6c1feb36
  // @lfy def/documentation/pages/context-api.lfy:ContextApiPage#ContextApiPage:documentationPage:b5d7e93315026e3a61ba8074f287aea08f6fc8289936e5c4172c8b7068c6f7b4
  // @lfy def/documentation/pages/context-api.lfy:ContextApiPage#ContextApiPage:page:f0f581c3adddedcbd2cd7360dc5eccfc92a03684edeb5d673e318ef92eff0e1b
  // @lfy def/documentation/pages/context-api.lfy:ContextApiPage#ContextApiPage:page:6fc30fb3472a15a08cb00ba684dc437fa0a69257292ddf2512e95844c5cad06a
  return (
    <DocumentationLayout
      currentSlug="context-api"
      content={<Article slug="context-api" source={markdown} />}
    />
  );
}
