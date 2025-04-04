import assert, { equal, throws } from 'node:assert'
import { AsyncCircularSeries, CircularSeries, CountOrPredicate, take, until } from '../src'
import { describe, it } from 'mocha'

describe('take', () => {
  it('take 0 item from async iterable', async () => {
    const taken = take(new AsyncCircularSeries(source), 0)
    let i = 0
    for await (const value of taken) {
      assert(false)
      equal(source.includes(value as number), false)
      i++
    }
    equal(i, 0)
  })
  it('take 0 item from sync iterable', () => {
    const taken = take(CircularSeries.of(1, 2, 3), 0)
    let i = 0
    for (const value of taken) {
      assert(false)
      equal(source.includes(value as number), false)
      i++
    }
    equal(i, 0)
  })
  it('take \'10\' items from async iterable', async () =>
    equal(await testAsync(take(new AsyncCircularSeries(source), '10')), 10)
  )
  it('take 10n items from async iterable', async () =>
    equal(await testAsync(take(new AsyncCircularSeries(source), 10n)), 10)
  )
  it('take 10 items from async iterable', async () =>
    equal(await testAsync(take(new AsyncCircularSeries(source), 10)), 10)
  )
  it('take true items from async iterable', async () =>
    equal(await testAsync(take(new AsyncCircularSeries(source), true)), 1)
  )
  it('take with predicate from async iterable', async () => {
    let count = 0
    equal(await testAsync(
      take(
        new AsyncCircularSeries(source),
        (value: number) => source.includes(value) && count++ < 20
      )
    ), 20)
  })
  it('take with predicate, returns Promise, from async iterable', async () => {
    let count = 0
    equal(await testAsync(
      take(
        new AsyncCircularSeries(source),
        (value: number) => Promise.resolve(source.includes(value) && count++ < 20)
      )
    ), 20)
  })
  it('take with predicate, returns undefined, from async iterable', async () => {
    const taken = take(
      new AsyncCircularSeries(source),
      (value: number) => {
        assert(source.includes(value))
        return undefined as unknown as boolean
      }
    )
    let caught: unknown
    await testAsync(taken).catch((err: unknown) => caught = err)
    assert(caught instanceof Error)
    equal(caught.message, 'predicate must return Promise or boolean')
  })
  it('take \'10\' items from iterable', async () => {
    const taken = take(new CircularSeries(source), '10')
    equal(await testAsync(taken), 10)
    equal(test(taken), 10)
  })
  it('take 10n items from iterable', async () => {
    const taken = take(new CircularSeries(source), 10n)
    equal(await testAsync(taken), 10)
    equal(test(taken), 10)
  })
  it('take 10 items from iterable', async () => {
    const taken = take(new CircularSeries(source), 10)
    equal(await testAsync(taken), 10)
    equal(test(taken), 10)
  })
  it('take true items from iterable', async () => {
    const taken = take(new CircularSeries(source), true)
    equal(await testAsync(taken), 1)
    equal(test(taken), 1)
  })
  it('take with predicate from iterable, asynchronously', async () => {
    let count = 0
    const taken = take(
      new CircularSeries(source),
      (value: number) => source.includes(value) && count++ < 20
    )
    equal(await testAsync(taken), 20)
  })
  it('take with predicate from iterable, synchronously', () => {
    let count = 0
    const taken = take(
      new CircularSeries(source),
      (value: number) => source.includes(value) && count++ < 20
    )
    equal(test(taken), 20)
  })
  it('take with predicate, returns Promise, from iterable', async () => {
    let count = 0
    const taken = take(
      new CircularSeries(source),
      (value: number) => Promise.resolve(source.includes(value) && count++ < 20)
    )
    equal(await testAsync(taken), 20)
    throws(
      () => test(taken),
      new Error('predicate must return boolean')
    )
  })
  it('take with undefined from iterable', async () => {
    const taken = take(new CircularSeries(source), undefined as unknown as CountOrPredicate<number>)
    equal(await testAsync(taken), 0)
    equal(test(taken), 0)
  })
  it('undefined should be returned from literal number 333', () => {
    const taken = take(333 as unknown as Iterable<never>, 10)
    equal(taken, undefined)
  })
})

describe('until', () => {
  it('until async', async () => {
    let count = 0
    const taken = until(
      new AsyncCircularSeries(source),
      (value: number) => source.includes(value) && count++ === 20
    )
    equal(await testAsync(taken), 20)
  })
  it('until async, of Promise', async () => {
    let count = 0
    const taken = until(
      new AsyncCircularSeries(source),
      (value: number) => Promise.resolve(source.includes(value) && count++ === 20)
    )
    equal(await testAsync(taken), 20)
  })
  it('until async, undefined', async () => {
    const taken = until(
      new AsyncCircularSeries(source),
      (value: number) => {
        assert(source.includes(value))
        return undefined as unknown as boolean
      }
    )
    let caught: unknown
    await testAsync(taken).catch((err: unknown) => caught = err)
    assert(caught instanceof Error)
    equal(caught.message, 'predicate must return Promise or boolean')
  })
  it('until sync', () => {
    let count = 0
    const taken = until(
      new CircularSeries(source),
      (value: number) => source.includes(value) && count++ === 20
    )
    equal(test(taken), 20)
  })
  it('until sync, of Promise', () => {
    let count = 0
    const taken = until(
      new CircularSeries(source),
      (value: number) => Promise.resolve(source.includes(value) && count++ === 20)
    )
    throws(
      () => test(taken),
      new Error('predicate must return boolean')
    )
  })
  it('until sync, undefined', () => {
    const taken = until(
      new CircularSeries(source),
      (value: number) => {
        assert(source.includes(value))
        return undefined as unknown as boolean
      }
    )
    throws(
      () => test(taken),
      new Error('predicate must return Promise or boolean')
    )
  })
})

const source = [1, 2, 3]

const test = <T>(values: Iterable<T>): number => {
  let count = 0
  for (const value of values)
    equal(value, source[count++ % source.length])
  return count
}

const testAsync = async <T>(values: AsyncIterable<T>): Promise<number> => {
  let count = 0
  for await (const value of values)
    equal(value, source[count++ % source.length])
  return count
}
