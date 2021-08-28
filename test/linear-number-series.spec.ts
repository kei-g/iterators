import { EvenNumberSeries, LinearNumberSeries, OddNumberSeries } from '../src/index'
import { describe, it } from 'mocha'
import { expect } from 'chai'

describe('even number series', () =>
  it('always even', () => {
    let i = 0
    for (const even of EvenNumberSeries()) {
      expect(even).to.satisfy((value: bigint) => value % 2n === 0n)
      if (i++ === 255)
        break
    }
  })
)

describe('linear number series', () => {
  it('with initial value', () => {
    let i = 0
    for (const value of new LinearNumberSeries({ initial: -1n })) {
      expect(value).to.be.eq(-1n + BigInt(i))
      if (i++ === 255)
        break
    }
  })
  it('with slope', () => {
    let i = 0
    for (const value of new LinearNumberSeries({ slope: 3n })) {
      expect(value).to.be.eq(BigInt(i) * 3n)
      if (i++ === 255)
        break
    }
  })
})

describe('odd number series', () =>
  it('always odd', () => {
    let i = 0
    for (const even of OddNumberSeries()) {
      expect(even).to.satisfy((value: bigint) => value % 2n === 1n)
      if (i++ === 255)
        break
    }
  })
)
