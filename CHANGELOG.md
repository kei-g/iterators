# ChangeLogs

## Version 1.1.14

- :arrow_up: Packages for development are bumped
  - `@typescript-eslint/eslint-plugin` is bumped from 5.48.1 to 5.48.2
  - `@typescript-eslint/parser` is bumped from 5.48.1 to 5.48.2
  - `esbuild` is bumped from 0.17.0 to 0.17.4
  - `rimraf` is bumped from 4.0.5 to 4.1.1

## Version 1.1.13

- :arrow_up: Packages for development are bumped
  - `esbuild` is bumped from 0.16.17 to 17.0.0
  - `eslint` is bumped from 8.31.0 to 8.32.0
  - `rimraf` is bumped from 4.0.4 to 4.0.5

## Version 1.1.12

- :arrow_up: Packages for development are bumped
  - `@types/node` is bumped from 18.11.17 to 18.11.18
  - `@typescript-eslint/eslint-plugin` is bumped from 5.47.0 to 5.48.1
  - `@typescript-eslint/parser` is bumped from 5.47.0 to 5.48.1
  - `esbuild` is bumped from 0.16.10 to 0.16.17
  - `eslint` is bumped from 8.30.0 to 8.31.0
  - `rimraf` is bumped from 3.0.2 to 4.0.4

## Version 1.1.11

- :sparkles: AsyncIterator interface is implemented on LazyIterator
- :green_heart: CI/CD is improved
- :recycle: Cyclomatic complexities are reduced
- :memo: Documents are updated
- :arrow_up: Packages for development are bumped
  - `@types/chai` is bumped from 4.2.22 to 4.3.4
  - `@types/mocha` is bumped from 9.0.0 to 10.0.1
  - `@types/node` is bumped from 16.11.7 to 18.11.17
  - `@typescript-eslint/eslint-plugin` is bumped from 5.3.1 to 5.47.0
  - `@typescript-eslint/parser` is bumped from 5.3.1 to 5.47.0
  - `chai` is bumped from 4.3.4 to 4.3.7
  - `esbuild` is bumped from 0.13.13 to 0.16.10
  - `eslint` is bumped from 8.2.0 to 8.30.0
  - `mocha` is bumped from 9.1.3 to 10.2.0
  - `ts-node` is bumped from 10.4.0 to 10.9.1
  - `typescript` is bumped from 4.4.4 to 4.9.4
- :bug: Symbols are wrapped by String()

## Version 1.1.10

- :building_construction: Migration from `terser` to `esbuild`
- :arrow_up: Packages for development are updated
  - `@types/node` is upgraded from 16.10.1 to 16.11.7
  - `@typescript-eslint/eslint-plugin` is upgraded from 4.32.0 to 5.3.1
  - `@typescript-eslint/parser` is upgraded from 4.32.0 to 5.3.1
  - `eslint` is upgraded from 7.32.0 to 8.2.0
  - `mocha` is upgraded from 9.1.2 to 9.1.3
  - `ts-node` is upgraded from 10.2.1 to 10.4.0
  - `typescript` is upgraded from 4.4.3 to 4.4.4

## Version 1.1.9

- :arrow_up: Packages for development are updated
  - `@types/chai` is upgraded from 4.2.21 to 4.2.22
  - `@types/node` is upgraded from 16.9.1 to 16.10.1
  - `@typescript-eslint/eslint-plugin` is upgraded from 4.31.0 to 4.32.0
  - `@typescript-eslint/parser` is upgraded from 4.31.0 to 4.32.0
  - `mocha` is upgraded from 9.1.1 to 9.1.2
  - `terser` is upgraded from 5.7.2 to 5.9.0
- :bug: 'lib/index.js' has been fallen out is made up for

## Version 1.1.8

- :sparkles: 'LazyIterable' class is implemented
- :arrow_up: Packages for development are updated
  - `@types/node` is upgraded from 16.7.5 to 16.9.1
  - `@typescript-eslint/eslint-plugin` is upgraded from 4.29.3 to 4.31.0
  - `@typescript-eslint/parser` is upgraded from 4.29.3 to 4.31.0
  - `typescript` is upgraded from 4.4.2 to 4.4.3
