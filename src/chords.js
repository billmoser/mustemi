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
 * Parses the octave from a note or degree specification such as 'C#:3'
 * or '1:5' into an object.
 * @param {string|number} spec <note name|degree>[:<octave>]
 * @param {number=} defaultOctave octave to assume if none specified
 * @returns {Object} *name*: the note name or degree number, and the
 *  *octave*
 * @static
 */
function parseOctave (spec, defaultOctave) {
  const arr = ('' + spec).split(':')
  return {
    name: arr[0],
    octave: (arr[1] === undefined) ? defaultOctave : parseInt(arr[1])
  }
}

/**
 * Parses a chord specification such as 'C#7b5:3' into an object
 * @param {string}  spec <note name>[<chord type>][:<octave>]
 * @param {number=} defaultOctave default octave
 * @returns {Object} *note*: the name of the note, eg 'C#'; *type*:
 * the chord type, eg '7b5'; and the chord's *octave*
 * @static
 */
function parseChord (spec, defaultOctave) {
  const { name, octave } = parseOctave(spec, defaultOctave)
  const idx = ('b#'.indexOf(name.charAt(1)) >= 0) ? 2 : 1
  return {
    note: name.substring(0, idx), // e.g. 'C#'
    type: name.substring(idx), // e.g. '7b5'
    octave: octave
  }
}

/**
 * Parse a nashville chord specification such as '1', or '2^M7:3',
 * or even '#bb##2^dim:5'
 * @param {Object} options options
 * @param {string} options.spec <degree>[^<chord type>][:<octave>]
 * @param {number=} options.defaultOctave default octave
 * @param {string=} options.scale scale to use
 * @returns {Object} *nashvilleNumber*: the chord number; *offset*: number
 *   of half-stepsfrom the chord number determined by the leading sharp/flat
 *   designators; *type*: the chord type, eg '7b5', and the chord's *octave*
 * @static
 */
function parseNashvilleChord ({ spec, defaultOctave, scale }) {
  const { name, octave } = parseOctave(spec, defaultOctave)
  const arr = name.split('^')
  const { base, offset } = utils.resolveQualifiers(arr[0])
  const nashvilleNumber = base
  return {
    nashvilleNumber: nashvilleNumber,
    offset: offset,
    type: arr[1] || nashvilleChordTypes[scale][nashvilleNumber - 1],
    octave: octave
  }
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
  for (const degree of degrees) {
    const { name, octave } = parseOctave(degree, defaultOctave)
    result.push(core.chromatic(name, { scale: scale, octave: octave, shift: shift + rootIdx }))
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
  for (const note of notes) {
    const { name, octave } = parseOctave(note, defaultOctave)
    const degree = utils.noteIndex(name) + 1
    const scale = 'Chromatic'
    result.push(core.chromatic(degree, { scale: scale, octave: octave }))
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
  const { note, type, octave } = parseChord(name, defaultOctave)
  const shift = core.origin.shift + utils.noteIndex(note)
  const degrees = chordDegrees[type] // relative to major scale
  const result = core.chromatics(degrees, { scale: scale, octave: octave, shift: shift })
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
  const { nashvilleNumber, offset, type, octave } =
    parseNashvilleChord({ spec: name, defaultOctave, scale })
  const degrees = chordDegrees[type] // relative to major scale
  // will shift all degrees by nashNum's chromatic degree
  const shift = core.origin.shift + utils.noteIndex(key) +
    core.chromatic(nashvilleNumber, { octave: 0, shift: 0 }) + offset
  const result = core.chromatics(
    degrees,
    { scale: 'Ionian', octave: octave, shift: shift })
  return result
}

export {
  chordDegrees,
  parseOctave,
  parseChord,
  parseNashvilleChord,
  degreesToMidi,
  notesToMidi,
  chordToMidi,
  nashvilleToMidi
}
