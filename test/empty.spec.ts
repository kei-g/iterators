import { EmptyIterable } from '../src/index.ts'
import { describe, it } from 'mocha'
import { equal } from 'node:assert'

describe('empty', () => {
  it('never yielded', () => {
    let neverBecomesTrue = false
    for (const value of new EmptyIterable())
      neverBecomesTrue = value === value
    equal(neverBecomesTrue, false)
  })
})
