yarn run lint && yarn run generate
cp CNAME dist/
echo "# Autogenerated by Nuxt. Code is on the 'dev' branch" > dist/README.md
$(npm bin)/push-dir --dir=dist --branch=master --cleanup