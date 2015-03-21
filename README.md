# Twic <a href="https://github.com/silentroach/twic"><img align="right" src="https://cdn.rawgit.com/silentroach/twic/master/src/images/toolbar.svg" width="48px" /></a>

[![Travis](https://img.shields.io/travis/silentroach/twic.svg?style=flat-square)](https://travis-ci.org/silentroach/twic)
[![Code Climate](https://img.shields.io/codeclimate/github/silentroach/twic.svg?style=flat-square)](https://codeclimate.com/github/silentroach/twic)
[![David](https://img.shields.io/david/dev/silentroach/twic.svg?style=flat-square)](https://david-dm.org/silentroach/twic#info=devDependencies)

Twitter client for Chromium based browsers written with [ES6](https://babeljs.io/) and [React](http://facebook.github.io/react/).

## Inside

Project is written in ES6 + Stylus and transpiled to the code that is supported by current stable Chromium browsers.

It uses client-server architecture with Chrome messaging system to communicate. IndexedDB is used to store user data and Chrome Sync Storage is used to sync accounts list and user settings. Twitter authentication is partially based on Chrome Identity webflow. React is used as render engine for popup and options pages.

## Contribute

It is sad, but full project build is currently broken.
