# smart-portal-webgui [![OpenHUB](https://www.openhub.net/p/smart-portal-webgui/widgets/project_thin_badge.gif)](https://www.openhub.net/p/smart-portal-webgui) [![Build Status](https://travis-ci.org/ZGIS/smart-portal-webgui.svg?branch=master)](https://travis-ci.org/ZGIS/smart-portal-webgui)

## SMART Portal Web Frontend license

Copyright (C) 2011-2017 Interfaculty Department of Geoinformatics, University of
Salzburg (Z_GIS) & Institute of Geological and Nuclear Sciences Limited (GNS Science)
in the SMART Aquifer Characterisation (SAC) programme funded by the New Zealand
Ministry of Business, Innovation and Employment (MBIE)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

## development, testing and dist/prod builds

```shell

# install the whole bunch into node_modules
# no need for typings install, @types npm packages are the new hype in ts2
npm install

// Build DLL first, run this once after adding new package
npm run build:dll

# get started immediately, webpack-dev-server manages everything etc
npm run start

# mean as linter rules
npm run tslint

# check webpack configs
npm run webpack-validate:dev

npm run webpack-validate:test

# webpack will work but this config check will possibly fail, see config file
npm run webpack-validate:prod

# chrome selenium webdriver update for protractor (and karma)
npm run webdriver:update

# on Arch Linux, otherwise PhantomJS doesn't start properly / wrong QT libs something ..
unset QT_QPA_PLATFORM 

# karma/jsmine tests, webpack loads all up behind the scenes, no tsc precompile necessary
npm test

# if you don't have the npm run start going or the local web server in dist on port 8080, run this
npm run e2e:ci

# or if you have an npm run start open in another shell
npm run e2e

# building the dist export, pure file export to be hosted on a web server
npm run build

# check with a local http server
python -m http.server 8000 --bind 127.0.0.1

# or

npm run http-server -p 8080 ./dist
```
