import { ConcatenatedIterator, EmptyIterator, SingleIterator } from './iterators'

export class ConcatenatedIterable<T> implements Iterable<T> {
  constructor(private readonly first: Iterable<T>, private readonly second: Iterable<T>) {
  }

  [Symbol.iterator](): Iterator<T> {
    return new ConcatenatedIterator(this.first[Symbol.iterator](), this.second[Symbol.iterator]())
  }
}

export class EmptyIterable<T> implements Iterable<T> {
  [Symbol.iterator](): Iterator<T> {
    return new EmptyIterator()
  }
}

export class SingleIterable<T> implements Iterable<T> {
  constructor(private readonly value: T) {
  }

  [Symbol.iterator](): Iterator<T> {
    return new SingleIterator(this.value)
  }
}
