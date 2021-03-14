import midi from 'midi'

// list midi devices available for writing.  Need to write to a virtual port,
// and have that device as the input in your daw!
function showGroup(type) {
  const group = (type==='w')? new midi.Output(): new midi.Input()
  const n = group.getPortCount()
  console.log((type==='w')? 'Available ports (write):': 'Available ports (read):')
  for (let i = 0; i < n; i++)
    console.log(i, '  "' + group.getPortName(i) + '"')
}

function showDevices() {
  showGroup('r')
  showGroup('w')
  console.log('')
}

// play a set of notes
function play(port, notes, {start=0, interval=500, duration=250, velocity=100, text=undefined} = {}) {
  setTimeout(() => {
    if (text) {
      console.log(text + ':')
      console.log('  playing (velocity=' + velocity +'):', notes, '\n')
    }
    for (let i=0; i<notes.length; i++) {
      setTimeout(() => {
        port.sendMessage([144, notes[i], velocity])
      }, i*interval)
      setTimeout(() => {
        port.sendMessage([128, notes[i], 0])
      }, i*interval + duration)
    }
  }, start)
  return start + notes.length * interval
}

export {
  showDevices,
  play
}