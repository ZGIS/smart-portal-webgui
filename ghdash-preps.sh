#!/usr/bin/env bash

pwd

ls -lh dist coverage

# can have shpinx docs ready here

mkdir -p ghdash

cp -r api-docs config/internal/index.html coverage sphinx-build ghdash

ls -lh ghdash
