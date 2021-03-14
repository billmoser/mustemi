[![Travis CI w/ Logo](https://travis-ci.org/billmoser/mustemi.svg?branch=main)](https://travis-ci.org/billmoser/mustemi)
[![CodeCov](https://codecov.io/gh/billmoser/mustemi/branch/main/graph/badge.svg)](https://codecov.io/gh/billmoser/mustemi)
[![codebeat badge](https://codebeat.co/badges/11522fef-973b-41d8-b1ea-70da1c3cb292)](https://codebeat.co/projects/github-com-billmoser-mustemi-main)
[![Generic badge](https://img.shields.io/badge/docs-GHpages-blue.svg)](https://billmoser.github.io/mustemi/)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![Known Vulnerabilities](https://snyk.io/test/github/billmoser/mustemi/badge.svg?targetFile=package.json)](https://snyk.io/test/github/billmoser/mustemi?targetFile=package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

* [MUSTEMI - MUSic ThEory for MIdi applications](#mustemi-music-theory-for-midi-applications)
* [Installation](#installation)
* [Basic Examples](#basic-examples)
* [Chord Examples](#chord-examples)
* [Nashville Number System](#nashville-number-system)
* [MIDI examples](#midi-examples)
* [Simple MIDI chord arpeggiator](#simple-midi-chord-arpeggiator)


<a name="mustemi-music-theory-for-midi-applications"></a>
## MUSTEMI - MUSic ThEory for MIdi applications
This package provides the means to produce Midi note numbers from either numeric degrees relative to a given scale, note names (eg 'C', 'Eb'), chord names (eg 'Cm7b5'), or Nashville numbers.  There are examples for each of these given below, as well as a couple of examples of using this package with
a midi controller and a DAW.  This package can be used both in a node application and in the browser.

<a name="installation"></a>
## Installation

```sh
npm install mustemi
```

<a name="basic-examples"></a>
## Basic Examples
These demonstrate how to use the package to produce MIDI note numbers from
scale degrees.
```javascript
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

```

<a name="chord-examples"></a>
## Chord Examples
In these examples, you'll see how to do the same for named chords.
```javascript
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

```

<a name="nashville-number-system"></a>
## Nashville Number System
These examples show how to produce MIDI note numbers from Nashville notation.
```javascript
import { chords } from '../index.js' // you should use: from 'mustemi'

let result

// You can use the Nashville Number system to specify
// chords.  The defaults produce 7th chords in the key of C.
// This gets the midi notes for a CM7 chord in the 3rd octave
result = chords.nashvilleToMidi({name: 1})
console.log('ex 1:', result)

// Here's an example producing a C major triad in the 3rd octave
result = chords.nashvilleToMidi({name: '1:3', scale:'M'})
console.log('ex 2:', result)

// This produces the notes for the 3 chord of the minor scale.
// It will be a 7th chord, and key is still C
result = chords.nashvilleToMidi({name: 3, scale:'m7'})
console.log('ex 3:', result)

// This produces the notes for the 3 chord of the harmonic minor scale.
// The Key is now D, and we're producing triads
result = chords.nashvilleToMidi({name: 3, scale:'hm', key: 'D'})
console.log('ex 4:', result)

// You can also specify a chord type explicitly.  This will override
// the default for the scale in use
result = chords.nashvilleToMidi({name: '2^M7:3', scale:'m7'})
console.log('ex 5:', result)

```

<a name="midi-examples"></a>
# MIDI examples
Here's a simple example of using the package to output MIDI for consumption
by a DAW or some other MIDI-aware sound engine such as Kontakt Player.  This
uses a few basic midi utilities in the *examples* directory of this package.
Your OS will need to have a way to open a virtual MIDI device.  On the platform I'm using, Windows 10, this is made possible by using a 3rd-party
tool such as the one I use:
 [LoopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html)
```javascript
import midi from 'midi'
import * as mu from './midiutils.js'
import { core, chords } from '../index.js' // you should use: from 'mustemi'

// use this to see what port number you need to open
mu.showDevices()

// open the output port
const port = new midi.Output()
port.openPort(1)

let opts = {
  start: 0,
  interval: 200,
  duration: 150,
}

var nums, len = 0
nums = [60,62,64,65,67,69,71]
len = mu.play(port, nums, {...opts, text: "Ascending C major scale, Raw MIDI"}) 

nums = core.chromatics([8,7,6,5,4,3,2,1])
len = mu.play(port, nums, {...opts, start: len, text: "Descending Ionian (C major) scale, degrees"})

nums = core.chromatics([1,2,3,4,5,6,7,8,7,6,5,4,3,2,1], {scale: 'Dorian'})
len = mu.play(port, nums, {...opts, start: len + 200, text: "Dorian scale, degrees"})


opts = {
  start: 0,
  interval: 50,
  duration: 150
}

let names = ['CM7', 'Dm7', 'Em7', 'FM7', 'G7', 'Am7', 'Bm7b5', 'CM7:5']
for (const i in names) {
  const name = names[i]
  nums = chords.chordToMidi({name: name})
  len = mu.play(port, nums, {...opts, start: len + 200, text: name + ' chord'})
}

let root = 'D'
for (let i=1; i<=8; i++) {
  const name = (i===8)? '1:5': i
  nums = chords.nashvilleToMidi({name: name, root: root})
  len = mu.play(port, nums, {...opts, start: len + 200, 
    text: 'Nashville ' + name + ' chord, ' + root + ' scale'})
}

```

<a name="simple-midi-chord-arpeggiator"></a>
# Simple MIDI chord arpeggiator
In this example, we take input from a MIDI keyboard, and output arpeggios rooted at the notes received from the keyboard.
```javascript
import midi from 'midi'
import * as mu from './midiutils.js'
import { core, chords } from '../index.js' // you should use: from 'mustemi'

// my daw is Ableton, so middle C is in octave 3
core.setOrigin(3)

// use this to see what port number you need to open
mu.showDevices()

/*
 * Open the output port - on my windows box, this is a loopMIDI device.
 * In my daw, I place a midi instrument on a track, and then set the
 * track input to this loopMIDI device
 */
const port = new midi.Output()
port.openPort(1)


/*
 * Set up to read midi note-on messages from the input device, 
 * and write the transformation (notes object) to the output device
 */
let degrees = [1, 3, 5, 7] // degrees for a Majur 7th chord
let opts = { 
  start: 0, //start playing when the message is received
  interval: 100, //  arpeggiate the notes (100 millisecs between them)
  duration: 150 // duration of each note is 150 milliseconds
}

// create the midi input object
const input = new midi.Input()

// when a note is recieved, play an M7 arpeggio rooted at that note
input.on('message', (deltaTime, message) => {
  if ((message[0]===144) && (message[2] > 0)) {
    let midiNoteNumber = message[1]
    /*
     * the notes will take the input degrees, and shift them so that
     * the root is the midiNoteNumber
     */
    let notes = chords.degreesToMidi(degrees, {shift: midiNoteNumber, defaultOctave: 0})
    mu.play(port, notes, {...opts, velocity: message[2], text: 'MIDI note ' + midiNoteNumber})
  }
});
 
// open the port associated with the midi keyboard
input.openPort(4);

```