- :heavy_minus_sign: Some dependent packages are removed
  - `mkdirp` is removed
  - `uuid` is removed
- :green_heart: Target versions of Node.js for GitHub CI is updated

## Version 1.1.7

- :sparkles: 'take' function is implemented
- :sparkles: 'until' function is implemented
- :arrow_up: Packages for development are updated
  - `@types/node` is upgraded from 16.7.4 to 16.7.5
  - `mocha` is upgraded from 9.1.0 to 9.1.1

## Version 1.1.6

- :dizzy_face: The change log missing in the preceding release is complemented

## Version 1.1.5

- :wastebasket: ConcatenatedIterator is removed
- :white_check_mark: Coverage and Tests are added

## Version 1.1.4

- :memo: Link to Travis CI is corrected

## Version 1.1.3

- :hammer: Build scripts are optimized
- :memo: CHANGELOG.md is added
- :memo: CODE_OF_CONDUCT.md is added
- :sparkles: Copy constructor is added to Multiplexer
- :boom: Generic type of Multiplexer is changed to extend Record
- :green_heart: Github Action for CI
- :package: Keywords are added
- :arrow_up: Packages for development are updated
  - `@types/node` is upgraded from 16.7.2 to 16.7.4
  - `typescript` is upgraded from 4.3.5 to 4.4.2
- :memo: README is updated
  - Badged are relocated
  - 'installation' section is added
- :pushpin: Supported Node.js version is specified in 'engines' section

## Version 1.1.2

- :sparkles: Asynchronous concatenated iterator is implemented
- :sparkles: Circular series iterator is added
- :sparkles: Linear series iterator is added
- :sparkles: Multiple iterators is supported by concatenated iterator
- :sparkles: Multiplexer iterators are added
- :arrow_up: Packages for development are updated
  - `@types/node` is upgraded from 16.7.1 to 16.7.2
  - `@typescript-eslint/eslint-plugin` is upgraded from 4.29.2 to 4.29.3
  - `@typescript-eslint/parser` is upgraded from 4.29.2 to 4.29.3
  - `terser` is upgraded from 5.7.1 to 5.7.2
- :sparkles: Transformer iterators are added
- :wrench: `mkdirp` is installed
- :wrench: `npm-run-all` is installed

## Version 1.1.1

- :green_heart: .travis.yml is updated
- :memo: Badges are made to be recognizable by `detect-readme-badges`
- :wrench: Configuration files are updated
- :arrow_up: Packages for development are updated
  - `@types/node` is upgraded from 16.6.1 to 16.7.1
  - `ts-node` is upgraded from 10.2.0 to 10.2.1
- :boom: Target is changed from ES5 to ES6
- :wrench: `rimraf` is installed

## Version 1.1.0

- :truck: Badges are relocated
- :wrench: Configuration files are updated
- :lipstick: Linter option is updated
- :wrench: Migration from `uglify-js` to `terser`
- :arrow_up: Packages for development are updated
  - `@types/node` is upgraded from 16.3.0 to 16.6.1
  - `@typescript-eslint/eslint-plugin` is upgraded from 4.28.2 to 4.29.2
  - `@typescript-eslint/parser` is upgraded from 4.28.2 to 4.29.2
  - `eslint` is upgraded from 7.30.0 to 7.32.0
  - `ts-node` is upgraded from 10.0.0 to 10.2.0
- :see_no_evil: package-lock.json is removed

## Version 1.0.4

- :rotating_light: Linter is installed
- :arrow_up: Packages for development are updated
  - `@types/node` is upgraded from 16.0.0 to 16.3.0
- :sparkles: ZippedIterator is added

## Version 1.0.3

- :memo: Badges are updated
- :truck: File of entry point is renamed
- :hammer: Output file becomes to be compressed

## Version 1.0.2

- :package: Entry point is fixed

## Version 1.0.1

- :package: Classes are bundled into index.ts

## Version 1.0.0

- :tada: Initial release
