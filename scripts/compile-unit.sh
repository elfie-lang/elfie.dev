#!/usr/bin/env bash
# The compiler command `elfie compile` runs once per batch: Claude Code, given the request on
# standard input, with the Elfie agent server and the claude.ai Figma connector, and permission to
# edit files, to build and test through the Elfie server's command tools or bun, and to run bun
# install and bun add. ELFIE_ROOT, ELFIE_BATCH, ELFIE_UNITS, ELFIE_MCP_CONFIG, and
# ELFIE_COMMAND_TOOLS are set by the caller; the root is the working directory. ELFIE_MCP_CONFIG
# names the config of the session the compile hosts for this run; without it, as when run by hand,
# the agent server is the one .mcp.json starts.
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
mcp="${ELFIE_MCP_CONFIG:-.mcp.json}"
settings=$(python3 -I scripts/mcp-settings.py "$mcp")
# Definitions are read only through the agent server, which answers for an entity, a name, or a
# file at once; reading or searching def/ and vendor/ by hand is denied, and so is editing them.
# Generated code is read through elfie_output and elfie_search, but stays open to Read and Grep.
# Figma is read-only: its tools that write to a Figma file are never allowed, and only its asset
# URLs may be fetched by hand.
figma="mcp__claude_ai_Figma__whoami mcp__claude_ai_Figma__get_design_context mcp__claude_ai_Figma__get_metadata mcp__claude_ai_Figma__get_screenshot"
figma="$figma mcp__claude_ai_Figma__get_variable_defs mcp__claude_ai_Figma__get_code_connect_map mcp__claude_ai_Figma__get_libraries"
figma="$figma mcp__claude_ai_Figma__search_design_system mcp__claude_ai_Figma__get_motion_context mcp__claude_ai_Figma__download_assets"
figma="$figma Bash(curl * https://www.figma.com/api/mcp/asset/*)"
# ELFIE_COMMAND_TOOLS names the command tools the hosted session offers, such as
# `elfie_build elfie_test elfie_lint`: each runs the target's command in this run's directory, one
# at a time. When it names any, bun run build, bun run typecheck, and bun test are not allowed
# through Bash; when it is empty or unset, as with an older binary or a run by hand, they are.
# bun install and bun add are allowed either way, because no tool runs the install command, and a
# dependency is added only by the target's add command. Bash itself is never put in
# --disallowedTools, since a deny rule would also block them; under -p a Bash command no allow rule
# matches is denied, because no one can be asked.
if [ -n "${ELFIE_COMMAND_TOOLS:-}" ]; then
  allowed="Read Edit Write Glob Grep Bash(bun install:*) Bash(bun add:*) mcp__elfie__* $figma"
else
  allowed="Read Edit Write Glob Grep Bash(bun install:*) Bash(bun add:*) Bash(bun run build:*) Bash(bun run typecheck:*) Bash(bun test:*) mcp__elfie__* $figma"
fi
# ELFIE_SESSION is the agent session id the compile gives this run, and ELFIE_RESUME, set only on a
# retry after a rejected outcome or a review that found a violation, the session of the compiler's
# run before it. Resuming keeps what the first attempt already read, so the retry does not read it
# all again; the retry's request, with the problems appended, is still given on standard input. A
# resumed session keeps its id, which is why the compile passes the same ELFIE_RESUME to every
# later retry. The session is resumed only when its file is in Claude Code's project store and is
# under 20 MB; a missing file (the run before died first) or a larger one (too long to continue)
# falls back to a fresh session under ELFIE_SESSION. With neither set, as when run by hand, Claude
# Code starts a session of its own.
store="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/projects"
session=()
if [ -n "${ELFIE_RESUME:-}" ] && f=$(find "$store" -maxdepth 2 -name "$ELFIE_RESUME.jsonl" -size -20M -print -quit 2>/dev/null) && [ -n "$f" ]; then
  session=(--resume "$ELFIE_RESUME")
elif [ -n "${ELFIE_SESSION:-}" ]; then
  session=(--session-id "$ELFIE_SESSION")
fi
echo "session: ${session[*]:-none}" >&2
# ELFIE_COMPILER_MODEL, an operator's setting, picks the model, as --model takes it (an alias such
# as opus or sonnet, or a full model name); unset or empty, Claude Code's default is used.
model=()
if [ -n "${ELFIE_COMPILER_MODEL:-}" ]; then
  model=(--model "$ELFIE_COMPILER_MODEL")
fi
echo "compiling batch ${ELFIE_BATCH:-?} (${ELFIE_UNITS:-?}) with Claude Code" >&2
exec claude -p \
  "${session[@]}" "${model[@]}" \
  --permission-mode acceptEdits \
  --allowedTools "$allowed" \
  --disallowedTools "Read(./def/**)" "Read(./vendor/**)" "mcp__plugin_figma_figma" "Edit(./def/**)" "Edit(./vendor/**)" "Edit(./elfie.json)" \
  --settings "$settings" --mcp-config "$mcp" \
  --append-system-prompt "$(cat scripts/compiler-prompt.md)"
