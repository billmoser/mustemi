/**
 * This module provides functions for producing lists of MIDI note
 * numbers from scale degrees, note names, or nashville numbers.
 * @module chords
 * @examples test/data/examples/chords-examples.js
 */

import * as core from './core.js'
import * as utils from './utils.js'

/**
 * degrees for each type relative to major scale, user can add more
 * @type {Object(string, Array.<(string|number)>)}
 * @static
 */
const chordDegrees = {
  '': [1, 3, 5], // major chord doean't require a designation
  M: [1, 3, 5],
  Dom: [1, 3, 5],
  m: [1, 'b3', 5],
  '+': [1, 3, '#5'],
  b5: [1, 3, 'b5'],
  dim: [1, 'b3', 'b5'],
  aug: [1, '3', '#5'],
  sus4: [1, 4, 5],
  sus2: [1, 2, 5],
  M6: [1, 3, 5, 6],
  m6: [1, 'b3', 5, 6],
  7: [1, 3, 5, 'b7'],
  Dom7: [1, 3, 5, 'b7'],
  M7: [1, 3, 5, 7],
  m7: [1, 'b3', 5, 'b7'],
  mM7: [1, 'b3', 5, 7],
  '+7': [1, 3, '#5', 'b7'], // augmented 7th chord, aka augmented minor 7th chord
  '+M7': [1, 3, '#5', 7], // augmented major 7th chord
  dim7: [1, 'b3', 'b5', 6],
  '7b5': [1, 3, 'b5', 'b7'],
  m7b5: [1, 'b3', 'b5', 'b7'],
  add9: [1, 3, 5, 9]
}

/**
 * triad and 7th types for major and minor scales
 * @type {Object(string, string[])}
 * @static
 */
const nashvilleChordTypes = {
  M: ['M', 'm', 'm', 'M', 'M', 'm', 'dim'],
  m: ['m', 'dim', 'M', 'm', 'm', 'M', 'M'],
  hm: ['m', 'dim', 'aug', 'm', 'M', 'M', 'dim'],
  M7: ['M7', 'm7', 'm7', 'M7', '7', 'm7', 'm7b5'],
  m7: ['m7', 'm7b5', 'M7', 'm7', 'm7', 'M7', '7'],
  hm7: ['mM7', 'm7b5', '+7', 'm7', '7', 'M7', 'dim7']
}

/**
 * What are the MIDI note numbers for the *degrees*?
 * @param {Array.<(string|number)>} degrees list of scale degrees
 * @param {Object} options {octave(default octave), shift(where is middle C)}
 * @returns {number[]} array of MIDI note numbers for *degrees*
 * @static
 */
function degreesToMidi (degrees,
  { root = 'C', scale, defaultOctave, shift = core.origin.shift } = {}) {
  //
  const rootIdx = utils.noteIndex(root)
  const result = []
  for (const spec of degrees) {
    let { degree, octave } = utils.parseDegree(spec) // eslint-disable-line
    octave = (octave === undefined) ? defaultOctave : parseInt(octave)
    result.push(core.chromatic(degree, { scale, octave, shift: shift + rootIdx }))
  }
  return result
}

/**
 * What are the MIDI note numbers for the list of *notes*?
 * @param {string[]} notes
 * @param {Object=} options {octave(default octave), shift(where is middle C)}
 * @returns {number[]} array of MIDI note numbers
 * @static
 */
function notesToMidi (notes, { defaultOctave } = {}) {
  const result = []
  for (const spec of notes) {
    let { note, octave } = utils.parseNote(spec) // eslint-disable-line
    octave = (octave === undefined) ? defaultOctave : parseInt(octave)
    const degree = utils.noteIndex(note) + 1
    const scale = 'Chromatic'
    result.push(core.chromatic(degree, { scale, octave }))
  }
  return result
}

/**
 * What are the MIDI note numbers for the *name*d chord (such as 'C#7b5',
 * or 'BM7:3')?
 * @param {Object=} options { name = <chord name>, scale = 'Ionian',
 *   defaultOctave = origin.octave }
 * @returns {number[]} array of MIDI note numbers
 * @static
 */
function chordToMidi ({ name, scale, defaultOctave }) {
  let { note, type, octave } = utils.parseChord(name) // eslint-disable-line
  octave = (octave === undefined) ? defaultOctave : parseInt(octave)
  const shift = core.origin.shift + utils.noteIndex(note)
  const degrees = chordDegrees[type || ''] // relative to major scale
  const result = core.chromatics(degrees, { scale, octave, shift })
  return result
}

/**
 * What are the MIDI note numbers for the *name*d Nashville chord
 * (such as '1', '4^7:3')?
 * @param {Object} options  { name = <chord name>, key = 'C', scale = 'M7' }
 * @returns {number[]} array of MIDI note numbers
 * @static
 */
function nashvilleToMidi ({ name, key = 'C', defaultOctave, scale = 'M7' }) {
  // eslint-disable-next-line
  let { nashNum, offset, type, octave } = utils.parseNashvilleChord(name)
  octave = (octave === undefined) ? defaultOctave : parseInt(octave)
  type = type || nashvilleChordTypes[scale][nashNum - 1]
  // relative to major scale
  const degrees = chordDegrees[type]
  // will shift all degrees by nashNum's chromatic degree
  const shift = core.origin.shift + utils.noteIndex(key) +
    core.chromatic(nashNum, { octave: 0, shift: 0 }) + offset
  const result = core.chromatics(degrees, { scale: 'Ionian', octave, shift })
  return result
}

export {
  chordDegrees,
  degreesToMidi,
  notesToMidi,
  chordToMidi,
  nashvilleToMidi
}
