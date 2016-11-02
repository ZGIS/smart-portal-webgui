#!/usr/bin/env bash

APPNAME=$(cat package.json | grep "name" | sed "s/\"name\":\ \"\(.*\)\",$/\1/g" | sed "s/\ //g")
APPVERSION=$(cat package.json | grep "version" | sed "s/\"version\":\ \"\(.*\)\",$/\1/g" | sed "s/\ //g")

pwd

ls -lh dist config/docker

mv dist config/docker/html-source

ls -lh config/docker/

cd config/docker/ && test -f Dockerfile && tar -cvzf ${APPNAME}-${TRAVIS_BUILD_NUMBER}-docker.tgz *

ls -lh . config/docker/
