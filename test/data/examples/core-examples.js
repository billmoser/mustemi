module.exports = function f (core) {
  const examples = {
    scaleChromatics: [
      {
        code: () => {
          const result = core.scaleChromatics.Ionian
          return result // skip
        },
        expect: [0, 2, 4, 5, 7, 9, 11]
      }
    ],
    chromatic: [
      {
        code: () => {
          // midi note for middle C
          const result = core.chromatic(1)
          return result // skip
        },
        expect: 60
      }
    ],
    chromatics: [
      {
        code: () => {
          // midi notes for a CM7 chord
          const result = core.chromatics([1, 3, 5, 7])
          return result // skip
        },
        expect: [60, 64, 67, 71]
      }
    ]
  }

  return { examples: examples }
}
