#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

if [[ "${TRACE-0}" == "1" ]]; then
    set -o xtrace
fi

if [[ "${1-}" =~ ^-*h(elp)?$ ]]; then
    echo 'Usage: ./run_test.sh [OPTIONS]

Description:
    Runs the project test suite using pnpm.

Options:
    -w, --watch         Run tests in watch mode
    -h, --help          Show this help message and exit

Environment Variables:
    TRACE=1             Enable debug tracing

Examples:
    ./run_test.sh
    ./run_test.sh --watch
'
    exit 0
fi

cd "$(dirname "$0")"

function main() {
    local watch_mode=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            -w|--watch)
                watch_mode=true
                shift
                ;;
            *)
                shift
                ;;
        esac
    done

    echo "Starting test suite..."
    if [[ "$watch_mode" == "true" ]]; then
        pnpm run test:watch
    else
        pnpm run test
    fi
}

main "$@"
