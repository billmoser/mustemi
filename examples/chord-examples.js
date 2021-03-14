import { chords } from '../index.js' // you should use: from 'mustemi'

let result

// This produces all 12 chromatics using node names rather than scale degrees
let notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
result = chords.notesToMidi(notes)
console.log('ex 1:', result)

// The default octave is 4, but you can specify other octaves for
// for individual notes, as in this example
result = chords.notesToMidi(['C:3', 'D#:2', 'E'])
console.log('ex 2:', result)

// In addition, you can change the default octave
result = chords.notesToMidi(['C', 'D#:2', 'E:4'], {defaultOctave: 3})
console.log('ex 3:', result)

// Here, we produce the midi notes for a C major 7th chord.
result = chords.chordToMidi({name: 'CM7'})
console.log('ex 4:', result)

// And here, an Db major chord, in the 5th octave
result = chords.chordToMidi({name: 'Db:5'})
console.log('ex 5:', result)

// Most common chord types are supported.
result = Object.keys(chords.chordDegrees)
console.log('ex 6:', result)

// If you don't find the one you want, or just want to introduce a
// shorthand for a particular type of chord, just add it
// to the 'chordDegrees' object at runtime
chords.chordDegrees['M7/3rd'] = [-4, 1, 3, 5, 7]
result = chords.chordToMidi({name: 'CM7/3rd'})
console.log('ex 7:', result)
