import { chords } from '../index.js' // you should use: from 'mustemi'

let result

// You can use the Nashville Number system to specify
// chords.  The defaults produce 7th chords in the key of C.
// This gets the midi notes for a CM7 chord in the 3rd octave
result = chords.nashvilleToMidi({name: 1})
console.log('ex 1:', result)
// <= [ 60, 64, 67, 71 ]

// Here's an example producing a C major triad in the 3rd octave
result = chords.nashvilleToMidi({name: '1:3', scale:'M'})
console.log('ex 2:', result)
// <= [ 48, 52, 55 ]

// This produces the notes for the 3 chord of the minor scale.
// It will be a 7th chord, and key is still C
result = chords.nashvilleToMidi({name: 3, scale:'m7'})
console.log('ex 3:', result)
// <= [ 64, 68, 71, 75 ]

// This produces the notes for the 3 chord of the harmonic minor scale.
// The Key is now D, and we're producing triads
result = chords.nashvilleToMidi({name: 3, scale:'hm', key: 'D'})
console.log('ex 4:', result)
// <= [ 66, 70, 74 ]

// You can also specify a chord type explicitly.  This will override
// the default for the scale in use
result = chords.nashvilleToMidi({name: '2^M7:3', scale:'m7'})
console.log('ex 5:', result)
// <= [ 50, 54, 57, 61 ]
