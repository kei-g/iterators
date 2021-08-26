export type BothIterable<T> = AsyncIterable<T> & Iterable<T>

export type EitherIterable<T> = AsyncIterable<T> | Iterable<T>

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

  constructor(sourceOrFirst: Iterable<Iterable<T>> | Iterable<T>, second?: Iterable<T>) {
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
  private current: Iterator<T>

  constructor(private readonly first: Iterator<T>, private readonly second: Iterator<T>) {
    this.current = this.first
  }

  next(): IteratorResult<T> {
    let next: IteratorResult<T> = this.current.next()
    if (this.current == this.first && next.done) {
      this.current = this.second
      next = this.second.next()
    }
    return next
  }
}

export class EmptyIterable<T> implements Iterable<T> {
  [Symbol.iterator](): Iterator<T> {
    return new EmptyIterator()
  }
}

export class EmptyIterator<T> implements Iterator<T> {
  next(): IteratorResult<T> {
    return {
      done: true,
      value: undefined
    }
  }
}

export class SingleIterable<T> implements Iterable<T> {
  constructor(private readonly value: T) {
  }

  [Symbol.iterator](): Iterator<T> {
    return new SingleIterator(this.value)
  }
}

export class SingleIterator<T> implements Iterator<T> {
  private iterated = false

  constructor(private readonly value: T) {
  }

  next(): IteratorResult<T> {
    const next: IteratorResult<T> = {
      done: this.iterated,
      value: this.value
    }
    this.iterated = true
    return next
  }
}

export class ZippedIterable<T, U, V> implements Iterable<V> {
  constructor(private readonly first: Iterable<T>, private readonly second: Iterable<U>, private readonly selector: (first: T, second: U) => V) {
  }

  [Symbol.iterator](): Iterator<V> {
    return new ZippedIterator(this.first[Symbol.iterator](), this.second[Symbol.iterator](), this.selector)
  }
}

export class ZippedIterator<T, U, V> implements Iterator<V> {
  constructor(private readonly first: Iterator<T>, private readonly second: Iterator<U>, private readonly selector: (first: T, second: U) => V) {
  }

  next(): IteratorResult<V> {
    const first = this.first.next()
    const second = this.second.next()
    return {
      done: first.done || second.done,
      value: this.selector(first.value, second.value),
    }
  }
}
