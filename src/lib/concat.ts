import type { BothIterable, EitherIterable } from '../index.ts'

export class ConcatenatedAsyncIterable<T> implements AsyncIterable<T> {
  static of<T>(...source: (EitherIterable<T>)[]): AsyncIterable<T> {
    return new ConcatenatedAsyncIterable(source)
  }

  private readonly source: EitherIterable<EitherIterable<T>>

  constructor(source: EitherIterable<EitherIterable<T>>) {
    this.source = source
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return async function*(source: EitherIterable<EitherIterable<T>>) {
      for await (const iterable of source)
        for await (const value of iterable)
          yield value
    }(this.source)
  }
}

export class ConcatenatedIterable<T> implements BothIterable<T> {
  static of<T>(...source: Iterable<T>[]): BothIterable<T> {
    return new ConcatenatedIterable<T>(source)
  }

  private readonly source: Iterable<Iterable<T>>

  constructor(
    sourceOrFirst: Iterable<Iterable<T>>|Iterable<T>,
    second?: Iterable<T>,
  ) {
    this.source = typeof second === 'undefined' ? sourceOrFirst as Iterable<Iterable<T>> : [sourceOrFirst as Iterable<T>, second]
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return new ConcatenatedAsyncIterable( this.source)[Symbol.asyncIterator]()
  }

  [Symbol.iterator](): Iterator<T> {
    return function*(source: Iterable<Iterable<T>>) {
      for (const iterable of source)
        for (const value of iterable)
          yield value
    }(this.source)
  }
}
