module.exports = function f (chords) {
  const examples = {
    notesToMidi: [
      {
        code: () => {
          const result = chords.notesToMidi(['C', 'C#', 'D'])
          return result // skip
        },
        expect: [60, 61, 62]
      }, {
        code: () => {
          const result = chords.notesToMidi(['C', 'C#', 'D'],
            { defaultOctave: 3 })
          return result // skip
        },
        expect: [48, 49, 50]
      }
    ],
    degreesToMidi: [
      {
        code: () => {
          const result = chords.degreesToMidi([1, 'b2', 2])
          return result // skip
        },
        expect: [60, 61, 62]
      }, {
        code: () => {
          const result = chords.degreesToMidi(
            [1, 'b2', 2],
            {
              defaultOctave: 0,
              shift: 60
            })
          return result // skip
        },
        expect: [60, 61, 62]
      }
    ],
    chordToMidi: [
      {
        code: () => {
          const result = chords.chordToMidi({ name: 'CM7' })
          return result // skip
        },
        expect: [60, 64, 67, 71]
      }, {
        code: () => {
          const result = chords.chordToMidi({
            name: 'CM7',
            defaultOctave: 3
          })
          return result // skip
        },
        expect: [48, 52, 55, 59]
      }, {
        code: () => {
          const result = chords.chordToMidi({ name: 'C#m7' })
          return result // skip
        },
        expect: [61, 64, 68, 71]
      }
    ],
    nashvilleToMidi: [
      {
        code: () => {
          // CM7 chord (default is to produce 7th chords)
          const options = { name: 1 }
          const result = chords.nashvilleToMidi(options)
          return result // skip
        },
        expect: [60, 64, 67, 71]
      }, {
        code: () => {
          /* An extension of the nashville number concept:
             this will be an #1^M7 chord, in the key of C */
          const options = { name: '#1' }
          const result = chords.nashvilleToMidi(options)
          return result // skip
        },
        expect: [61, 65, 68, 72]
      }, {
        code: () => {
          // 1 chord, major scale (just a C major triad)
          const options = { name: 1, scale: 'M' }
          const result = chords.nashvilleToMidi(options)
          return result // skip
        },
        expect: [60, 64, 67]
      }, {
        code: () => {
          /* scale is superfluous (and ignored) when the
             chord type is specified */
          const options = { name: '2^m7b5', scale: 'notAScale' }
          const result = chords.nashvilleToMidi(options)
          return result // skip
        },
        expect: [62, 65, 68, 72]
      }, {
        code: () => {
          // 3 chord, major scale
          const options = { name: 3, scale: 'm' }
          const result = chords.nashvilleToMidi(options)
          return result // skip
        },
        expect: [64, 68, 71]
      }
    ]
  }

  return { examples: examples }
}
