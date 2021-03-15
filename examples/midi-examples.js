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
len = mu.play(port, nums, {...opts,
  text: "Ascending C major scale, Raw MIDI"}) 

nums = core.chromatics([8,7,6,5,4,3,2,1])
len = mu.play(port, nums, {...opts, start: len,
  text: "Descending Ionian (C major) scale, degrees"})

nums = core.chromatics([1,2,3,4,5,6,7,8,7,6,5,4,3,2,1], {scale: 'Dorian'})
len = mu.play(port, nums, {...opts, start: len + 200,
  text: "Dorian scale, degrees"})


opts = {
  start: 0,
  interval: 50,
  duration: 150
}

let names = ['CM7', 'Dm7', 'Em7', 'FM7', 'G7', 'Am7', 'Bm7b5', 'CM7:5']
for (const i in names) {
  const name = names[i]
  nums = chords.chordToMidi({name: name})
  len = mu.play(port, nums, {...opts, start: len + 200,
    text: name + ' chord'})
}

let root = 'D'
for (let i=1; i<=8; i++) {
  const name = (i===8)? '1:5': i
  nums = chords.nashvilleToMidi({name: name, root: root})
  len = mu.play(port, nums, {...opts, start: len + 200, 
    text: 'Nashville ' + name + ' chord, ' + root + ' scale'})
}
