/**
 * This module prodives a few helper functions for the other modules
 * @module utils
 */

const sharpNotes = ['B#', 'C#', 'D', 'D#', 'E', 'E#', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const flatNotes = ['C', 'Db', 'D', 'Eb', 'Fb', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'Cb']

const specs = {
  note: '(?<note>([A-G]([b#]{0,1})){1})',
  degree: '(?<degree>[b#]*[0-9]+)',
  type: '(?<type>([a,c-z,A-Z,0-9,/][a-z,A-Z,0-9,#,/]*){0,1})',
  nType: '((\\^(?<type>([a,c-z,A-Z,0-9,/][a-z,A-Z,0-9,#,/]*))){0,1})',
  octave: '((:(?<octave>(-{0,1}[0-9].*))){0,1})',
  qualifiers: '(?<qualifiers>[b#]*)(?<base>[0-9]+)'
}

const res = {
  note: new RegExp(specs.note + specs.octave),
  degree: new RegExp(specs.degree + specs.octave),
  chord: new RegExp(specs.note + specs.type + specs.octave),
  nashvilleChord: new RegExp(specs.degree + specs.nType + specs.octave),
  qualifiers: new RegExp(specs.qualifiers)
}

/**
 * What is chromatic number of a note (such as 'C', 'D#', or 'Ab') in the chromatic scale?
 * @param {string} note The note to compute the chromatic number of
 * @returns {number} the integer index into the chromatic scale
 * @static
 */
function noteIndex (note) {
  let result = sharpNotes.indexOf(note)
  if (result < 0) result = flatNotes.indexOf(note)
  return result
}

/**
 * Parses a note specification such as 'C#:3' into a *note* and an *octave*
 * @param {string} spec <note name>[:<octave>]
 * @returns {Object} the *note* name and the *octave*
 * @static
 */
function parseNote (spec) {
  const { groups: { note, octave } } = res.note.exec(spec)
  return { note, octave }
}

/**
 * Parses a degree specification such as '1:5' into a *degree* and an *octave*
 * @param {string|number} spec <degree>[:<octave>]
 * @returns {Object} the *degree* and the *octave*
 * @static
 */
function parseDegree (spec) {
  if (Number.isInteger(spec)) return { degree: spec }
  const { groups: { degree, octave } } = res.degree.exec(spec)
  return { degree, octave }
}

/**
 * Parses a chord specification such as 'C#7b5:3' into an object
 * @param {string}  spec <note name>[<chord type>][:<octave>]
 * @returns {Object} *note*: the name of the note, eg 'C#'; *type*:
 * the chord type, eg '7b5'; and the chord's *octave*
 * @static
 */
function parseChord (spec) {
  const { groups: { note, type, octave } } = res.chord.exec(spec)
  return { note, type, octave }
}

/**
 * Parse a nashville chord specification such as '1', or '2^M7:3',
 * or even '#bb##2^dim:5'
 * @param {string} spec <degree>[^<chord type>][:<octave>]
 * @returns {Object} *nashNum*: the chord number; *offset*: number
 *   of half-steps from the chord number determined by the leading sharp/flat
 *   designators; *type*: the chord type, eg '7b5'; and the chord's *octave*
 * @static
 */
function parseNashvilleChord (spec) {
  const { groups: { degree, type, octave } } = res.nashvilleChord.exec(spec)
  const { base: nashNum, offset } = resolveQualifiers(degree)
  return { nashNum, offset, type, octave }
}

/**
 * Resolve a sequence of sharp/flat symbols into an integer *offset* from the
 * *base* degree.
 * @param {string} spec [<#/b>...<#/b>]<base>
 * @returns {Object} the *base and the *offset*
 * @static
 */
function resolveQualifiers (spec) {
  if (Number.isInteger(spec)) return { base: spec, offset: 0 }
  // eslint-disable-next-line
  let { groups: { qualifiers, base } } = res.qualifiers.exec(spec)
  base = parseInt(base)
  const offset = (qualifiers.match(/#/g) || []).length -
    (qualifiers.match(/b/g) || []).length
  return { base, offset }
}

export {
  noteIndex,
  parseDegree,
  parseNote,
  parseChord,
  parseNashvilleChord,
  resolveQualifiers
}
