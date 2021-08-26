import { EitherIterable } from './iterators'

export class ConcatenatedAsyncIterable<T> implements AsyncIterable<T> {
  static of<T>(...source: (EitherIterable<T>)[]): AsyncIterable<T> {
    return new ConcatenatedAsyncIterable(source)
  }

  constructor(private readonly source: EitherIterable<EitherIterable<T>>) {
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return async function* (source: EitherIterable<EitherIterable<T>>) {
      for await (const iterable of source)
        for await (const value of iterable)
          yield value
    }(this.source)
  }
}

export class ConcatenatedIterable<T> implements AsyncIterable<T>, Iterable<T> {
  static of<T>(...source: Iterable<T>[]): Iterable<T> {
    return new ConcatenatedIterable<T>(source)
  }

  private readonly source: Iterable<Iterable<T>>

  constructor(
    sourceOrFirst: Iterable<Iterable<T>> | Iterable<T>,
    second?: Iterable<T>,
  ) {
    this.source = typeof second === 'undefined'
      ? sourceOrFirst as Iterable<Iterable<T>>
      : [sourceOrFirst as Iterable<T>, second]
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return new ConcatenatedAsyncIterable(this.source)[Symbol.asyncIterator]()
  }

  [Symbol.iterator](): Iterator<T> {
    return function* (source: Iterable<Iterable<T>>) {
      for (const iterable of source)
        for (const value of iterable)
          yield value
    }(this.source)
  }
}

export class ConcatenatedIterator<T> implements Iterator<T> {
  static of<T>(...source: Iterator<T>[]): Iterator<T> {
    return new ConcatenatedIterator<T>(source[Symbol.iterator]())
  }

  private current: Iterator<T>
  private readonly source: Iterator<Iterator<T>>

  constructor(
    sourceOrFirst: Iterator<Iterator<T>> | Iterator<T>,
    second?: Iterator<T>,
  ) {
    this.source = typeof second === 'undefined'
      ? sourceOrFirst as Iterator<Iterator<T>>
      : [sourceOrFirst as Iterator<T>, second][Symbol.iterator]()
  }

  next(): IteratorResult<T> {
    let next = this.current.next()
    while (next.done) {
      const cursor = this.source.next()
      this.current = cursor.done ? undefined : cursor.value
      next = this.current.next()
    }
    return next
  }
}
