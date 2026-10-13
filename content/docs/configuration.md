## elfie.json

```json title="elfie.json"
{
  "name": "elfie.dev",
  "source": "def",
  "dependencies": {
    "bun": { "root": "vendor/bun" },
    "nextjs": { "root": "vendor/nextjs" },
    "react": { "root": "vendor/react" }
  },
  "compiler": "scripts/compile-unit.sh",
  "verifier": "scripts/verify-unit.sh"
}
```

| Key | Type | Default | Meaning |
| --- | --- | --- | --- |
| `name` | string | The root directory's name | The project's name. |
| `source` | string | `def` | Where your definitions live, relative to the root. Every `.lfy` file under it is in the program. |
| `dependencies` | object | none | Packages, each as `"name": { "root": "path" }`. The name is what `use` refers to. |
| `compiler` | string | none | The command `elfie compile` runs for each batch. Without one, requests are written to files. |
| `verifier` | string | none | The command that reviews each accepted batch. Without one, nothing is reviewed. |

Keys `elfie` doesn't read are ignored, so a manifest written for another version or another tool still loads. A key it does read with a value of the wrong kind is a problem.

`elfie` finds the project by looking for `elfie.json` in the current directory and then each directory above it. `--root` overrides that.

## What the compiler and verifier receive

The command runs in the project root (or in its batch's copy of the project, with `--jobs`), with the request on standard input and these variables set:

| Variable | Holds |
| --- | --- |
| `ELFIE_ROOT` | The project root. |
| `ELFIE_BATCH` | The batch's identifier, such as `main+1`. |
| `ELFIE_UNITS` | The stems of the batch's units. |
| `ELFIE_MCP_CONFIG` | An MCP config for this run's session of the agent server. |
| `ELFIE_COMMAND_TOOLS` | The command tools that session offers, such as `elfie_build elfie_test`. |
| `ELFIE_SESSION` | A fresh id for the agent session. |
| `ELFIE_RESUME` | On a retry, the session of the run before, so it can be resumed. |
| `ELFIE` | The path of the `elfie` binary running the compile. |

### Starter template variables

The starter compiler and verifier scripts read two more variables. `elfie` doesn't set them; you do.

| Variable | Holds |
| --- | --- |
| `ELFIE_COMPILER_MODEL` | The model the compiler script runs, such as `opus`, `sonnet`, or a full model name. Unset uses the agent's default. |
| `ELFIE_VERIFIER_MODEL` | The model the verifier script runs. Unset uses the agent's default. |

## Files Elfie writes

| Path | Holds | Commit it? |
| --- | --- | --- |
| `elfie-compile/maps/<target>/<stem>.json` | The source map of each unit: its outputs, regions, and hashes. | Yes |
| `elfie-compile/reviews/<target>/<stem>.json` | The verifier's verdicts for each unit. | Yes |
| `elfie-compile/cache/` | Batch copies and kept work. Deleting it costs only time. | No |
| `elfie-requests/compile.log` | Everything each compile printed. | Your choice |
| `elfie-requests/<batch>.blocked.md` | Why a batch was blocked. | Your choice |
| `elfie-requests/<batch>.reviews.json` | The latest review of a batch. | Your choice |
| `elfie-requests/global.reviews.json` | The latest global review. | Your choice |

## .mcp.json

To give interactive agents the same tools the compiler has, register the agent server:

```json title=".mcp.json"
{
  "mcpServers": {
    "elfie": { "command": "elfie", "args": ["mcp"] }
  }
}
```
