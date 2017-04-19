#!/usr/bin/env bash

pwd

mkdir -p ghdash

cp -r api-docs config/internal/index.html _coverage ghdash

touch ghdash/.nojekyll

ls -lh ghdash
