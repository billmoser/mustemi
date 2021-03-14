/**
 * This module prodives a few helper functions for the other modules
 * @module utils
 */

const sharpNotes = ['B#', 'C#', 'D', 'D#', 'E', 'E#', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const flatNotes = ['C', 'Db', 'D', 'Eb', 'Fb', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'Cb']

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
 * What is the base degree and the offset specified by the qualifiers?
 * @param {string|number} degree - must conform to degreeSpec
 * @returns {Object} *base* is the base degree; and *offset* is the computed offset
 * @static
 */
function resolveQualifiers (degree) {
  if (!isNaN(degree)) return { base: parseInt(degree), offset: 0 }
  let result
  const chars = degree.split('')
  let offset = 0
  for (let i = 0; i < chars.length && !result; i++) {
    const ch = chars[i]
    switch (ch) {
      case 'b':
        offset--
        break
      case '#':
        offset++
        break
      default:
        result = {
          base: parseInt(chars.slice(i).join('')),
          offset: offset
        }
    }
  }
  return result
}

export {
  noteIndex,
  resolveQualifiers
}
