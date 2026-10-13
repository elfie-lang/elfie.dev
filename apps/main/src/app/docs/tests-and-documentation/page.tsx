import type { Metadata } from "next";

import { Article } from "@/components/documentation/article";
import { DocumentationLayout } from "@/components/documentation/layout";
import { documentationPageOf } from "@/lib/documentation/pages";

// @lfy def/documentation/pages/tests-and-documentation.lfy:TestsAndDocumentationPage
const slug = "tests-and-documentation";

// @lfy def/documentation/pages/tests-and-documentation.lfy:TestsAndDocumentationPage#TestsAndDocumentationPage:documentationArticle:9db3f0db0c59cf9f54107c04d410487af659d188d81a9f41d1b1c891b21cb496
const markdown = `## Adding tests

\`@test\` adds one or more cases. For a function, \`input\` is the argument list and \`expect\` is what the call returns.

\`\`\`lfy title="def/units.lfy"
/// meters: the length to convert
/// digits: places after the point
fn toFeet(meters: number, digits: number = 2): \`[[meters]] in feet, rounded to [[digits]] places\` => string {
  @acceptanceCriteria
    .add({ behavior = \`Returns the length times 3.28084, rounded halves away from zero\` })
    .add({ situation = \`[[meters]] is negative\`, behavior = \`Returns the length with a leading minus sign\` });
  @test(
    { input = [1], expect = "3.28" },
    { input = [0], expect = "0.00" },
    { input = [-2, 1], expect = "-6.6" },
  );
}
\`\`\`

\`input\` is always a list, even for one argument. A parameter with a default can be left out.

## Describing values with like

When a full value would bury the point of a test, describe it instead:

\`\`\`lfy title="def/units.lfy"
/// text: the measurement as a person types it, such as 3 ft
fn parse(text: string): \`The [[Measurement]] [[text]] spells; undefined when it spells none\` => Measurement | undefined {
  @acceptanceCriteria.add({ behavior = \`Accepts the units m and ft\` });
  @test(
    { input = ["3 ft"], expect = Measurement@like(\`3 feet\`) },
    { input = [string@like(\`text with no number in it\`)], expect = undefined },
  );
}
\`\`\`

| Where | What the generated test does |
| --- | --- |
| In \`input\` | Passes a value the compiler chose to fit the description. |
| In \`expect\` | Checks that the result is what the description says, never that it equals one fixed value. |

## Testing members

Put tests for a member in a \`with\` block right after it. The receiver comes first in \`input\`.

\`\`\`lfy title="def/teams.lfy"
d Team is named: \`A group of people\` {
  $members: \`Who is on the team\` = string[];
  with Team$members {
    @acceptanceCriteria.add({ behavior = \`Holds no name twice\` });
    @test({ input = [Team@like(\`a team named Core\`)], expect = string[]@like(\`no name twice\`) });
  }
  .members = [];
}
\`\`\`

## What becomes a test

- Every \`@test\` case becomes one test in the target's own framework, such as \`bun:test\`, pytest, or \`cargo test\`, placed where the target's language says.
- Every criterion that can be checked mechanically becomes a test too.
- The verifier runs the tests. A test case is satisfied only when its generated test exists and passes.

:::callout tip Test or criterion?
Write a criterion for a rule, and a test for a case. "Returns 0 when the list is empty" is a rule. Add a test when the rule alone leaves room for doubt: rounding, ties, boundaries, errors. Don't add a test that only repeats a criterion.
:::

## Documentation

| Syntax | Read by the compiler | Use it for |
| --- | --- | --- |
| \`/// text\` | Yes | Documenting the declaration below it. |
| \`/** text **/\` | Yes | Longer documentation. |
| \`// text\` | No | Notes for readers that aren't part of the specification. |
| \`/* text */\` | No | Commenting out. Block comments nest. |

Documentation can refer to declared things with \`[[...]]\`, and those references are checked like any other.

### Describing parameters

A \`///\` line above a declaration that begins with a parameter's name and a colon describes that parameter:

\`\`\`lfy
/// meters: the length to convert
/// digits: places after the point
fn toFeet(meters: number, digits: number = 2) ...
\`\`\`

Packages also use these lines to describe trait parameters, such as \`/// path: the URL path, beginning with a slash\`.

### Documenting a file

A \`///\` line at the top of a file, followed by a blank line, documents the file:

\`\`\`lfy title="def/units.lfy"
/// Converts between units of length. Every value is in meters unless a name says otherwise.
\`\`\`

### Recording decisions

Use \`//\` comments for reasoning that should stay with the code but is not a requirement.
`;

// @lfy def/documentation/pages/tests-and-documentation.lfy:TestsAndDocumentationPage#TestsAndDocumentationPage:documentationPage:b9f9e73c57c37379383bf6cc58167eec7b3001c92396f5cde579e381e68db877
export const metadata: Metadata = {
  title: "Tests & documentation · Elfie documentation",
  description: documentationPageOf(slug)?.description.replaceAll("`", ""),
};

// @lfy def/documentation/pages/tests-and-documentation.lfy:TestsAndDocumentationPage#TestsAndDocumentationPage:page:6fc30fb3472a15a08cb00ba684dc437fa0a69257292ddf2512e95844c5cad06a
// @lfy def/documentation/pages/tests-and-documentation.lfy:TestsAndDocumentationPage#TestsAndDocumentationPage:page:a368b4de2ed9d1f80e1e5828dd830a6364042b361f2733ab4d8a62702f93ee22
export default async function TestsAndDocumentationPage() {
  // @lfy def/documentation/pages/tests-and-documentation.lfy:TestsAndDocumentationPage#TestsAndDocumentationPage:documentationPage:8193afa3f19313af2aee46891116d24bd76c3d522fcebf3ea90aec9edf393577
  // @lfy def/documentation/pages/tests-and-documentation.lfy:TestsAndDocumentationPage#TestsAndDocumentationPage:documentationArticle:b6325a635ccb163dbceba10f31ad030933725effc8eb9ad8f3a5bb969975f547
  return (
    <DocumentationLayout
      currentSlug={slug}
      content={<Article slug={slug} source={markdown} />}
    />
  );
}
