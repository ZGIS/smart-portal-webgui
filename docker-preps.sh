#!/usr/bin/env bash

pwd

APPVERSION=$(cat package.json | grep "version" | sed "s/\"version\":\ \"\(.*\)\",$/\1/g" | sed "s/\ //g")

if [ $TRAVIS_BRANCH == "master" ]; then
  APPNAME=webnzgwhub
  cp config/docker/nginx.conf.nzgwhub config/docker/nginx.conf
else
  APPNAME=$(cat package.json | grep "name" | sed "s/\"name\":\ \"\(.*\)\",$/\1/g" | sed "s/\ //g")
  cp config/docker/nginx.conf.dev config/docker/nginx.conf
fi

ls -lh dist config/docker

mv dist config/docker/html-source

mv sphinx-build config/docker/html-source/docs

ls -lh config/docker/

cd config/docker/ && test -f Dockerfile && tar -cvzf ${APPNAME}-${TRAVIS_BUILD_NUMBER}-docker.tgz *

ls -lh
