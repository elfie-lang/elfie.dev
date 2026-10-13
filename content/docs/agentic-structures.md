## Choosing a construct

| Construct | You write | The compiler writes | Use it for |
| --- | --- | --- | --- |
| `d` | Members, descriptions, criteria | The data type and any methods | Data your program passes around |
| `fn` | Parameters, output, criteria, tests | The whole body | Behavior. Most of your program. |
| `function` | The whole body | A translation, statement by statement | Exact logic, and helpers that run at compile time |
| `type` | A structural shape | The nearest equivalent in the target | Shapes with no rules of their own |
| `external` | A name and a type | Nothing. It binds to a dependency. | Things defined outside your program |

Prefer `d` and `fn`. Reach for `function` when the exact steps matter more than the outcome.

## Data with d

```lfy title="def/orders.lfy"
enum Status: `Where an order is` {
  open = `Not yet paid`,
  paid = `Paid and waiting to ship`,
  shipped = `On its way to the customer`,
}

d Order: `A customer's order` {
  $id: `Unique, and never changes` = string;
  $items: `What was ordered` = Item[];
  $status: `Where the order is now` = Status;
  with Order$id {
    @acceptanceCriteria.add({ behavior = `No two orders share an id` });
  }
  .status = Status.open;
}

d Item: `One line of an order` {
  $sku: `The product's stock keeping unit` = string;
  $quantity: `How many were ordered; at least 1` = number;
  $price: `The price of one, in whole cents` = number;
}
```

- `$name: description = Type;` declares a member.
- `.name = value;` sets a member's default value.
- `with Order$id { ... }` attaches criteria and tests to one member.
- A `d` can carry traits (`d Order is persisted`) and extend another (`d Invoice extends Order`).

The target decides what a `d` becomes. In TypeScript it is an exported type with one readonly property per member. In Python it is a frozen dataclass.

## Behavior with fn

```lfy title="def/orders.lfy"
/// order: the order to add up
fn totalOf(order: Order): `What an [[Order]] costs, in whole cents` => number {
  @acceptanceCriteria
    .add({ behavior = `Returns the sum of [[Item.price]] times [[Item.quantity]] over [[Order.items]]` })
    .add({ situation = `[[Order.items]] is empty`, behavior = `Returns 0` });
  @test({
    input = [{ id = "a", items = [{ sku = "pen", quantity = 3, price = 150 }], status = Status.open }],
    expect = 450,
  });
}
```

A `fn` has a signature, a description, and a body that holds only context: criteria, tests, and `where` rules. Its output type follows `=>`. A `fn` with no output, or with no body at all, is allowed. End it with `;` instead of a block.

## Acceptance criteria

A criterion is one thing that must be true. Each one is an object with up to three fields.

| Field | Holds | Example |
| --- | --- | --- |
| `behavior` | What must happen. One string, or a list for tightly related facts. | `` `Returns 0` `` |
| `situation` | When it applies. Leave it out for always. A list means all must hold. | `` `[[items]] is empty` `` |
| `sideEffects` | What is written outside the return value. | `` [`One shipping notice is sent to the customer`] `` |

```lfy title="def/orders.lfy"
/// order: the order to ship
fn ship(order: Order): `Marks an [[Order]] as shipped` => Order {
  where (`[[order]] is paid`) -> `Returns the order with [[Order.status]] set to shipped`;
  where (`[[order]] is open`) or (`[[order]] is shipped`) -> `Fails, and the order is unchanged`;
  @acceptanceCriteria.add({
    situation = `The order is shipped`,
    behavior = `Returns the shipped order`,
    sideEffects = [`One shipping notice is sent to the customer`],
  });
}
```

## Rules with where

`where` is a shorter way to write a criterion with a situation:

```lfy
where (`a`) and (`b`) -> `behavior`;
```

| Conditions | Situation |
| --- | --- |
| `(\`a\`) and (\`b\`)` | Both must hold. |
| `(\`a\`) or (\`b\`)` | One merged situation: either holds. |
| `!(\`a\`)` | The negation. Negating a group distributes over it. |

`where` reads best in traits, where one rule applies to every entity that carries the trait. See [Traits](/docs/traits).

## Writing criteria that hold up

:::compare
```text title="Do"
One behavior per .add({ ... }).
Put every when, if, unless, after, and once in situation.
Name the member, value, or output a criterion constrains.
Make each criterion stand on its own.
Put a criterion on the narrowest entity it constrains.
Describe what a caller can observe.
```
```text title="Don't"
Join two behaviors with ; or "and also".
Hide a condition inside the behavior.
Write criteria that can't be checked: "Is fast", "Works well".
Rely on another criterion's order or presence.
Restate what a type or a trait already guarantees.
Describe caches, helper steps, or algorithms.
```
:::

## External things

`external` declares a name that something outside your program provides, such as a dependency or an asset.

```lfy title="def/clock.lfy"
external Clock: `The system clock, provided by the runtime` = object;
```

An `external` can carry traits too. This site declares its logo as an external image, and a trait from the project says how to fetch it from the design file:

```lfy title="def/atoms.lfy"
external LogoImage is image(
  `https://www.figma.com/design/QRrnCVX7stPZ0x1m3zMxr9/Elfie-Design?node-id=9-27`,
): `URL to the exported logo` = string;
```

## From criterion to code

:::flow
Criterion | You add it to an entity
Id | Built from what it's for, who wrote it, and what it says
Marker | The compiler marks the code that answers for it
Review | The verifier judges it satisfied, violated, or unverifiable
:::

Each criterion gets an id. The compiler marks the code that satisfies it with a comment such as `// @lfy def/orders.lfy:totalOf#<id>`, and the verifier reviews it on its own. A violated criterion sends the batch back to the compiler once, with the reason. Reword a criterion and it gets a new id, so it is reviewed again.

:::callout warning Ambiguity is a compile error
When a criterion can be read two ways, or two criteria conflict, the compiler stops and quotes the criterion. It never guesses. Fix the definition and compile again.
:::
