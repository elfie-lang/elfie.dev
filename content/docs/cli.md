```text title="Usage"
elfie <command> [arguments] [--root <dir>] [--json]
```

## Options for every command

| Option | Effect |
| --- | --- |
| `--root <dir>` | The project directory. Defaults to the nearest directory at or above the current one that holds `elfie.json`. |
| `--json` | Print results as JSON lines, for scripts and agents. |
| `--color <choice>` | When to color output: `auto`, `always`, or `never`. Defaults to `auto`. |
| `--help`, `-h` | Print help. |
| `--version` | Print the version. |

## Commands

### init

Creates `elfie.json`, the `def/` source directory, and `elfie-compile/`, and adds `/elfie-compile/cache/` to `.gitignore`. The project is named after the argument, or after the directory when there is none. An existing `elfie.json` is left alone.

```bash
elfie init my-app
```

### check

Loads the project and prints every problem, then the number of files, problems, and stale units. A stale unit is one whose outputs are missing or out of date.

```bash
elfie check
elfie check --strict
elfie check --json
```

| Option | Effect |
| --- | --- |
| `--strict` | Fail on any warning, error, or stale unit. Use it in CI. |

```text title="--json output"
{"file":"def/main.lfy","message":"hello main: no output has been generated for it","severity":"warning","stage":"generation"}
```

### format

Rewrites source files in the standard layout. With `--check`, it only lists the files that would change, and fails if there are any.

```bash
elfie format
elfie format --check
```

### tree and tokens

Print how one file parses, as a tree of rules or as a list of tokens. Use them when syntax surprises you.

```bash
elfie tree def/main.lfy
elfie tokens def/main.lfy
```

### compile

Plans the units that need building, then runs the compiler on each batch and the verifier on what it accepts. With unit names, it compiles those units whether they are stale or not.

```bash
elfie compile
elfie compile main
elfie compile --dry-run
elfie compile --target hello --jobs 2
```

| Option | Effect |
| --- | --- |
| `--dry-run` | Print the plan and generate nothing. |
| `--all` | Request every unit, up to date or not. |
| `--target <name>` | Only the target named. |
| `--accept` | Check the outputs already on disk instead of running the compiler, and record them. |
| `--continue` | Keep running the batches that don't depend on a stopped one. |
| `--no-verify` | Don't run the verifier on accepted batches. |
| `--jobs <count>` | How many batches run the compiler, the verifier, or a target command at once. Defaults to 4. |

```text title="--dry-run output"
hello main fresh []
batch main [main]
```

Each plan line gives the target, the unit, and the reason it's planned. Each batch line gives the batch and its units. When `elfie.json` names no compiler, `compile` writes each batch's request to `elfie-requests/` instead.

### verify

Runs the verifier on outputs that were already recorded, compiling nothing.

```bash
elfie verify
elfie verify main --full
elfie verify --global
```

| Option | Effect |
| --- | --- |
| `--target <name>` | Only the target named. |
| `--global` | Review only the global criteria and tests. |
| `--full` | Review every criterion and test again, carrying no earlier verdict. |
| `--jobs <count>` | How many batches run at once. Defaults to 4. |

### lsp

Serves an editor over standard input and output with the Language Server Protocol.

```bash
elfie lsp
```

### mcp

Serves agents over standard input and output with the Model Context Protocol. See [Compiler details](/docs/compiler-details#the-agent-server) for the tools.

```bash
elfie mcp
```

### help and version

```bash
elfie help
elfie version
```

## Exit codes

| Code | Means |
| --- | --- |
| `0` | Done, with nothing to report. |
| `1` | Done, and problems were found or outputs were rejected. |
| `2` | The arguments could not be read. |
| `3` | Something the command relies on failed, such as a compiler command that could not run. |
