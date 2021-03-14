import { testAll } from 'examples-plugin-jsdoc'
import { core, chords } from '../index.js'

testAll([
  {
    examples: './test/data/examples/core-examples.js',
    module: core
  },
  {
    examples: './test/data/examples/chords-examples.js',
    module: chords
  }
])
