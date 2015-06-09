[![Travis](https://img.shields.io/travis/silentroach/twic.svg?style=flat-square&label=travis)](https://travis-ci.org/silentroach/twic)
[![AppVeyor](https://img.shields.io/appveyor/ci/silentroach/twic.svg?style=flat-square&label=appveyor)](https://ci.appveyor.com/project/silentroach/twic)
[![David](https://img.shields.io/david/silentroach/twic.svg?style=flat-square&label=deps)](https://david-dm.org/silentroach/twic)
[![David](https://img.shields.io/david/dev/silentroach/twic.svg?style=flat-square&label=dev-deps)](https://david-dm.org/silentroach/twic#info=devDependencies)

Twitter client written with [ES6](https://babeljs.io) and [React](http://facebook.github.io/react).

## Inside

Project is written in ES6 + Stylus.

## Contribute

Feel free to help me build awesome Twitter client.

### Localization

All translation files are in [src/base/i18n](/src/base/i18n) folder in simple JSON format.

### Develop (currently broken for day or two)

All you need to start develop is to install [Node.js](https://nodejs.org) and run:

	# npm install
	# npm run dev

It will install all dependencies, build development sources and start to watch changes.

Please respect the [EditorConfig](http://editorconfig.org) project settings and eslint rules.

### Test

We use [Mocha](http://mochajs.org) and [Karma](http://karma-runner.github.io) to test code.

To check your contribution code you need just to run

	# npm run test
