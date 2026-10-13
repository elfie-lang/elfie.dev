## Anatomy of a layer

A layer is a trait that extends the trait of its role. Applying the target applies each layer to the target's const, so the layer's criteria become guidance for every unit, its knowledge is given to the compiler, and its commands are listed in every request.

| Role | Extend | Members to set |
| --- | --- | --- |
| Language | `targetLanguage` | `language`, `fileExtension`, `markerComment` |
| Runtime | `targetRuntime` | `runtime` |
| Platform | `targetPlatform` | |
| Ecosystem | `targetEcosystem` | `ecosystem`, `manifest`, `lockfile`, `scriptRunner` |
| Framework | `targetFramework` | |
| Interface | `targetInterface` | |
| Layout | `targetLayout` | |
| Anything else | `target` | |

Every layer can also set `provides`, `requires`, and `outputExtensions`. Those three gather the items of every layer. Any other member set to two different values by two layers is a problem.

## A house style

The most common custom layer holds a team's own rules:

```lfy title="vendor/house/main.lfy"
use "elfie/target";
use "elfie/target/target";

trait houseStyle extends target: `How the team writes code` {
  @acceptanceCriteria
    .add({ behavior = `Every exported function has a doc comment that says what it returns` })
    .add({ behavior = `No line of code is longer than 100 characters` });
  @knowledge.add({
    topic = `The team's voice for messages people read`,
    kind = KnowledgeKind.reference,
    source = "knowledge/voice.md",
    quote = true,
  });
  @commands.add({ operation = Operation.lint, line = "$RUN_SCRIPT lint" });
}
```

Add it to a target's `layers` slot: `layers = [houseStyle]`.

## Commands

| Operation | Runs to |
| --- | --- |
| `install` | Fetch every dependency the manifest lists. |
| `add` | Add one dependency. |
| `build` | Compile or type-check the outputs. |
| `test` | Run the tests. |
| `lint` | Run the linters. |
| `format` | Check formatting without changing anything. |
| `run` | Start what was built. |

A command's `line` runs with `sh -c` in the target's output directory, with these variables set:

| Variable | Set to |
| --- | --- |
| `RUN_SCRIPT` | The ecosystem's script runner, such as `bun run` or `uv run`. |
| `NAME`, `VERSION` | For `add`: the dependency, and its version or empty. |
| `TESTS` | For `test`: a filter, or empty to run every test. |
| `SCOPE` | For `build`, `test`, and `lint`: part of the outputs, or empty for all. |

```lfy
@commands
  .add({ operation = Operation.install, line = "bun install" })
  .add({ operation = Operation.add, line = 'bun add "$NAME${VERSION:+@$VERSION}"' });
```

When a target has several commands for one operation, one the const adds itself wins, and otherwise the first in guidance order does. A command with no `line` turns the operation off. `uvScript` does this for `install`, because a script declares its dependencies inline.

## Interface traits

An interface is two traits: one for the target's `interfaces` slot, and one that a `fn` carries to join it. A framework of the target says how each is built, and the compiler stops if none does.

```lfy title="vendor/house/main.lfy"
use "elfie/target/interface";

/// name: the job's name in the scheduler
/// schedule: when it runs, as a cron expression
trait job(name: string, schedule: string): `An fn the scheduler runs on its own` {
  where (`The fn is built`) -> `It is registered as the job {{name}}, run at {{schedule}}`;
  where (`The fn fails`) -> `The failure is logged and the next run still happens`;
}

trait scheduler extends targetInterface: `Jobs that run on a schedule` {
  .requires = ["process"];
  @acceptanceCriteria.add({ behavior = `Every fn carrying [[job]] is one job, and nothing else runs on a schedule` });
}
```

## Presets

Wrap a full target in an `ace function`, so a project declares it in one line:

```lfy title="vendor/house/main.lfy"
/// root: where the script lives, relative to the project root
ace function script(root: string): `A Python script run with uv, in the house style` -> Target {
  return targetOf({
    output = root,
    language = Python.python,
    runtime = Python.cpython.layer("3.12"),
    platforms = [posix],
    ecosystem = Python.uv,
    frameworks = [Python.argparse],
    interfaces = [commandLine],
    layout = Python.uvScript.layer("main.py"),
    layers = [houseStyle],
  });
}
```

## Using it

```json title="elfie.json"
{
  "dependencies": {
    "house": { "root": "vendor/house" }
  }
}
```

```lfy title="def/tools/targets.lfy"
use "house" as House;

ace const tools: `Small scripts the team runs` = House.script("out/tools");

tools
  @acceptanceCriteria
  .add({ behavior = `Every script prints its version with --version` });
```

```lfy title="def/tools/cleanup.lfy"
use "house";
use "./targets";

@targets.add(tools);

fn cleanup() is job("cleanup", "0 3 * * *"): `Removes files older than a week from the cache` => number {
  @acceptanceCriteria.add({ behavior = `Returns how many files were removed` });
}
```

## Before you publish a layer

- It extends exactly the role trait it fills.
- It sets the members its role declares.
- `provides` and `requires` name every capability it gives and needs.
- Every criterion is a rule that holds for every unit, not for one unit.
- Knowledge files sit inside the package, and none is a URL.
- `elfie check --strict` passes on a project that uses it.
