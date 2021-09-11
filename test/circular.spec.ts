import { AsyncCircularSeries, CircularSeries } from '../src'
import { describe, it } from 'mocha'
import { expect } from 'chai'

describe('async circular series', () => {
  it('asynchronous', async () =>
    await testAsync(AsyncCircularSeries.of(1, 2, 3))
  )
})

describe('circular series', () => {
  it('asynchronous', async () =>
    await testAsync(new CircularSeries([1, 2, 3]))
  )
  it('synchronous', () =>
    test(CircularSeries.of(1, 2, 3))
  )
})

const evaluate =
  (ctx: { index: number }, value: number): boolean => (
    expect(value).to.be.eq([1, 2, 3][ctx.index++ % 3]),
    ctx.index === 255
  )

const test = (source: Iterable<number>): void => {
  const ctx: { index: number } = { index: 0 }
  for (const value of source)
    if (evaluate(ctx, value))
      break
}

const testAsync = async (source: AsyncIterable<number> | Iterable<number>): Promise<void> => {
  const ctx: { index: number } = { index: 0 }
  for await (const value of source)
    if (evaluate(ctx, value))
      break
}
