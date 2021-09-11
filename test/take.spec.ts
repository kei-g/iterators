import { AsyncCircularSeries, CircularSeries, take, until } from '../src'
import { describe, it } from 'mocha'
import { assert, expect } from 'chai'

describe('take', () => {
  it('take 0 item from async iterable', async () => {
    const taken = take(new AsyncCircularSeries(source), 0)
    let i = 0
    for await (const value of taken) {
      assert(false)
      expect(value).to.not.satisfy((value: number) => source.includes(value))
      i++
    }
    expect(i).to.be.eq(0)
  })
  it('take 0 item from sync iterable', () => {
    const taken = take(CircularSeries.of(1, 2, 3), 0)
    let i = 0
    for (const value of taken) {
      assert(false)
      expect(value).to.not.satisfy((value: number) => source.includes(value))
      i++
    }
    expect(i).to.be.eq(0)
  })
  it('take \'10\' items from async iterable', async () =>
    expect(await testAsync(take(new AsyncCircularSeries(source), '10'))).to.be.eq(10)
  )
  it('take 10n items from async iterable', async () =>
    expect(await testAsync(take(new AsyncCircularSeries(source), 10n))).to.be.eq(10)
  )
  it('take 10 items from async iterable', async () =>
    expect(await testAsync(take(new AsyncCircularSeries(source), 10))).to.be.eq(10)
  )
  it('take true items from async iterable', async () =>
    expect(await testAsync(take(new AsyncCircularSeries(source), true))).to.be.eq(1)
  )
  it('take with predicate from async iterable', async () => {
    let count = 0
    expect(await testAsync(
      take(
        new AsyncCircularSeries(source),
        (value: number) => source.includes(value) && count++ < 20
      )
    )).to.be.eq(20)
  })
  it('take with predicate, returns Promise, from async iterable', async () => {
    let count = 0
    expect(await testAsync(
      take(
        new AsyncCircularSeries(source),
        (value: number) => Promise.resolve(source.includes(value) && count++ < 20)
      )
    )).to.be.eq(20)
  })
  it('take with predicate, returns undefined, from async iterable', async () => {
    const taken = take(
      new AsyncCircularSeries(source),
      (value: number) => (
        expect(value).to.satisfy((value: number) => source.includes(value)),
        undefined
      )
    )
    let caught: unknown
    await testAsync(taken).catch((err: unknown) => caught = err)
    expect(caught).to.be.instanceOf(Error)
    if (caught instanceof Error)
      expect(caught.message).to.be.eq('predicate must return Promise or boolean')
  })
  it('take \'10\' items from iterable', async () => {
    const taken = take(new CircularSeries(source), '10')
    expect(await testAsync(taken)).to.be.eq(10)
    expect(test(taken)).to.be.eq(10)
  })
  it('take 10n items from iterable', async () => {
    const taken = take(new CircularSeries(source), 10n)
    expect(await testAsync(taken)).to.be.eq(10)
    expect(test(taken)).to.be.eq(10)
  })
  it('take 10 items from iterable', async () => {
    const taken = take(new CircularSeries(source), 10)
    expect(await testAsync(taken)).to.be.eq(10)
    expect(test(taken)).to.be.eq(10)
  })
  it('take true items from iterable', async () => {
    const taken = take(new CircularSeries(source), true)
    expect(await testAsync(taken)).to.be.eq(1)
    expect(test(taken)).to.be.eq(1)
  })
  it('take with predicate from iterable, asynchronously', async () => {
    let count = 0
    const taken = take(
      new CircularSeries(source),
      (value: number) => source.includes(value) && count++ < 20
    )
    expect(await testAsync(taken)).to.be.eq(20)
  })
  it('take with predicate from iterable, synchronously', () => {
    let count = 0
    const taken = take(
      new CircularSeries(source),
      (value: number) => source.includes(value) && count++ < 20
    )
    expect(test(taken)).to.be.eq(20)
  })
  it('take with predicate, returns Promise, from iterable', async () => {
    let count = 0
    const taken = take(
      new CircularSeries(source),
      (value: number) => Promise.resolve(source.includes(value) && count++ < 20)
    )
    expect(await testAsync(taken)).to.be.eq(20)
    expect(() => test(taken)).to.throw('predicate must return boolean')
  })
  it('take with undefined from iterable', async () => {
    const taken = take(new CircularSeries(source), undefined)
    expect(await testAsync(taken)).to.be.eq(0)
    expect(test(taken)).to.be.eq(0)
  })
  it('undefined should be returned from literal number 333', () => {
    const taken = take(333 as unknown as Iterable<never>, 10)
    expect(taken).to.be.undefined
  })
})

describe('until', () => {
  it('until async', async () => {
    let count = 0
    const taken = until(
      new AsyncCircularSeries(source),
      (value: number) => source.includes(value) && count++ === 20
    )
    expect(await testAsync(taken)).to.be.eq(20)
  })
  it('until async, of Promise', async () => {
    let count = 0
    const taken = until(
      new AsyncCircularSeries(source),
      (value: number) => Promise.resolve(source.includes(value) && count++ === 20)
    )
    expect(await testAsync(taken)).to.be.eq(20)
  })
  it('until async, undefined', async () => {
    const taken = until(
      new AsyncCircularSeries(source),
      (value: number) => (expect(value).to.satisfy((value: number) => source.includes(value)), undefined)
    )
    let caught: unknown
    await testAsync(taken).catch((err: unknown) => caught = err)
    expect(caught).to.be.instanceOf(Error)
    if (caught instanceof Error)
      expect(caught.message).to.be.eq('predicate must return Promise or boolean')
  })
  it('until sync', () => {
    let count = 0
    const taken = until(
      new CircularSeries(source),
      (value: number) => source.includes(value) && count++ === 20
    )
    expect(test(taken)).to.be.eq(20)
  })
  it('until sync, of Promise', () => {
    let count = 0
    const taken = until(
      new CircularSeries(source),
      (value: number) => Promise.resolve(source.includes(value) && count++ === 20)
    )
    expect(() => test(taken)).to.throw('predicate must return boolean')
  })
  it('until sync, undefined', () => {
    const taken = until(
      new CircularSeries(source),
      (value: number) => (expect(value).to.satisfy((value: number) => source.includes(value)), undefined)
    )
    expect(() => test(taken)).to.throw('predicate must return Promise or boolean')
  })
})

const source = [1, 2, 3]

const test = <T>(values: Iterable<T>): number => {
  let count = 0
  for (const value of values)
    expect(value).to.be.eq(source[count++ % source.length])
  return count
}

const testAsync = async <T>(values: AsyncIterable<T>): Promise<number> => {
  let count = 0
  for await (const value of values)
    expect(value).to.be.eq(source[count++ % source.length])
  return count
}
