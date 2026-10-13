import type { Metadata } from "next";

import { Article } from "@/components/documentation/article";
import { DocumentationLayout } from "@/components/documentation/layout";
import { documentationPageOf } from "@/lib/documentation/pages";

// @lfy def/documentation/pages/standard-library.lfy:StandardLibraryPage
const slug = "standard-library";

// @lfy def/documentation/pages/standard-library.lfy:StandardLibraryPage#StandardLibraryPage:documentationArticle:163d38f92bd7c1834105128c8f0449fb3e5d26191e0b8868591fa64df3698bb0
const markdown = `## How it's organized

| Part | Bring it in with | Holds |
| --- | --- | --- |
| Prelude | Nothing. Every file sees it. | Values, the context layer, criteria, tests, knowledge, commands |
| \`elfie/system/file\` | \`use "elfie/system/file";\` | Reading and writing files |
| \`elfie/system/path\` | \`use "elfie/system/path";\` | File system paths |
| \`elfie/system/json\` | \`use "elfie/system/json";\` | JSON values and text |
| \`elfie/system/time\` | \`use "elfie/system/time";\` | Instants and durations |
| \`elfie/system/process\` | \`use "elfie/system/process";\` | Commands, environment, exit |
| \`elfie/target\` | \`use "elfie/target";\` | \`Target\`, \`Dependency\`, \`targetOf\`, and the role traits |

Almost everything here is \`builtin\`: in generated code, it becomes the target language's own type or function. In TypeScript, \`List\` is \`readonly T[]\`. In Python, it is \`list[T]\`.

## List

An ordered sequence. Indexes count from 0, and an index out of range gives \`undefined\`. Only \`push\` changes the list it is called on.

| Member | Gives |
| --- | --- |
| \`length\` | The count of items. |
| \`map(transform)\` | Each item transformed, in order. |
| \`filter(predicate)\` | The items the predicate accepts. |
| \`find(predicate)\`, \`findIndex(predicate)\` | The first item accepted, or its index. \`undefined\` or \`-1\` when none. |
| \`some(predicate)\`, \`every(predicate)\` | Whether any, or every, item is accepted. |
| \`includes(value)\`, \`indexOf(value)\` | Whether an item equals the value, or the index of the first. Equality is \`==\`. |
| \`reduce(reducer, initial)\` | One value folded over the items. |
| \`join(separator = ",")\` | The items' text, separated. |
| \`concat(other)\`, \`slice(start, end?)\` | A new list. |
| \`sort(compare?)\`, \`reverse()\` | The items reordered. Sorting is stable. |
| \`flat()\`, \`unique()\` | One level flattened, or repeats dropped keeping the first. |
| \`first()\`, \`last()\`, \`isEmpty()\` | The first or last item, or whether there are none. |
| \`push(item)\` | Appends to the list itself and gives the new length. |

Predicates and transforms receive the item and its index.

## String

Text. Lengths, indexes, and slices count Unicode characters, never bytes.

| Member | Gives |
| --- | --- |
| \`length\` | The count of characters. |
| \`includes\`, \`startsWith\`, \`endsWith\` | Whether the text occurs, begins, or ends the string. |
| \`indexOf(text)\` | The first index of the text, or \`-1\`. |
| \`slice(start, end?)\` | Part of the string. |
| \`split(separator = ",")\`, \`lines()\` | The pieces between separators, or between line feeds. |
| \`replace(text, replacement)\` | Every occurrence replaced. |
| \`trim()\`, \`isBlank()\` | Without surrounding whitespace, or whether only whitespace is left. |
| \`toUpperCase()\`, \`toLowerCase()\` | The letters' case changed. |
| \`repeat(count)\`, \`padStart(length, filler)\`, \`padEnd(length, filler)\` | Repeated or padded text. |
| \`toNumber()\` | The number the string spells, or \`undefined\`. |

## Number and Boolean

| Member | Gives |
| --- | --- |
| \`floor()\`, \`ceil()\`, \`round()\` | An integer. \`round\` takes halves away from zero. |
| \`abs()\`, \`min(other)\`, \`max(other)\`, \`clamp(low, high)\` | The number limited or without its sign. |
| \`isInteger()\` | Whether there's no fraction. |
| \`toString()\`, \`toFixed(digits)\` | The number as text. |
| \`not()\` | On a boolean, the opposite. |

## Object and Pair

Keys are always strings and keep the order they were first set in.

| Member | Gives |
| --- | --- |
| \`keys()\`, \`values()\`, \`entries()\` | The keys, the values, or a \`Pair\` of \`key\` and \`value\` for each. |
| \`get(key)\`, \`has(key)\` | A value or \`undefined\`, and whether a key is present. |
| \`merge(other)\` | A new object. The other's values win. |
| \`isEmpty()\` | Whether there are no keys. |

## Template and Nullish

A \`Template\` has \`raw\` (the text as written), \`references\` (the entities it names), and \`text()\` (the rendered text). \`Nullish\` has no members. \`null\` and \`undefined\` work only through \`??\`, \`?.\`, and \`==\`.

## elfie/system/file

| Function | Does |
| --- | --- |
| \`read(path)\` | The file's text, or \`undefined\`. |
| \`write(path, text)\` | Replaces or creates the file, with any missing directories. Returns whether it worked. |
| \`append(path, text)\` | Adds text to the end, creating the file if needed. |
| \`exists(path)\` | Whether a file or directory is there. |
| \`list(path, recursive = false)\` | The files in a directory, as sorted relative paths. |
| \`createDirectory(path)\` | Creates a directory and any above it. |
| \`stat(path)\` | A \`Stat\` with \`size\`, \`modified\`, and \`isDirectory\`, or \`undefined\`. |
| \`remove(path)\` | Removes one file. Never a directory. |

## elfie/system/path

\`Path\` is text whose separator is always \`/\`, whatever the platform. It has \`join(...segments)\`, \`parent()\`, \`fileName()\`, \`extension()\`, \`stem()\`, \`withExtension(extension)\`, \`relative(base)\`, \`isAbsolute()\`, \`normalize()\`, \`segments()\`, and \`startsWith(base)\`.

## elfie/system/json

| Name | Does |
| --- | --- |
| \`Json\` | A value JSON can carry, with \`get(key)\`, \`at(path)\`, \`isObject()\`, and \`isList()\`. |
| \`parse(text)\` | The value, or \`undefined\` when the text isn't JSON. |
| \`stringify(value, layout)\` | JSON text. \`Layout.compact\` gives one line, and \`Layout.readable\` indents by two spaces. |

## elfie/system/time

\`now()\` gives an \`Instant\`, \`parse(text)\` reads an RFC 3339 timestamp, and \`elapsed(start)\` gives the seconds since. An \`Instant\` has \`rfc3339()\`, \`unix()\`, \`since(other)\`, and \`plus(seconds)\`.

:::callout tip Two modules declare parse
\`elfie/system/json\` and \`elfie/system/time\` both declare \`parse\`. Bring one of them in with \`as\`: \`use "elfie/system/time" as Time;\`.
:::

## elfie/system/process

| Function | Does |
| --- | --- |
| \`run(command, input?, directory?, environment?)\` | Runs a command through the shell and gives its \`Exit\`: \`code\`, \`stdout\`, \`stderr\`, and \`succeeded()\`. |
| \`stream(command, ..., onLine?)\` | Like \`run\`, passing each line to \`onLine\` as it arrives. |
| \`environment(name)\` | An environment variable, or \`undefined\`. |
| \`currentDirectory()\` | The working directory. |
| \`exit(code)\` | Ends the process. |
| \`isTerminal(stream)\` | Whether \`Stream.stdout\` or \`Stream.stderr\` goes to a terminal. |

## elfie/target

\`Target\`, \`Dependency\`, and \`targetOf\` declare targets. The role traits \`targetLanguage\`, \`targetRuntime\`, \`targetPlatform\`, \`targetEcosystem\`, \`targetFramework\`, \`targetInterface\`, \`targetLayout\`, and \`target\` are what layers extend. Two layout helpers, \`modulePerFile(extension, root?)\` and \`cratePerPrefix(prefixes, fallback)\`, cover common layouts. See [Compile targets](/docs/compile-targets) and [Custom compile targets](/docs/custom-compile-targets).
`;

