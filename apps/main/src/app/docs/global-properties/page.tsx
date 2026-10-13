import type { Metadata } from "next";

import { Article } from "@/components/documentation/article";
import { DocumentationLayout } from "@/components/documentation/layout";
import { documentationPageOf } from "@/lib/documentation/pages";

// @lfy def/documentation/pages/global-properties.lfy:GlobalPropertiesPage
const slug = "global-properties";

// @lfy def/documentation/pages/global-properties.lfy:GlobalPropertiesPage#GlobalPropertiesPage:documentationArticle:ba27a69551db43c766420c5e1a0227d5102b668d883b538bd37931f6379c54d1
const markdown = `## At a glance

| Statement | Effect |
| --- | --- |
| \`global@targets.add(t);\` | Build every entity for \`t\`, unless its file or the entity names its own targets. |
| \`global@acceptanceCriteria.add({ ... });\` | Add a requirement the whole program must meet, reviewed once. |
| \`trait.apply(global);\` | Apply a trait to every entity of every file. |

## Targets

\`\`\`lfy title="def/targets.lfy"
global@targets.add(mainApp);
\`\`\`

An entity is built for its own \`@targets\`. If that list is empty, it uses its file's list, and if that's empty too, it uses \`global\`'s. Most projects with one target add it to \`global\` and never think about it again.

## Global criteria

\`\`\`lfy title="def/rules.lfy"
global
  @acceptanceCriteria
  .add({ behavior = \`No output writes a secret to a log\` })
  .add({ behavior = \`Every user facing message is in plain English\` });
\`\`\`

A global criterion is a requirement of the whole program. Every unit's request includes it, and the verifier reviews it once, against the whole output, in a **global review** that runs after the batches are merged. A global criterion reviewed as violated plans the units whose output answers for it again.

Run the global review on its own with:

\`\`\`bash
elfie verify --global
\`\`\`

Its result is written to \`elfie-requests/global.reviews.json\`.

:::callout warning Global criteria don't build anything
A file that holds only global criteria gives no unit, so it compiles nothing by itself. Describe the program with \`d\` and \`fn\`, and use global criteria for the rules that cut across all of it.
:::

## Global traits

\`\`\`lfy title="def/rules.lfy"
trait logged: \`Logs each call\` {
  where (\`It is called\`) -> \`One line naming {{@identifier}} is written to the log\`;
}

logged.apply(global);
\`\`\`

Every entity of every file now carries \`logged\`, and each gets the trait's criteria with \`{{@identifier}}\` rendered as its own name.

:::callout tip global, file, or entity?
Apply a trait to \`global\` only when it holds for everything. For one file, write \`trait.apply(@);\` at the top of that file. For a few entities, use \`is\` on each.
:::

## Global versus target guidance

| Where you write it | Who follows it | Reviewed |
| --- | --- | --- |
| \`global@acceptanceCriteria\` | Every unit | Yes, once, in the global review |
| A target const's \`@acceptanceCriteria\` | Every unit of that target | No. It is guidance. |
| A layer's criteria | Every unit of targets using the layer | No. It is guidance. |
`;

// @lfy def/documentation/pages/global-properties.lfy:GlobalPropertiesPage#GlobalPropertiesPage:documentationPage:1e15b7e7740c3e53ba6fd3cca648067af72584ec803e88c464d4032595a38bfc
export const metadata: Metadata = {
  title: "Global properties · Elfie documentation",
  description: documentationPageOf(slug)?.description.replaceAll("`", ""),
};

// @lfy def/documentation/pages/global-properties.lfy:GlobalPropertiesPage#GlobalPropertiesPage:page:6fc30fb3472a15a08cb00ba684dc437fa0a69257292ddf2512e95844c5cad06a
// @lfy def/documentation/pages/global-properties.lfy:GlobalPropertiesPage#GlobalPropertiesPage:page:9fa7fad4db4f65c68f86a2c6f88833da1035c8f92a589d2d91d6dfd2495d8022
export default async function GlobalPropertiesPage() {
  // @lfy def/documentation/pages/global-properties.lfy:GlobalPropertiesPage#GlobalPropertiesPage:documentationPage:7f3808f124c2d529e7bee81f09ad8d04386427b04d46050f05f341c3de96ecee
  // @lfy def/documentation/pages/global-properties.lfy:GlobalPropertiesPage#GlobalPropertiesPage:documentationArticle:de4b45353048ddfb568374d9f88b0209069cdc65702b841de13b1c61a4a77a81
  return (
    <DocumentationLayout
      currentSlug={slug}
      content={<Article slug={slug} source={markdown} />}
    />
  );
}
