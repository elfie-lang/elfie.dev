#!/usr/bin/env bash
# The verifier command `elfie compile` and `elfie verify` run once per batch: Claude Code, given
# the review request on standard input, with the Elfie agent server and the claude.ai Figma
# connector, and permission to read and to build and test, through the Elfie server's command tools
# or bun, never to edit or write. ELFIE_ROOT, ELFIE_BATCH, ELFIE_UNITS, ELFIE_MCP_CONFIG, and
# ELFIE_COMMAND_TOOLS are set by the caller; the root is the working directory. ELFIE_MCP_CONFIG
# names the config of the session the compile hosts for this run, whose elfie_report takes each
# verdict as it is judged; without it, as when run by hand, the agent server is the one .mcp.json
# starts, which has no elfie_report, and the verdicts are read from standard output instead.
set -e
# The MCP tools are loaded up front rather than deferred behind a tool search, and no MCP server
# but the elfie server and the claude.ai Figma connector is started (scripts/mcp-settings.py), so
# their tools are the first thing the agent sees to reach for. --strict-mcp-config is not used,
# because it would drop the connector, which no --mcp-config can name.
export ENABLE_TOOL_SEARCH=false
# claude -p starts MCP servers without waiting; wait for the agent server so its tools are there
# from the first turn.
export CLAUDE_CODE_MCP_PREWAIT_SERVERS=elfie
export CLAUDE_CODE_MCP_PREWAIT_SERVERS_MS=30000
# A command tool may wait in its directory's queue and then run a build or a test for up to 30
# minutes before the server stops it, so a tool call is given 40 minutes rather than the default.
export MCP_TOOL_TIMEOUT=2400000
# Without elfie_report the whole report must fit in the final response, and a large batch has
# hundreds of criteria, so the response may be longer than the default limit allows.
export CLAUDE_CODE_MAX_OUTPUT_TOKENS=64000
mcp="${ELFIE_MCP_CONFIG:-.mcp.json}"
settings=$(python3 -I scripts/mcp-settings.py "$mcp")
# Definitions are read only through the agent server, which answers for an entity, a name, or a
# file at once; reading or searching def/ and vendor/ by hand is denied. Generated code stays open
# to Read and Grep, for the helpers no marker names. Figma is read to compare the design against,
# through its read-only tools.
figma="mcp__claude_ai_Figma__whoami mcp__claude_ai_Figma__get_design_context mcp__claude_ai_Figma__get_metadata mcp__claude_ai_Figma__get_screenshot"
figma="$figma mcp__claude_ai_Figma__get_variable_defs mcp__claude_ai_Figma__get_code_connect_map"
# ELFIE_COMMAND_TOOLS names the command tools the hosted session offers, such as
# `elfie_build elfie_test elfie_lint`: each runs the target's command in this run's directory, one
# at a time. When it names any, the verifier needs no shell at all, so Bash is denied outright;
# when it is empty or unset, as with an older binary or a run by hand, bun test, bun run build,
# and bun run typecheck are allowed through Bash.
if [ -n "${ELFIE_COMMAND_TOOLS:-}" ]; then
  allowed="Read Glob Grep mcp__elfie__* $figma"
  denied="Bash"
else
  allowed="Read Glob Grep Bash(bun test:*) Bash(bun run build:*) Bash(bun run typecheck:*) mcp__elfie__* $figma"
  denied=""
fi
# ELFIE_SESSION is the agent session id the compile or verify gives this run, and ELFIE_RESUME, set
# only on the review after a retry that answered a violation, the session of the verifier's run
# before it. Resuming keeps what the first review already read, so the second does not read it all
# again; its review request is still given on standard input. A resumed session keeps its id. The
# session is resumed only when its file is in Claude Code's project store and is under 20 MB; a
# missing file (the run before died first) or a larger one (too long to continue) falls back to a
# fresh session under ELFIE_SESSION. With neither set, as when run by hand, Claude Code starts a
# session of its own.
store="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/projects"
session=()
if [ -n "${ELFIE_RESUME:-}" ] && f=$(find "$store" -maxdepth 2 -name "$ELFIE_RESUME.jsonl" -size -20M -print -quit 2>/dev/null) && [ -n "$f" ]; then
  session=(--resume "$ELFIE_RESUME")
elif [ -n "${ELFIE_SESSION:-}" ]; then
  session=(--session-id "$ELFIE_SESSION")
fi
echo "session: ${session[*]:-none}" >&2
# ELFIE_VERIFIER_MODEL, an operator's setting, picks the model, as --model takes it (an alias such
# as opus or sonnet, or a full model name); unset or empty, Claude Code's default is used.
model=()
if [ -n "${ELFIE_VERIFIER_MODEL:-}" ]; then
  model=(--model "$ELFIE_VERIFIER_MODEL")
fi
echo "verifying batch ${ELFIE_BATCH:-?} (${ELFIE_UNITS:-?}) with Claude Code" >&2
exec claude -p \
  "${session[@]}" "${model[@]}" \
  --permission-mode default \
  --allowedTools "$allowed" \
  --disallowedTools "Read(./def/**)" "Read(./vendor/**)" "mcp__plugin_figma_figma" ${denied:+"$denied"} \
  --settings "$settings" --mcp-config "$mcp" \
  --append-system-prompt "$(cat scripts/verifier-prompt.md)"