// @lfy def/documentation/pages/standard-library.lfy:StandardLibraryPage#StandardLibraryPage:documentationPage:7cb8cc1b043a2256e93b2d9e7bf44d6af8078b1727b458431796a7b071e6849e
export const metadata: Metadata = {
  title: "Standard library · Elfie documentation",
  description: documentationPageOf(slug)?.description.replaceAll("`", ""),
};

// @lfy def/documentation/pages/standard-library.lfy:StandardLibraryPage#StandardLibraryPage:page:6fc30fb3472a15a08cb00ba684dc437fa0a69257292ddf2512e95844c5cad06a
// @lfy def/documentation/pages/standard-library.lfy:StandardLibraryPage#StandardLibraryPage:page:6a01d38139b100b7b8d9f4a6f601faaa6e766b62c0769607971eea266c168b58
export default async function StandardLibraryPage() {
  // @lfy def/documentation/pages/standard-library.lfy:StandardLibraryPage#StandardLibraryPage:documentationPage:9ade808f6afd80cf56c4b65ed47c4d3969a3420ae33888764348b0aeccd319dd
  // @lfy def/documentation/pages/standard-library.lfy:StandardLibraryPage#StandardLibraryPage:documentationArticle:b1bb802db482dc653b54421796d81a9da4dd7411b1c48263fdf30d9e615ae2a7
  return (
    <DocumentationLayout
      currentSlug={slug}
      content={<Article slug={slug} source={markdown} />}
    />
  );
}
