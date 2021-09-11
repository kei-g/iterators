import { AsyncCircularSeries, isAsyncIterable, isIterable } from '../src'
import { expect } from 'chai'

describe('isAsyncIterable', () => {
  it('\'foo\' is not AsyncIterable', () =>
    expect(isAsyncIterable('foo')).to.be.false
  )
  it('1 is not AsyncIterable', () =>
    expect(isAsyncIterable(1)).to.be.false
  )
  it('AsyncCircularSeries.of(1, 2, 3) is AsyncIterable', () =>
    expect(isAsyncIterable(AsyncCircularSeries.of(1, 2, 3))).to.be.true
  )
  it('null is not AsyncIterable', () =>
    expect(isAsyncIterable(null)).to.be.false
  )
  it('undefined is not AsyncIterable', () =>
    expect(isAsyncIterable(undefined)).to.be.false
  )
})

describe('isIterable', () => {
  it('\'foo\' is Iterable', () =>
    expect(isIterable('foo')).to.be.true
  )
  it('1 is not Iterable', () =>
    expect(isIterable(1)).to.be.false
  )
  it('null is not Iterable', () =>
    expect(isIterable(null)).to.be.false
  )
  it('undefined is not Iterable', () =>
    expect(isIterable(undefined)).to.be.false
  )
  it('[1, 2, 3] is Iterable', () =>
    expect(isIterable([1, 2, 3])).to.be.true
  )
})
