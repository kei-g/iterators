import { EmptyIterable } from '../src'
import { describe, it } from 'mocha'
import { expect } from 'chai'

describe('empty', () => {
  it('never yielded', () => {
    let neverBecomesTrue = false
    for (const value of new EmptyIterable())
      neverBecomesTrue = value === value
    expect(neverBecomesTrue).to.be.false
  })
})
