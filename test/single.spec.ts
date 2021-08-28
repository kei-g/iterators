import { SingleIterable } from '../src/index'
import { describe, it } from 'mocha'
import { expect } from 'chai'

describe('single', () => {
  it('is able to perform as Iterable', () => {
    for (const value of new SingleIterable(1))
      expect(value).to.be.eq(1)
  })
  it('does not iterate in surplus', () => {
    let count = 0
    for (const value of new SingleIterable(true)) {
      expect(value).to.be.true
      if (value)
        count++
    }
    expect(count).to.be.eq(1)
  })
})
