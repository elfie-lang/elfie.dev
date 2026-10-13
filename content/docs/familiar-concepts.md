:::compare
```ts title="TypeScript"
function total(prices: number[]): number {
  let sum = 0;
  for (const price of prices) {
    sum += price;
  }
  return sum;
}
```
```lfy title="Elfie"
function total(prices: number[]) -> number {
  let sum = 0;
  for (const price in prices) {
    sum =+ price;
  }
  return sum;
}
```
:::

Three differences show up in those few lines. The return type follows `->`, a loop over items uses `in`, and compound assignment is written `=+`. The rest of this page covers each of them.

## Values and variables

`const` declares a name that can't be set again, and `let` declares one that can. A description in backticks after a colon becomes part of the name's context. The compiler reads it, and so do tools like hover.

```lfy title="values.lfy"
const answer: `The answer to everything` = 42;
let count = 0;
count =+ 1;
```

| Type | Values |
| --- | --- |
| `boolean` | `true`, `false` |
| `number` | `42`, `0.5`, `8_100_000_000` |
| `string` | `"text"`, `'text'`, `` `text` `` |
| `object` | `{ x = 0, y = 0 }` |
| Lists | `["Ada", "Grace"]`, written `string[]` or `List<string>` as a type |
| Nullish | `null` (set to nothing on purpose), `undefined` (never set) |

There is one number type for integers and fractions. Underscores only group digits. `/` never truncates, and `%` takes the sign of its left side.

## Strings and templates

- **Double quotes** take escapes such as `\n`, `\t`, and `\u00e9`.
- **Single quotes** take no escapes but `\\` and `\'`.
- **Backticks** are templates. `[[Name]]` refers to a declared thing, and `{{expression}}` inserts a value while the program is compiled. A template with neither is just a string.

```lfy title="strings.lfy"
const greeting = "Hello,\nworld";
const path = 'C:\\Users';
```

Templates are how you write prose that the compiler can check. [Context layer](/docs/context-layer) covers references and executions in full.

## Lists and objects

```lfy title="collections.lfy"
const names = ["Ada", "Grace", "Linus"];
const first = names[0];
const origin = { x = 0, y = 0 };
const depth = origin.z ?? 0;
```

:::callout warning Objects use =, not :
Write object keys as `key = value`. In Elfie, `:` attaches a description or a type to a name, so `{ x: 0 }` doesn't mean what it does in JavaScript.
:::

An index out of range, or a key that isn't there, gives `undefined`. Lists and objects come with members such as `map`, `filter`, `keys`, and `merge`. See the [Standard library](/docs/standard-library).

## Operators

| Operators | Meaning |
| --- | --- |
| `+ - * / % **` | Arithmetic. `+` also joins strings. `**` raises to a power. |
| `== !=` | Equal and not equal, without casting. `1 == "1"` is false. |
| `~=` | Equal after casting. |
| `&=` | The same entity. |
| `< <= > >=` | Ordering. Strings order by code point. |
| `&& \|\| !` | Logic. `&&` and `\|\|` yield one of their sides and skip the right side when the left decides. |
| `??` | The right side when the left is `null` or `undefined`. |
| `?.` | Member access that yields `undefined` instead of failing on a missing value. |
| `a ? b : c` | Conditional. |
| `a ... b` | A range. Also spreads a list, `[...a, ...b]`, and collects the rest of the parameters. |
| `\| &` | Bitwise or and and between values; union and intersection between types. |

:::callout warning Only false, null, and undefined are falsy
`0`, the empty string, and the empty list are all truthy. `null == undefined` is false: each equals only itself.
:::

## Setters

Every assignment is a setter. Compound setters put the `=` first.

| Setter | Effect |
| --- | --- |
| `x = v` | Sets `x`. |
| `x =+ v`, `=-`, `=*`, `=**` | Adds, subtracts, multiplies, or raises, then sets. |
| `x =& v`, `=\|` | Bitwise and or or, then sets. |
| `x =! v` | Sets `x` to the opposite of `v`. |
| `x =?? v` | Sets only when `x` is `null` or `undefined`. |
| `x =\|\| v` | Sets only when `x` is falsy. |
| `x =&& v` | Sets only when `x` is truthy. |

## Control flow

