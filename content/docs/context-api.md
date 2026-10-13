`Name@member` reads a member. Inside a declaration's body, `@member` reads the current entity's. `@` alone is the entity itself.

## Every entity

| Member | Type | Holds |
| --- | --- | --- |
| `identifier` | `string \| undefined` | The declared name. Undefined when anonymous. |
| `definition` | `string \| undefined` | The description. |
| `type` | `Entity \| undefined` | The declared or inferred type. For a data, trait, type, or enum, the entity itself. |
| `typeParameters` | `Entity[]` | The type parameters it declares, in order. |
| `typeArguments` | `Entity[]` | The arguments a generic type was written with. |
| `itemType` | `Entity \| undefined` | What a list-typed entity holds. |
| `acceptanceCriteria` | `Criterion[]` | Its own criteria, then each trait's, in application order. |
| `tests` | `Test[]` | Every test added, in order. |
| `traits` | `Entity[]` | Every trait applied, directly or inherited, in application order. |
| `references` | `Entity[]` | Every entity referred to with `[[...]]` in its description, documentation, or value. |
| `knowledge` | `Knowledge[]` | Its own items, then each trait's. |
| `commands` | `Command[]` | Shell commands for its operations. |
| `targets` | `Entity[]` | The target consts added to it. |

| Call | Does |
| --- | --- |
| `@acceptanceCriteria.add(criterion)` | Appends a criterion. Returns the list, so calls chain. |
| `@test(...tests)` | Appends test cases. Returns the entity. |
| `@knowledge.add(item)` | Appends a knowledge item. |
| `@commands.add(command)` | Appends a command. |
| `@targets.add(target)` | Appends a target const. Adding one twice, or adding to a member, a parameter, or an enum member, is a problem. |
| `Type@like(prompt)` | A value of the type that the prompt describes, chosen by the compiler. |

## Functions

Applies to `fn` and `function`.

| Member | Type | Holds |
| --- | --- | --- |
| `parameters` | `Parameter[]` | Its parameters, in order. |
| `output` | `Entity` | The type after the arrow, or the inferred type of what it returns. |
| `agentic` | `boolean` | `true` for a `fn`, whose body is generated, and `false` for a `function`. |

## Traits

| Member | Type | Holds |
| --- | --- | --- |
| `entities` | `Entity[]` | Everything the trait was applied to, directly or by inheritance. |
| `extenders` | `Trait[]` | Every trait that names it in `extends`. |
| `apply(target, ...arguments)` | `Trait` | Applies the trait to an entity or a list of entities, and returns the trait. |
| `layer(...arguments)` | `Layer` | The trait with arguments, for a target's slot. Applies it to nothing. |

## Other kinds

| Kind | Member | Type | Holds |
| --- | --- | --- | --- |
| Enum | `members` | `Entity[]` | Its named values, in order. |
| Member | `owner` | `Entity` | The entity that declares it. |
| Parameter | `optional` | `boolean` | Whether a call may leave it out. |
| Parameter | `defaultValue` | `Entity \| undefined` | What it takes when left out. |
| Parameter | `spread` | `boolean` | Whether it takes the rest of the arguments. |
| Module | `entities` | `Entity[]` | Every entity its file declares. |

Data (`d`), types, and variables have only the members every entity has.

## Criterion

| Field | Type | Holds |
| --- | --- | --- |
| `situation` | `string \| string[] \| undefined` | When it applies. A list must all hold. Undefined means always. |
| `behavior` | `string \| string[] \| undefined` | What must happen. |
| `sideEffects` | `string[] \| undefined` | What is written outside the value. |
| `contributor` | `object` | The entity whose body holds it: the entity itself, or one of its traits. |

A `where` statement adds a criterion too. Its conditions are the situation, and the text after `->` is the behavior.

## Test

| Field | Holds |
| --- | --- |
| `input` | For a function, the argument list. Otherwise, a value. |
| `expect` | For a function, what the call returns. Otherwise, a value. |

## Knowledge

| Field | Type | Holds |
| --- | --- | --- |
| `topic` | `string` | What it teaches, in a few words. |
| `kind` | `KnowledgeKind` | `reference`, `example`, `definition`, or `tool`. |
| `source` | `string` | A path relative to the declaring package or project, a `use` path, or a tool's name. |
| `quote` | `boolean \| undefined` | Whether requests quote it in full. |

## Command

| Field | Type | Holds |
| --- | --- | --- |
| `operation` | `Operation` | `install`, `add`, `build`, `test`, `lint`, `format`, or `run`. |
| `line` | `string \| undefined` | What `sh -c` runs in the target's output directory. Undefined turns the operation off. |
