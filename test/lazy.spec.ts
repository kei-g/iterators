import assert, { equal } from 'node:assert'
import { LazyIterable } from '../src'
import { describe, it } from 'mocha'

describe('lazy', () => {
  it('async - complete immediately', async () => {
    const lazy = new LazyIterable(
      (
        complete: () => void,
        next: (value: number) => void,
      ) => {
        next(3)
        next(1)
        next(4)
        complete()
      }
    )
    const expected = [3, 1, 4]
    let i = 0
    for await (const value of lazy)
      equal(value, expected[i++])
    equal(i, expected.length)
  })
  it('async - complete later', async () => {
    const lazy = new LazyIterable(
      (
        complete: () => void,
        next: (value: number) => void,
      ) => {
        next(3)
        next(1)
        next(4)
        setTimeout(() => complete(), 10)
      }
    )
    const expected = [3, 1, 4]
    let i = 0
    for await (const value of lazy)
      equal(value, expected[i++])
    equal(i, expected.length)
  })
  it('catch an error - call return', async () => {
    const lazy = new LazyIterable(
      (
        complete: () => void,
        next: (value: number) => void,
      ) => {
        next(3)
        next(1)
        next(4)
        complete()
      }
    )
    const iter = lazy[Symbol.asyncIterator]()
    if ('return' in iter && typeof iter.return === 'function')
      try {
        await iter.return()
        assert(false)
      }
      catch (err: unknown) {
        assert(err instanceof Error)
      }
  })
  it('catch an error - call throw', async () => {
    const lazy = new LazyIterable(
      (
        complete: () => void,
        next: (value: number) => void,
      ) => {
        next(3)
        next(1)
        next(4)
        complete()
      }
    )
    const iter = lazy[Symbol.asyncIterator]()
    if ('throw' in iter && typeof iter.throw === 'function')
      try {
        await iter.throw()
        assert(false)
      }
      catch (err: unknown) {
        assert(err instanceof Error)
      }
  })
})
