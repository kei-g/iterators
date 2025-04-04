import assert, { equal } from 'node:assert'
import { SingleIterable } from '../src'
import { describe, it } from 'mocha'

describe('single', () => {
  it('is able to perform as Iterable', () => {
    for (const value of new SingleIterable(1))
      equal(value, 1)
  })
  it('does not iterate in surplus', () => {
    let count = 0
    for (const value of new SingleIterable(true)) {
      assert(value)
      count++
    }
    equal(count, 1)
  })
})
