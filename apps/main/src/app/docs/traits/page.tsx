import type { Metadata } from "next";

import { Article } from "@/components/documentation/article";
import { DocumentationLayout } from "@/components/documentation/layout";
import { documentationPageOf } from "@/lib/documentation/pages";

// @lfy def/documentation/pages/traits.lfy:TraitsPage
const slug = "traits";

// @lfy def/documentation/pages/traits.lfy:TraitsPage#TraitsPage:documentationArticle:f2d03f23e35a174d59bea554deee0234291fb4ad84243c866f8437866bee56a3
const markdown = `## Declaring and applying

\`\`\`lfy title="def/traits.lfy"
trait timestamped: \`Records when it was made and last changed\` {
  $createdAt: \`When it was first saved\` = string;
  $updatedAt: \`When it was last saved\` = string;
  where (\`It is saved for the first time\`) -> \`[[timestamped.createdAt]] and [[timestamped.updatedAt]] are the same moment\`;
}

d Note is timestamped: \`A short note a user writes\` {
  $text: \`What the note says\` = string;
}
\`\`\`

Applying a trait with \`is\` runs its body against the entity:

- members declared with \`$\` join the entity's scope, so \`Note\` now has \`createdAt\` and \`updatedAt\`
- value setters such as \`.provides = []\` become the entity's values
- criteria and \`where\` rules join the entity's criteria, with the trait recorded as their contributor

Apply several traits with commas: \`d Note is audited, owned(User)\`.

## Parameters

\`\`\`lfy title="def/traits.lfy"
/// owner: the data that owns it
trait owned(owner: Data): \`Belongs to exactly one [[&owner]]\` {
  $ownerId: \`The id of its owner\` = string;
  where (\`Its owner is deleted\`) -> \`It is deleted with it\`;
}
\`\`\`

Arguments are evaluated when the trait is applied. Use parameters in members, setters, \`where\` rules, or criteria. A parameter that appears only in a description is a defect, because nothing checks it. \`[[&owner]]\` refers to the entity passed in, so \`owned(User)\` reads *Belongs to exactly one User*.

Passing too many or too few arguments is reported at the application.

## Inheritance

\`\`\`lfy title="def/traits.lfy"
trait persisted: \`Kept in the store and read back unchanged\` {
  where (\`An entity carrying it is written\`) -> \`Reading it back gives an equal value\`;
}

trait audited extends persisted, timestamped: \`Every change to it is recorded\` {
  where (\`It changes\`) -> \`One audit record names {{@identifier}} and what changed\`;
}
\`\`\`

Applying \`audited\` applies \`persisted\` and \`timestamped\` first, up the whole chain. A trait reached more than once for one entity, through several paths with equal arguments, is applied once.

## Rules for other entities

A \`with\` block inside a trait attaches its criteria to another entity, once for each entity the trait is applied to:

\`\`\`lfy title="def/site.lfy"
trait slugged: \`Reachable at a URL friendly slug\` {
  with Page {
    where (\`A [[Page]] is built for {{@identifier}}\`) -> \`Its path ends in a slug of the title\`;
  }
}
\`\`\`

## Applying from outside

\`apply\` puts a trait on an entity, a list of entities, the current file, or the whole program.

\`\`\`lfy
timestamped.apply(Draft);
timestamped.apply([Draft, Note]);
persisted.apply(@);
logged.apply(global);
\`\`\`

At the top level of a file, \`@\` is the file itself, so \`persisted.apply(@)\` applies the trait to every entity the file declares. \`global\` stands for every entity of every file. See [Global properties](/docs/global-properties).

## Looking traits up

| Expression | Gives |
| --- | --- |
| \`persisted@entities\` | Everything the trait was applied to, directly or by inheritance. |
| \`persisted@extenders\` | Every trait that extends it. |
| \`Note@traits\` | Every trait applied to \`Note\`, in application order. |

## Traits as types

\`(is trait)\` is the type of any value whose type carries the trait.

\`\`\`lfy title="def/cards.lfy"
/// content: what the card shows
fn Card(content: (is persisted)): \`Shows one stored thing\` => string {
  @acceptanceCriteria.add({ behavior = \`Shows every member of [[content]]\` });
}
\`\`\`

This site uses the same pattern: \`fn Button(content: (is component))\` takes any React component.

## Traits from packages

Packages connect your code to a target through traits. A framework in your target says how each one is built.

| Trait | Package | Makes an fn into |
| --- | --- | --- |
| \`page(path)\` | \`http\` | A page at a URL. |
| \`endpoint(method, path)\` | \`http\` | One operation of a JSON API. |
| \`component\` | \`react\` | A React component. |
| \`command(name)\` | \`cli\` | A subcommand, or the program itself when \`name\` is empty. |

\`\`\`lfy title="def/documentation/main.lfy"
fn Documentation() is page('/docs'), documentationPage {}
\`\`\`

## Naming

| Do | Don't |
| --- | --- |
| Name traits so \`X is trait\` reads as a property: \`persisted\`, \`owned(User)\`, \`triedBefore(other)\`. | Name traits as verbs or commands: \`persists\`, \`binds\`, \`uses\`. |
| Make marker traits parameterless. | Add a parameter that every application passes the same value to. |
| Apply a trait once per entity. | Apply the same trait twice to one entity. |

:::callout info builtin
\`builtin\` is the trait the standard library puts on native things. A \`builtin\` data is the target's own type, and a \`builtin\` function is the target's own function, so the compiler generates no body for it. You won't need it in your own code.
:::
`;

// @lfy def/documentation/pages/traits.lfy:TraitsPage#TraitsPage:documentationPage:58e83c22b5eb1ce25a8579129f4fc4fd2d5dc5680d324a4432d50de677216a94
export const metadata: Metadata = {
  title: "Traits · Elfie documentation",
  description: documentationPageOf(slug)?.description.replaceAll("`", ""),
};

// @lfy def/documentation/pages/traits.lfy:TraitsPage#TraitsPage:page:6fc30fb3472a15a08cb00ba684dc437fa0a69257292ddf2512e95844c5cad06a
// @lfy def/documentation/pages/traits.lfy:TraitsPage#TraitsPage:page:82b23a83e82a2f05d1a71cc8add9d3a294920727dc22e31acc17c94b3c8139e6
export default async function TraitsPage() {
  // @lfy def/documentation/pages/traits.lfy:TraitsPage#TraitsPage:documentationPage:cd8115343e241cd19d7110ba980500439075d4f2d688fe0f66b975aff14dbcb4
  // @lfy def/documentation/pages/traits.lfy:TraitsPage#TraitsPage:documentationArticle:6a114a2f7d4598fa3aabfd34f597639b9553f34e463573e06fa3ee276c92cf60
  return (
    <DocumentationLayout
      currentSlug={slug}
      content={<Article slug={slug} source={markdown} />}
    />
  );
}
