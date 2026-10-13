## Members and values

A member is declared in the scope layer and set in the value layer.

| You write | Layer | Means |
| --- | --- | --- |
| `$members: \`Who is on the team\` = string[];` | Scope | `Team` has a member `members`, a list of strings. |
| `.members = [];` | Value | Its value starts empty. |
| `Team$members` | Scope | The member itself, as an entity with its own context. |
| `team.members` | Value | One team's members at run time. |
| `[[Team.members]]` | Reference | The member, in a template or documentation. |

```lfy title="def/teams.lfy"
trait named: `Has a display name` {
  $name: `The name people see` = string;
}

d Team is named: `A group of people` {
  $members: `Who is on the team` = string[];
  with Team$members {
    @acceptanceCriteria.add({ behavior = `Holds no name twice` });
  }
  .members = [];
}

const teamName = Team$name@definition;
```

## Traits add to scope

`Team` declares only `members`, but `Team$name` exists because `named` is applied to it. A trait's members join the scope of every entity it is applied to, and its setters set their values. A trait's members can share a name with its parameters, so `trait nextjs(root)` may also declare `$root`.

## Rules for one member

`with Entity$member { ... }` makes the member the current entity for the block. Criteria and tests inside it belong to that member, so the verifier reviews them against the code generated for it.

Put a criterion on the narrowest entity it constrains. "Holds no name twice" is about `members`, so it goes on `Team$members` rather than on `Team`.

## File scope and the prelude

Every file has its own scope for the names it declares. The parent of every file scope is the **prelude**, which holds the standard library's core: `List`, `String`, `Number`, `Object`, `Template`, `Entity`, and the rest. That's why you can use them without a `use`.

The system modules aren't in the prelude. Bring them in when you need them:

```lfy
use "elfie/system/file";
use "elfie/system/json" as Json;
```

A name you declare shadows a prelude name without a problem, so a project can have its own `map` or `parse`.

## use and names

| Statement | Brings in |
| --- | --- |
| `use "./traits";` | Every declaration of `traits.lfy`, by its own name. |
| `use "python" as Python;` | The file as one name, so you write `Python.uv`. |

- Refer only to names you declared or brought in with `use`. A reference to anything else is reported.
- When two modules declare the same name, bring one in with `as`. `elfie/system/json` and `elfie/system/time` both declare `parse`.
- A member of an aliased module's data is referenced nested, as in `[[Time.Instant.rfc3339]]`.
- `elfie check` warns about a `use` none of whose declarations are used.

## Declaring twice

Declaring the same name twice in one scope is a problem. Two files can each declare a `Session`, because each file has its own scope, but a target that puts both files in one module may still clash.

## Other references

| Syntax | Means |
| --- | --- |
| `$&name` | A member of the enclosing scope. |
| `&name` | The entity a name is bound to, rather than its value. |
| `^^` | The entity the previous statement declared. |
| `@` | The current entity. At the top of a file, the file itself. |

```lfy title="def/billing.lfy"
d Invoice: `A bill sent to a customer` {
  $total: `What is owed, in whole cents` = number;
}

const lastDeclared = ^^;
```
