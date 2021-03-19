/**
 * This module provides functions to map scale degrees to chromatic numbers
 * suitable for MIDI use.  A few basic scales are provided as well (modes of
 * the major scale, as well as the harmonic minor scale).  You may add other
 * scales you need to the *scaleChromatics* map at runtime.
 * @module core
 * @examples test/data/examples/core-examples.js
 */

import * as utils from './utils.js'

// all indices are 0-based unless otherwise noted
// scale degrees are 1-based
// scales are zero-based, 0-11

/**
 * Determines location of middle C (default is middle C = 60)
 * @static
 */
const origin = {
  octave: 4,
  shift: 12
}

/**
 * Map of scale name -> chromatic degrees of scale
 * @static
 */
const scaleChromatics = { Chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] }

/**
 * Number of degrees in western chromatic scale
 * @static
 */
const numChromatics = scaleChromatics.Chromatic.length

/**
 * Add a named scale to the set of available scales
 * @param {string} name name of scale
 * @param {Array.<(string|number)>} degrees list of ascending scale degrees
 *                   (see {@link module:core.chromatic})
 * @param {string} relativeScale scale to which *degrees* are relative
 * @static
 */
function addScale (name, degrees, relativeScale = 'Ionian') {
  const chromaticDegrees = chromatics(degrees, {
    scale: relativeScale,
    octave: 0,
    shift: 0
  })
  scaleChromatics[name] = chromaticDegrees
}

/**
 * Sets octave which will yield middle C = 60
 * @param {int} octave the octave for middle C
 * @static
 */
function setOrigin (octave) {
  origin.octave = octave
  origin.shift = (5 - octave) * 12
}

/**
 * What is the chromatic number for this scale degree?
 * @param {string|number} degree format is '[#|b]\<int\>', where \<int\> is
 *                          a 1-based scale degree
 * @param {Object=} options defaults are {scale='Ionian', octave=origin.octave,
 *                          shift=origin.shift}
 * @param {string=} options.scale name of scale to use
 * @param {number=}    options.octave default octave for notes with no designation
 * @param {number=}    options.shift an integer used to shift the value up or down
 *                          on the number line
 * @returns {number} the chromatic number
 * @static
 */
function chromatic (degree,
  { scale = 'Ionian', octave = origin.octave, shift = origin.shift } = {}) {
  //
  const chromas = scaleChromatics[scale]
  // let d = parseInt(degree)
  const { base, offset } = utils.resolveQualifiers(degree)
  let d = base - 1 // make it zero-based
  const negativeDegree = (d < 0)

  // figure out octave d is in
  const dPrev = d
  const scaleLength = chromas.length
  d = d % scaleLength
  if (negativeDegree && (d !== 0)) {
    d = scaleLength + d
  }
  let dOct = (dPrev - d) / scaleLength
  if (negativeDegree) {
    dOct = (d - dPrev) / scaleLength
    dOct = -dOct
  }
  let result = chromas[d]
  result += offset
  result += ((octave + dOct) * numChromatics)
  result += shift
  return result
}

/**
 * What are the chromatic numbers for *degrees* in a given scale?
 * @param {Array.<(string|int)>}  degrees see {@link module:core.chromatic}
 * @param {Object=} options see {@link module:core.chromatic}
 * @returns {number[]} the chromatic numbers
 * @static
 */
function chromatics (degrees, options) {
  const result = []
  for (const degree of degrees) {
    result.push(chromatic(degree, options))
  }
  return result
}

/* ----------------------------  module-private ---------------------------- */

/*
 * Creates an initial set of scales, including the modes of the major scale
 */
function _initialize () {
  const modeNames = ['Ionian', 'Dorian', 'Phrygian', 'Lydian',
    'Mixolydian', 'Aeolian', 'Locrian']

  // set up Ionian scale
  addScale(modeNames[0], [1, 3, 5, 6, 8, 10, 12], 'Chromatic')

  // create modes of the major scale
  for (let i = 1; i < modeNames.length; i++) {
    const prev = scaleChromatics[modeNames[i - 1]]
    const delta = prev[1] - prev[0]
    const n = prev.length
    const arr = []
    for (let j = 1; j < n; j++) {
      arr.push(prev[j] - delta + 1)
    }
    arr.push(prev[0] - delta + 12 + 1)
    addScale(modeNames[i], arr, 'Chromatic')
  }

  addScale('Major', [1, 2, 3, 4, 5, 6, 7])
  addScale('Minor', [1, 2, 'b3', 4, 5, 6, 'b7'])
  addScale('Harmonic Minor', [1, 2, 'b3', 4, 5, 'b6', 7])
}

_initialize()

export {
  origin,
  scaleChromatics,
  addScale,
  setOrigin,
  chromatic,
  chromatics
}
