import { LazyIterable } from '../src'
import { describe, it } from 'mocha'
import { expect } from 'chai'

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
      expect(value).to.be.eq(expected[i++])
    expect(i).to.be.eq(expected.length)
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
      expect(value).to.be.eq(expected[i++])
    expect(i).to.be.eq(expected.length)
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
    let caught: unknown = undefined
    if ('return' in iter && typeof iter.return === 'function')
      try {
        await iter.return()
      }
      catch (err: unknown) {
        caught = err
      }
    expect(caught).to.be.an.instanceOf(Error)
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
    let caught: unknown = undefined
    if ('throw' in iter && typeof iter.throw === 'function')
      try {
        await iter.throw()
      }
      catch (err: unknown) {
        caught = err
      }
    expect(caught).to.be.an.instanceOf(Error)
  })
})
