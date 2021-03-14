import { describe, expect, test } from '@jest/globals'
import { core } from '../index.js'

describe('#./src/core.js', () => {
  test('core.chromatic', () => {
    let outcome, expectation

    outcome = core.chromatic(1)
    expectation = 60
    expect(outcome).toBe(expectation)

    outcome = core.chromatic('b1')
    expectation = 59
    expect(outcome).toBe(expectation)

    outcome = core.chromatic('#1')
    expectation = 61
    expect(outcome).toBe(expectation)

    outcome = core.chromatic(0)
    expectation = 59
    expect(outcome).toBe(expectation)

    core.setOrigin(3)
    outcome = core.chromatic(1)
    expectation = 60
    expect(outcome).toBe(expectation)
  })
})
