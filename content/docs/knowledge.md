## Adding knowledge

```lfy title="vendor/nextjs/main.lfy"
@knowledge.add({
  topic = `Next.js 15 request APIs are asynchronous: params, searchParams, cookies(), and headers() are awaited`,
  kind = KnowledgeKind.reference,
  source = "knowledge/next15-async-request-apis.md",
  quote = true,
});
```

| Field | Holds |
| --- | --- |
| `topic` | What it teaches, in a few words. |
| `kind` | What it is. See below. |
| `source` | Where it is. See below. |
| `quote` | `true` to quote it in full in every request. Otherwise the request names it and the compiler reads it. |

## Kinds

| Kind | Is | Source is |
| --- | --- | --- |
| `reference` | Documentation: a language reference, an API, a guide. | A file path. |
| `example` | Working code to imitate. | A file or directory path. |
| `definition` | Elfie source that defines it, read like any other. | A `use` path, such as `elfie/main`. |
| `tool` | A tool of the agent server for the compiler to call. | The tool's name, such as `elfie_grammar`. |

The `lfy` package, which targets Elfie itself, uses all four:

```lfy title="vendor/lfy/main.lfy"
@knowledge
  .add({
    topic = `How to write Elfie: constructs, framing, criteria, tests`,
    kind = KnowledgeKind.reference,
    source = "knowledge/writing-elfie.md",
    quote = true,
  })
  .add({ topic = `The grammar, as EBNF`, kind = KnowledgeKind.tool, source = "elfie_grammar" })
  .add({ topic = `The standard library every file sees`, kind = KnowledgeKind.definition, source = "elfie/main" })
  .add({ topic = `A complete package, to imitate`, kind = KnowledgeKind.example, source = "knowledge/example" });
```

## Sources are vendored

A source path is relative to the root of the package or project that declares it. Knowledge is never fetched: a source that starts with `http://` or `https://` is reported as a problem, and so is a reference or example whose file doesn't exist. Copy what the compiler needs into your package.

## Where to attach it

Every entity has `@knowledge`. An entity's own items come first, then each trait's in application order.

| Attach to | When |
| --- | --- |
| A target layer | It applies to everything built with that layer, such as a framework's migration notes. |
| A target const | It is about this project, such as facts compiler runs kept rediscovering. |
| An entity | Only one entity needs it, such as a protocol specification for one parser. |

## Quote or name?

Quote short, essential files: every request then carries the full text. Name long or occasional references, and let the compiler read them when it needs to.

:::callout info Knowledge versus criteria
Knowledge teaches the compiler *how*. Criteria say *what* must be true. The verifier is given criteria and never knowledge, so anything that must be checked belongs in a criterion.
:::

Changing knowledge plans no unit again: it isn't part of any unit's text, criteria, or interfaces. It reaches the next request of every unit.
