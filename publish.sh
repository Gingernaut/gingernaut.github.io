#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

if [[ "${TRACE-0}" == "1" ]]; then
    set -o xtrace
fi

if [[ "${1-}" =~ ^-*h(elp)?$ ]]; then
    echo 'Usage: ./publish.sh

Description:
    Builds the Vitepress site and pushes the build artifacts to the master branch.
    This script replaces the old deploy.sh and uses native git commands.

Options:
    -h, --help          Show this help message and exit

Environment Variables:
    TRACE=1             Enable debug tracing

Examples:
    ./publish.sh
'
    exit 0
fi

cd "$(dirname "$0")"

function main() {
    # Get the current remote URL to ensure we push to the right place
    local remote_url
    remote_url=$(git remote get-url origin)

    echo "Building the site..."
    pnpm run docs:build

    echo "Preparing build artifacts..."
    # Navigate into the build output directory
    cd docs/.vitepress/dist

    # Copy CNAME if it exists in the root
    if [[ -f ../../../CNAME ]]; then
        echo "Copying CNAME..."
        cp ../../../CNAME .
    fi

    echo "Deploying to ${remote_url}..."
    git init
    git add -A
    git commit -m 'deploy'

    # Force push to the master branch
    git push -f "${remote_url}" master:master

    echo "Successfully published to GitHub Pages!"
}

main "$@"
