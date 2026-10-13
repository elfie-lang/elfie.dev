## Declaring a target

A target is an `ace const` whose value is a `Target`. The const's name is the target's identifier, and the CLI, the maps folder, and the agent tools all use it.

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

`targetOf` gives a record written in braces the type `Target`. A trait that takes arguments goes in a slot as a layer: `Python.cpython.layer("3.12")`.

## Slots

| Slot | How many | What it says | Examples |
| --- | --- | --- | --- |
| `output` | 1 | The directory everything is written under. | `"out/hello"` |
| `language` | 1 | What the code is written in. | `typescript`, `python`, `rust` |
| `runtime` | 0–1 | What runs the code, when the platform doesn't. | `bun`, `node`, `cpython("3.12")` |
| `platforms` | any | Where the code runs. | `posix`, `windows`, `browser` |
| `ecosystem` | 0–1 | Where dependencies come from. | `bunPackages`, `npm`, `uv`, `cargo` |
| `frameworks` | any | What the code is built on. | `react`, `nextjs(root)`, `argparse`, `clap` |
| `interfaces` | any | What it offers people and programs. | `website`, `restApi`, `commandLine` |
| `layout` | 1 | Where each unit's files go. | `npmLayout`, `uvScript`, `cargoWorkspace` |
| `layers` | any | Anything else, such as a house style. | Your own layers |
| `dependencies` | any | Packages the generated code needs. | `{ name = "zod", version = "^4" }` |

A layer in the wrong slot is reported at the const. Dependencies need an ecosystem.

## Presets

Packages can offer an `ace function` that fills in the slots for you. This site is built with the Next.js preset:

```lfy title="def/targets.lfy"
use "bun";
use "nextjs" as NextJS;

ace const mainApp: `Elfie.dev main app` = NextJS.app({
  root = `apps/main`,
  runtime = bun,
  ecosystem = bunPackages,
});

global@targets.add(mainApp);
```

`NextJS.app` sets the language to TypeScript, the platforms to POSIX and browsers, the frameworks to Next.js and React, and the interfaces to a website and a REST API. It also adds `next`, `react`, `react-dom`, and `zod` as dependencies.

## Choosing what gets built

Each entity is built for the targets in its own `@targets`. If that list is empty, it uses its file's list, and if that's empty too, it uses `global`'s.

```lfy
global@targets.add(mainApp);
```

```lfy title="def/tools/cleanup.lfy"
@targets.add(tools);
```

```lfy
cleanup@targets.add(tools);
```

Traits, `ace` declarations, and anything declared in a package are never built. A member, a parameter, or an enum member is built with its owner.

## Rules for one target

Criteria on a target const are guidance for every unit built for it:

```lfy title="def/targets.lfy"
mainApp
  @acceptanceCriteria
  .add({ behavior = `Favicon is [[favicon]]` });
```

:::callout warning Guidance isn't reviewed
A target's criteria, and those of its layers, are rules the compiler follows for every unit. No unit answers for them and the verifier doesn't review them. When something must be checked, put it on an entity, or in `global`'s criteria.
:::

## Capabilities

Layers say what they provide and what they require, as plain strings. `elfie check` reports a requirement that no layer of the target provides.

| Layer | Provides | Requires |
| --- | --- | --- |
| `bun` | `javascript-runtime`, `node-api` | `javascript-language` |
| `nextjs(root)` | `http-server`, `html-pages`, `css-modules` | `react`, `node-api`, `npm-registry`, `browser` |
| `commandLine` | | `process`, `argument-parser` |
| `argparse` | `argument-parser` | `python` |

That's why the greeter above lists `argparse`: `commandLine` needs an argument parser.

## Commands

Layers name a shell command for each operation they support: install, add, build, test, lint, format, and run. The compiler runs the build, test, and lint commands, and they must pass with no warnings before the work is accepted. The `uv` layer, for example, tests with `uv run --with pytest pytest` and lints with `uvx ruff check . && uvx pyright`. See [Custom compile targets](/docs/custom-compile-targets) to write your own.

## Several targets

A project can declare any number of targets. Each needs its own `output` directory, and no output may sit inside another's. Pass `--target name` to `elfie compile` or `elfie verify` to work on one.

## Bundled packages

| Package | Layers and traits |
| --- | --- |
| `typescript` | `typescript`, `npmLayout(name, root)` |
| `python` | `python`, `cpython(version)`, `uv`, `uvScript(file)`, `uvProject(name, root)`, `argparse` |
| `rust` | `rust`, `cargo`, `cargoCrate(...)`, `cargoWorkspace(...)`, `clap` |
| `lfy` | `elfie`, `lfyPackage(root)`, for targets whose output is Elfie |
| `bun` | `bun`, `bunPackages` |
| `node` | `node` |
| `npm` | `npm`, `pnpm`, `yarn` |
| `react` | `react`, `component` |
| `nextjs` | `nextjs(root)`, `app(settings)` |
| `http` | `website`, `restApi`, `page(path)`, `endpoint(method, path)` |
| `cli` | `commandLine`, `command(name)` |
| `platforms` | `posix`, `windows`, `browser` |
