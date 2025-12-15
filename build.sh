#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_FILE="$SCRIPT_DIR/BlueScope.alfredworkflow"

rm -f "$OUTPUT_FILE"

cd "$SCRIPT_DIR/Workflow"
zip -r "$OUTPUT_FILE" . -x "*.DS_Store"

echo "Built: $OUTPUT_FILE"
