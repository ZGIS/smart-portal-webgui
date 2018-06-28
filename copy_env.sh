#!/usr/bin/env bash

# - test $TRAVIS_BRANCH == "master" || cp config/internal/.env.dev.travis .env
# - test $TRAVIS_BRANCH == "master" && cp config/internal/.env.nzgwhub.travis .env

if [ $TRAVIS_BRANCH == "master" ]; then
  cp config/internal/.env.nzgwhub.travis .env
else
  cp config/internal/.env.dev.travis .env
fi
