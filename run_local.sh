#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

if [[ "${TRACE-0}" == "1" ]]; then
    set -o xtrace
fi

if [[ "${1-}" =~ ^-*h(elp)?$ ]]; then
    echo 'Usage: ./run_local.sh [OPTIONS]

Description:
    Runs the local development server using pnpm.

Options:
    -h, --help          Show this help message and exit

Environment Variables:
    TRACE=1             Enable debug tracing

Examples:
    ./run_local.sh
'
    exit 0
fi

cd "$(dirname "$0")"

function main() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            *)
                shift
                ;;
        esac
    done

    echo "Starting local development server..."
    pnpm run docs:dev
}

main "$@"
