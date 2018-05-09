npm run generate
cp CNAME dist/
cp README.md dist/
$(npm bin)/push-dir --dir=dist --branch=master --allow-unclean