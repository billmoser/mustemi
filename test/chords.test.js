import { describe, expect, test } from '@jest/globals'
import { chords } from '../index.js'

describe('#./src/chords.js', () => {
  test('core.nashvilleToMidi', () => {
    let outcome, expectation

    outcome = chords.notesToMidi(['C', 'C#', 'D'])
    expectation = [60, 61, 62]
    expect(outcome).toStrictEqual(expectation)

    outcome = chords.notesToMidi(['C', 'C#', 'D'], {
      defaultOctave: 3
    })
    expectation = [48, 49, 50]
    expect(outcome).toStrictEqual(expectation)

    outcome = chords.degreesToMidi([1, 'b2', 2])
    expectation = [60, 61, 62]
    expect(outcome).toStrictEqual(expectation)

    outcome = chords.degreesToMidi([1, 'b2', 2], {
      defaultOctave: 0,
      shift: 60
    })
    expectation = [60, 61, 62]
    expect(outcome).toStrictEqual(expectation)

    outcome = chords.chordToMidi({ name: 'CM7' })
    expectation = [60, 64, 67, 71]
    expect(outcome).toStrictEqual(expectation)

    outcome = chords.chordToMidi({
      name: 'CM7',
      defaultOctave: 3
    })
    expectation = [48, 52, 55, 59]
    expect(outcome).toStrictEqual(expectation)

    outcome = chords.chordToMidi({ name: 'C#m7' })
    expectation = [61, 64, 68, 71]
    expect(outcome).toStrictEqual(expectation)

    outcome = chords.nashvilleToMidi({ name: 1 })
    expectation = [60, 64, 67, 71]
    expect(outcome).toStrictEqual(expectation)

    outcome = chords.nashvilleToMidi({
      name: 1,
      defaultOctave: 3
    })
    expectation = [48, 52, 55, 59]
    expect(outcome).toStrictEqual(expectation)

    outcome = chords.nashvilleToMidi({ name: '1^M7:4' })
    expectation = [60, 64, 67, 71]
    expect(outcome).toStrictEqual(expectation)
  })
})
