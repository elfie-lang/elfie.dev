#!/usr/bin/env bash
# Checks the definitions: every file binds with no problems and every unit's outputs are up to
# date.
cd "$(dirname "$0")/.."
set -e
elfie check --strict
