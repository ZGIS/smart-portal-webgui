#!/usr/bin/env bash

pwd

# have shpinx docs ready here

mkdir -p ghdash

cp -r api-docs config/internal/index.html _coverage sphinx-build ghdash

touch ghdash/.nojekyll
touch ghdash/sphinx-build/.nojekyll

ls -lh ghdash
