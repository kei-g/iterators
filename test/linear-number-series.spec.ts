import { EvenNumberSeries, LinearNumberSeries, OddNumberSeries } from '../src'
import { describe, it } from 'mocha'
import { equal } from 'node:assert'

describe('even number series', () =>
  it('always even', () => {
    let i = 0
    for (const even of EvenNumberSeries()) {
      equal(even % 2n, 0n)
      if (i++ === 255)
        break
    }
  })
)

describe('linear number series', () => {
  it('with initial value', () => {
    let i = 0
    for (const value of new LinearNumberSeries({ initial: -1n })) {
      equal(value, -1n + BigInt(i))
      if (i++ === 255)
        break
    }
  })
  it('with slope', () => {
    let i = 0
    for (const value of new LinearNumberSeries({ slope: 3n })) {
      equal(value, BigInt(i) * 3n)
      if (i++ === 255)
        break
    }
  })
})

describe('odd number series', () =>
  it('always odd', () => {
    let i = 0
    for (const odd of OddNumberSeries()) {
      equal(odd % 2n, 1n)
      if (i++ === 255)
        break
    }
  })
)
