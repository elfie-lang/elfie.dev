:::callout info Before you start
This page assumes you've followed [Getting started](/docs/getting-started): `elfie` is on your PATH, `elfie.json` names a compiler and a verifier, and the `cli`, `platforms`, and `python` packages are listed as dependencies. The generated script runs with [uv](https://docs.astral.sh/uv/).
:::

:::steps
### Describe the target
A target says what your definitions are built into. This one is a single Python script, run with uv, that people use from a terminal. Create `def/targets.lfy`:

```lfy title="def/targets.lfy"
use "elfie/target";
use "cli";
use "platforms";
use "python" as Python;

ace const hello: `A greeting on the command line` = targetOf({
  output = "out/hello",
  language = Python.python,
  runtime = Python.cpython.layer("3.12"),
  platforms = [posix],
  ecosystem = Python.uv,
  frameworks = [Python.argparse],
  interfaces = [commandLine],
  layout = Python.uvScript.layer("hello.py"),
});

global@targets.add(hello);
```

Each slot takes a layer from a package. `python` says how Elfie declarations become Python, `uvScript` says the program is one file, `hello.py`, and `commandLine` says people run it from a terminal. The last line builds every definition in the project for `hello`. [Compile targets](/docs/compile-targets) covers each slot.

### Describe the program
Now say what the program does. Create `def/main.lfy`:

```lfy title="def/main.lfy"
use "cli";

/// name: who to greet, as a positional argument
/// shout: whether to greet in capitals
fn greet(name?: string, shout: boolean = false) is command(""): `Greets someone by name` => number {
  @acceptanceCriteria
    .add({ behavior = `Prints one line: Hello, then [[name]], then an exclamation mark` })
    .add({ situation = `[[name]] is left out`, behavior = `Prints Hello, world!` })
    .add({ situation = `[[shout]] is true`, behavior = `The whole line is in capitals` })
    .add({ behavior = `Returns 0` });
  @test({ input = ["Ada"], expect = 0 });
}
```

There is no function body. A `fn` is a contract: its parameters, what it returns, the criteria it must meet, and the tests it must pass. The compiler writes the code.

- `is command("")` makes `greet` the program itself rather than a subcommand.
- The `///` lines describe the parameters. `name` becomes a positional argument because its description says so.
- `[[name]]` and `[[shout]]` are references. `elfie check` reports a reference that names nothing.
- Each `.add` is one acceptance criterion. `situation` says when it applies.

### Check it
```bash title="Terminal"
elfie check
```
```text title="Output"
def/main.lfy: generation warning: hello main: no output has been generated for it
34 files, 0 problems, 1 stale units
```

No problems. The warning says `main` hasn't been built yet, which is expected. The file count includes the packages and the standard library.

### See the plan
```bash title="Terminal"
elfie compile --dry-run
```
```text title="Output"
hello main fresh []
batch main [main]
```

One *unit*, `main`, is planned for the target `hello`, because it is *fresh*: it has never been built. A unit is one definition file compiled for one target. `targets.lfy` gives no unit, because a target is evaluated at compile time and never generated.

### Compile
```bash title="Terminal"
elfie compile
```

For each batch, `elfie` writes a request and runs your compiler with it. The compiler writes `out/hello/hello.py` and its tests, then runs the target's commands: `uv sync`, the tests through pytest, and `ruff` and `pyright` for lint. They must pass with no warnings. Then `elfie` checks that every entity of the unit is marked in the output, the verifier reviews each criterion, and the source maps are recorded under `elfie-compile/maps/hello/`.

The generated code carries markers that tie each part back to its definition:

```python title="out/hello/hello.py" caption="Illustrative. The code a compiler writes will differ in its details."
# @lfy def/main.lfy:greet
def greet(name: str | None = None, shout: bool = False) -> int:
    line = f"Hello, {name or 'world'}!"
    # @lfy def/main.lfy:greet#<criterion id>
    if shout:
        line = line.upper()
    print(line)
    return 0
```

### Run it
```bash title="Terminal"
cd out/hello
uv run hello.py Ada
uv run hello.py --shout
```
```text title="Output"
Hello, Ada!
HELLO, WORLD!
```

### Change it
Change the greeting in the first criterion from *Hello* to *Hi*, and the second criterion to `Prints Hi, world!`. Then check again:

```bash title="Terminal"
elfie check
elfie compile
```

`elfie check` reports `main` as stale. `elfie compile` sends only that unit. Because the criteria kept their places and only their wording changed, the request marks them *reworded*, the existing markers move to the new criteria, and the verifier reviews those two criteria again. The verdicts for the criteria you didn't touch carry over.
:::

:::callout warning When the compiler stops
If a criterion can be read two ways, or two criteria conflict, the compiler stops instead of guessing. It submits *blocked* with the criterion quoted, or *clarify* with one question, and `elfie` writes a file under `elfie-requests/` for you. Answer it by changing your definitions, then compile again.
:::

## What you used

| Construct | What it did |
| --- | --- |
| `ace const` | Declared a target, evaluated while compiling. |
| `targetOf({ ... })` | Gave the record its `Target` type. |
| `global@targets.add` | Built every definition for the target. |
| `fn` | Declared behavior that the compiler implements. |
| `is command("")` | Applied a trait from the `cli` package. |
| `@acceptanceCriteria.add` | Added a criterion to the current entity. |
| `@test` | Added a concrete case. |

:::cards
### Familiar concepts
meta: Language guide · book
Variables, types, control flow, and the few places Elfie differs from what you know.
[Read the guide](/docs/familiar-concepts)

### Agentic structures
meta: Language guide · code
Write better `d` and `fn` declarations, and criteria the verifier can check.
[Learn d and fn](/docs/agentic-structures)
:::
