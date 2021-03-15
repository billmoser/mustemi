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
    let notes = chords.degreesToMidi(degrees,
      {shift: midiNoteNumber, defaultOctave: 0})
    mu.play(port, notes, {...opts, velocity: message[2],
      text: 'MIDI note ' + midiNoteNumber})
  }
});
 
// open the port associated with the midi keyboard
input.openPort(4);