```lfy title="flow.lfy"
function firstNegative(values: number[]) -> number {
  for (const value, index from values) {
    if (value < 0) {
      return index;
    }
  }
  return -1;
}

function countdown(start: number) -> number[] {
  const steps: number[] = [];
  let n = start;
  while (n > 0) {
    steps.push(n);
    n =- 1;
  }
  return steps;
}
```

| Loop | Visits |
| --- | --- |
| `for (const item in list)` | Each item of a list, or each value of an object. |
| `for (const index of list)` | Each index of a list, or each key of an object. |
| `for (const item, index from list)` | Items and indices together, or values and keys. |
| `while (condition) { }` | Until the condition is false. |
| `loop { }` | Until a `break`. |

:::callout warning in and of are reversed from JavaScript
In Elfie, `in` visits values and `of` visits keys and indices. The prefixes work the same way: `in x` gives the values of `x`, `of x` its keys, and `from x` both.
:::

`if` and `else` work as you'd expect, and `else if` is `else` followed by an `if`. `break` leaves a loop and `continue` skips to the next pass. `async` runs a statement as a promise, and `await` gives a promise's value.

## Functions

`function` is a function you write out in full. Its return type follows `->`, which can also be written `→`.

```lfy title="geometry.lfy"
/// a: where to start
/// b: where to finish
function distance(a: Point, b: Point): `How far apart two points are` -> number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return (dx ** 2 + dy ** 2) ** 0.5;
}

const doubled = names.map((name) => name + name);
```

- A parameter is optional when it's written `name?: Type`. Its type is then `Type | undefined`.
- A default value follows `=`: `digits: number = 2`.
- A spread parameter collects the rest: `...segments: string[]`.
- Inline functions use `=>`: `(x) => x + 1`.
- `///` lines above the declaration that begin with a parameter's name and a colon describe that parameter.

Most of the behavior in an Elfie program isn't written this way. A `fn` (with no `-ction`) is generated from criteria instead. Use `function` when exact logic matters, or for helpers that run at compile time. See [Agentic structures](/docs/agentic-structures).

## Types

```lfy title="types.lfy"
type Point: `A place on a plane` {
  x: `Distance from the left edge` = number,
  y: `Distance from the top edge` = number,
  label?: `What to call it` = string,
}

enum Direction: `Which way to move` {
  up = `Toward the top edge`,
  down = `Toward the bottom edge`,
}

alias Coordinate: `A point on the map` = Point;
```

| Declaration | Use it for |
| --- | --- |
| `type` | A structural shape. Keys are separated by commas. |
| `enum` | A closed set of named values. Each value has a description. |
| `alias` | A second name for something that already has one. |
| `A \| B` | A value that is either. `T \| undefined` is optional. |
| `A & B` | A value that is both. |
| `List<T>`, `T[]` | Generics. `T[]` is shorthand for `List<T>`. |
| `(is trait)` | Any value whose type carries a trait. See [Traits](/docs/traits). |

For data whose implementation the compiler writes, use `d` instead of `type`. See [Agentic structures](/docs/agentic-structures).

## Files and modules

```lfy
use "./traits";
use "python" as Python;
use "elfie/system/file";
```

- `use "path";` brings a file's declarations into scope. Paths are relative and leave off `.lfy`.
- `use "path" as Name;` brings the file in as one name, so you write `Name.thing`.
- A path that starts with a package's name, such as `"python"` or `"elfie/system/file"`, loads from that package.
- `elfie check` warns about a `use` whose declarations go unused.

## Comments

| Syntax | Read by the compiler? |
| --- | --- |
| `// note` | No. Notes for people reading the source. |
| `/* note */` | No. Block comments nest. |
| `/// text` | Yes. Documents the declaration below it. |
| `/** text **/` | Yes. Block documentation. |

Documentation can hold `[[references]]`. See [Tests & documentation](/docs/tests-and-documentation).

## Reserved words

These words can't be used as names. Watch out for `d`, which declares data: `const d = 1;` is an error.

```text title="Keywords"
abstract  ace  alias  and  as  async  await  boolean  break  case  class  const
continue  d  default  else  enum  extends  external  false  fn  for  from
function  if  impl  in  interface  is  let  loop  match  matchall  module  new
null  number  object  of  or  private  public  return  self  static  string
super  switch  then  trait  true  type  typeof  undefined  use  where  while
with  yield
```
