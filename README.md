# smart-portal-webgui 

## Build and Dependencies

[![Build Status][build-status-badge]][build-status-url]
[![Issues][issues-badge]][issues-url]

[![NPM Master Dependencies](https://david-dm.org/ZGIS/smart-portal-webgui/status.svg)](https://david-dm.org/ZGIS/smart-portal-webgui)
[![NPM Master DevDependencies](https://david-dm.org/ZGIS/smart-portal-webgui/dev-status.svg)](https://david-dm.org/ZGIS/smart-portal-webgui?type=dev)

[![License][license-badge]][license-url]
[![OpenHUB](https://www.openhub.net/p/smart-portal-webgui/widgets/project_thin_badge.gif)](https://www.openhub.net/p/smart-portal-webgui)

<p><a href="https://api.travis-ci.org/repos/ZGIS/smart-portal-webgui/builds.atom"><img src="https://upload.wikimedia.org/wikipedia/en/4/43/Feed-icon.svg" align="left" height="32" width="32" alt="Builds Feed"></a></p>

[Site Docs](https://zgis.github.io/smart-portal-webgui/)

[build-status-badge]: https://img.shields.io/travis/ZGIS/smart-portal-webgui.svg?style=flat-square
[build-status-url]: https://travis-ci.org/ZGIS/smart-portal-webgui
[issues-badge]: https://img.shields.io/github/issues/ZGIS/smart-portal-webgui.svg?style=flat-square
[issues-url]: https://github.com/ZGIS/smart-portal-webgui/issues
[license-badge]: https://img.shields.io/badge/License-Apache%202-blue.svg?style=flat-square
[license-url]: LICENSE


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
# if yo uhave existing nodel_mudles folder 'npm prune && npm cache clean' or just delete that folder
npm install

// Build DLL first, run this once after adding new package
npm run build:dll

# get started immediately, webpack-dev-server manages everything etc
npm run start

# alternatively 
npm run start:dll

# mean as linter rules
npm run tslint

# chrome selenium webdriver update for protractor (and karma)
npm run webdriver:update

# on Arch Linux, otherwise PhantomJS doesn't start properly / wrong QT libs something ..
unset QT_QPA_PLATFORM 

# karma tests, webpack loads all up behind the scenes, no tsc precompile necessary
npm test (or 'npm run test:ci')

# protractor end-to-end tests, builds and starts a local web server in dist on port 8080
# from now on you need to start the selenium server first (tests with firefox and chrome)
npm run webdriver:start

# E2E Angular Just-In-Time build
npm run e2e:ci:jit

# same for E2E Angular AOT build
npm run e2e:ci

# building the dist export, pure file export can be hosted on a web server
# JIT build
npm run build:jit

# AOT build
npm run build

# check with a local http server
npm run http-server -p 8080 ./dist

# to build the sphinx user documentation you need python 3.x Sphinx and sphinx_rtd_theme
# test with 'sphinx-build -b html src/docs/source sphinx-build'
npm run build:sphinx-docs
```
