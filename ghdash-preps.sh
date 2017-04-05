#!/usr/bin/env bash

pwd

ls -lh dist coverage

# can have shpinx docs ready here

mkdir ghdash

cp -r internal/index.html coverage ghdash

ls -lh ghdash
