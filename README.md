[![Travis](https://img.shields.io/travis/silentroach/twic.svg?style=flat-square&label=travis)](https://travis-ci.org/silentroach/twic)
[![AppVeyor](https://img.shields.io/appveyor/ci/silentroach/twic.svg?style=flat-square&label=appveyor)](https://ci.appveyor.com/project/silentroach/twic)
[![Coveralls](https://img.shields.io/coveralls/silentroach/twic.svg?style=flat-square&label=coverage)](https://coveralls.io/r/silentroach/twic)
[![David](https://img.shields.io/david/silentroach/twic.svg?style=flat-square&label=deps)](https://david-dm.org/silentroach/twic)
[![David](https://img.shields.io/david/dev/silentroach/twic.svg?style=flat-square&label=dev-deps)](https://david-dm.org/silentroach/twic#info=devDependencies)

Twitter client written with [ES6](https://babeljs.io) and [React](http://facebook.github.io/react).

## Contribute

Feel free to help me build awesome Twitter client.

### Localization

All translation files are in [src/base/i18n](/src/base/i18n) folder in simple format.

### Develop

All you need to start develop is to install [Node.js](https://nodejs.org) and run:

	# npm install
	# npm run watch

It will install all dependencies and then will build development sources to `build` folder and will start to watch all the code changes.

Please respect the [EditorConfig](http://editorconfig.org) project settings and `eslint` rules.

### Test

We use [Mocha](http://mochajs.org) and [Karma](http://karma-runner.github.io) to test code.

To check your contribution code you need just to run

	# npm run test

Also it will run automatically on `git push` by pre-push hook.
