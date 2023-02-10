import { EitherIterable } from '..'

export class AsyncCircularSeries<T> implements AsyncIterable<T> {
  static of<T>(...source: T[]): AsyncIterable<T> {
    return new AsyncCircularSeries(source)
  }

  constructor(private readonly source: EitherIterable<T>) {
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return async function* (source: EitherIterable<T>) {
      while (true)
        for await (const value of source)
          yield value
    }(this.source)
  }
}

export class CircularSeries<T> implements AsyncIterable<T>, Iterable<T> {
  static of<T>(...source: T[]): Iterable<T> {
    return new CircularSeries(source)
  }

  constructor(private source: Iterable<T>) {
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return new AsyncCircularSeries(this.source)[Symbol.asyncIterator]()
  }

  [Symbol.iterator](): Iterator<T> {
    return function* (source: Iterable<T>) {
      while (true)
        for (const value of source)
          yield value
    }(this.source)
  }
}
