#!/usr/bin/env bash
# Starts the Elfie agent server for the project at the repository root, preferring the binary
# that is compiling (ELFIE, set by elfie compile) over the elfie on the PATH, so that the server
# answers from the same build as the compile that hosts it.
# Its output passes through mcp-compat.py, which adds the tools/list fields newer clients require.
cd "$(dirname "$0")/.."
if [ -n "$ELFIE" ] && [ -x "$ELFIE" ]; then exec python3 -I scripts/mcp-compat.py "$ELFIE" mcp --root .; fi
exec python3 -I scripts/mcp-compat.py elfie mcp --root .
