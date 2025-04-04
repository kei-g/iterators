import { AsyncCircularSeries, isAsyncIterable, isIterable } from '../src'
import { equal } from 'node:assert'

describe('isAsyncIterable', () => {
  it('\'foo\' is not AsyncIterable', () =>
    equal(isAsyncIterable('foo'), false)
  )
  it('1 is not AsyncIterable', () =>
    equal(isAsyncIterable(1), false)
  )
  it('AsyncCircularSeries.of(1, 2, 3) is AsyncIterable', () =>
    equal(isAsyncIterable(AsyncCircularSeries.of(1, 2, 3)), true)
  )
  it('null is not AsyncIterable', () =>
    equal(isAsyncIterable(null), false)
  )
  it('undefined is not AsyncIterable', () =>
    equal(isAsyncIterable(undefined), false)
  )
})

describe('isIterable', () => {
  it('\'foo\' is Iterable', () =>
    equal(isIterable('foo'), true)
  )
  it('1 is not Iterable', () =>
    equal(isIterable(1), false)
  )
  it('null is not Iterable', () =>
    equal(isIterable(null), false)
  )
  it('undefined is not Iterable', () =>
    equal(isIterable(undefined), false)
  )
  it('[1, 2, 3] is Iterable', () =>
    equal(isIterable([1, 2, 3]), true)
  )
})
