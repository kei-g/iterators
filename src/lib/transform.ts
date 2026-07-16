import type { EitherIterable } from '../index.ts'

export class AsyncTransformer<T, U> implements AsyncIterable<U> {
  private readonly source: EitherIterable<T>
  private readonly selector: (value: T) => PromiseLike<U> | U

  constructor(source: EitherIterable<T>, selector: (value: T) => PromiseLike<U> | U) {
    this.selector = selector
    this.source = source
  }

  [Symbol.asyncIterator](): AsyncIterator<U> {
    return async function* (
      source: EitherIterable<T>,
      selector: (value: T) => PromiseLike<U> | U,
    ) {
      for await (const value of source)
        yield await selector(value)
    }(this.source, this.selector)
  }
}

export class Transformer<T, U> implements AsyncIterable<U>, Iterable<U> {
  private readonly source: Iterable<T>
  private readonly selector: (value: T) => U

  constructor(source: Iterable<T>, selector: (value: T) => U) {
    this.selector = selector
    this.source = source
  }

  [Symbol.asyncIterator](): AsyncIterator<U> {
    return new AsyncTransformer(
      this.source,
      this.selector,
    )[Symbol.asyncIterator]()
  }

  [Symbol.iterator](): Iterator<U> {
    return function* (
      source: Iterable<T>,
      selector: (value: T) => U,
    ) {
      for (const value of source)
        yield selector(value)
    }(this.source, this.selector)
  }
}
