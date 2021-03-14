import { core } from '../index.js' // you should use: from 'mustemi'

let result

// Set middle C octave.  By default this is 4, but your setup might require it to be 3
//core.setOrigin(3)

// Chromatic numbers of the major scale
result = core.scaleChromatics['Ionian']
console.log('ex 1:', result)

// Chromatic numbers of the 3rd mode mode
result = core.scaleChromatics['Phrygian']
console.log('ex 2:', result)

// Chromatics for a dominant 7th chord (relative to major scale),
// shifted (again by default) so that middle C is 60
result = core.chromatics([1, 3, 5, 'b7']) // relative scale is Ionian
console.log('ex 3:', result)

// Result is all 12 notes of  the western scale, starting at middle C
let degrees = ['1', '#1', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7']
result = core.chromatics(degrees, {scale: 'Ionian'})
console.log('ex 4:', result)
