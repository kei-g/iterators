import { AsyncMultiplexer, ConcatenatedAsyncIterable, Multiplexer } from '../src/index'
import { describe, it } from 'mocha'
import { expect } from 'chai'

describe('async multiplexer', () => {
  it('add asynciterable', async () => {
    const m = new AsyncMultiplexer<C>()
    m.add('a', ConcatenatedAsyncIterable.of(seriesOfA, []))
    m.add('b', seriesOfB)
    await validateAsync(m)
  })
  it('add non iterable', async () => {
    const m = new AsyncMultiplexer<C>()
    m.add('a', {
    } as Iterable<number>)
    m.add('b', seriesOfB)
    let caught: unknown
    await validateAsync(m).catch((err: unknown) => caught = err)
    expect(caught).to.not.undefined
  })
  it('fail if same key is added twice', () => {
    const m = new AsyncMultiplexer<C>()
    m.add('a', seriesOfA)
    m.add('b', seriesOfB)
    expect(() => m.add('a', [4, 5, 6])).throws('key \'a\' duplicates')
  })
  it('is able to multiplex', async () => {
    const m = new AsyncMultiplexer<C>()
    m.add('a', seriesOfA)
    m.add('b', seriesOfB)
    await validateAsync(m)
  })
  it('construct with fragments', async () => {
    const m = new AsyncMultiplexer<C>(
      { a: seriesOfA } as unknown as Record<keyof C, Iterable<C[keyof C]>>
    )
    m.add('b', seriesOfB)
    await validateAsync(m)
  })
  it('construct with multiplexer-like, case: \'fragments\' is defined but not iterable', async () => {
    const m = new AsyncMultiplexer<C>({
      fragments: { a: 123 } as unknown as Record<keyof C, Iterable<C[keyof C]>>,
      sources: undefined,
    })
    m.add('a', seriesOfA)
    m.add('b', seriesOfB)
    await validateAsync(m)
  })
  it('construct with multiplexer-like, case: \'sources\' is undefined', async () => {
    const m = new AsyncMultiplexer<C>({
      fragments: { b: seriesOfB } as unknown as Record<keyof C, Iterable<C[keyof C]>>,
      sources: undefined,
    })
    m.add('a', seriesOfA)
    await validateAsync(m)
  })
  it('construct with multiplexer-like, case: \'sources\' is defined but not iterable', async () => {
    const m = new AsyncMultiplexer<C>({
      fragments: { a: seriesOfA } as unknown as Record<keyof C, Iterable<C[keyof C]>>,
      sources: 3 as unknown as Iterable<C>,
    })
    m.add('a', seriesOfA)
    m.add('b', seriesOfB)
    await validateAsync(m)
  })
  it('construct with sources', async () => {
    const m = new AsyncMultiplexer(seriesOfA.map((a: number, i: number) => {
      return {
        a,
        b: seriesOfB[i],
      }
    }))
    await validateAsync(m)
  })
  it('copy constructor', async () => {
    const m1 = new AsyncMultiplexer<C>()
    const m2 = new AsyncMultiplexer(m1)
    m1.add('a', seriesOfA)
    m1.add('b', seriesOfB)
    await validateAsync(m2)
  })
  it('copy constructor, synchronous to asynchronous', async () => {
    const m1 = new Multiplexer<C>()
    const m2 = new AsyncMultiplexer(m1)
    m1.add('a', seriesOfA)
    m1.add('b', seriesOfB)
    await validateAsync(m2)
  })
})

describe('multiplexer', () => {
  it('is able to perform as async', async () => {
    const m = new Multiplexer<C>()
    m.add('a', seriesOfA)
    m.add('b', seriesOfB)
    await validateAsync(m)
  })
  it('fail if same key is added twice', () => {
    const m = new Multiplexer<C>()
    m.add('a', seriesOfA)
    m.add('b', seriesOfB)
    expect(() => m.add('a', [4, 5, 6])).throws('key \'a\' duplicates')
  })
  it('is able to multiplex', () => {
    const m = new Multiplexer<C>()
    m.add('a', seriesOfA)
    m.add('b', seriesOfB)
    validate(m)
  })
  it('construct with fragments', () => {
    const m = new Multiplexer<C>(
      { a: seriesOfA } as unknown as Record<keyof C, Iterable<C[keyof C]>>
    )
    m.add('b', seriesOfB)
    validate(m)
  })
  it('construct with multiplexer-like, case: \'sources\' is undefined', () => {
    const m = new Multiplexer<C>({
      fragments: { b: seriesOfB } as unknown as Record<keyof C, Iterable<C[keyof C]>>,
      sources: undefined,
    })
    m.add('a', seriesOfA)
    validate(m)
  })
  it('construct with multiplexer-like, case: \'sources\' is defined but not iterable', () => {
    const m = new Multiplexer<C>({
      fragments: { a: seriesOfA } as unknown as Record<keyof C, Iterable<C[keyof C]>>,
      sources: 3 as unknown as Iterable<C>,
    })
    m.add('a', seriesOfA)
    m.add('b', seriesOfB)
    validate(m)
  })
  it('construct with sources', () => {
    const m = new Multiplexer(seriesOfA.map((a: number, i: number) => {
      return {
        a,
        b: seriesOfB[i],
      }
    }))
    validate(m)
  })
  it('copy constructor', () => {
    const m1 = new Multiplexer<C>()
    const m2 = new Multiplexer(m1)
    m1.add('a', seriesOfA)
    m1.add('b', seriesOfB)
    validate(m2)
  })
})

type C = {
  a: number
  b: string
}

const evaluate = (ctx: { index: number }, c: C): void => {
  expect(c.a).to.be.eq(seriesOfA[ctx.index])
  expect(c.b).to.be.eq(seriesOfB[ctx.index])
  ctx.index++
}

const seriesOfA = [1, 2, 3]
const seriesOfB = 'foo'

const validate = (source: Iterable<C>) => {
  const ctx = { index: 0 }
  for (const c of source)
    evaluate(ctx, c)
}

const validateAsync = async (source: AsyncIterable<C>) => {
  const ctx = { index: 0 }
  for await (const c of source)
    evaluate(ctx, c)
}
