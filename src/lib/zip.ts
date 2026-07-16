export class ZippedIterable<T, U, V> implements Iterable<V> {
  private readonly first: Iterable<T>
  private readonly second: Iterable<U>
  private readonly selector: (first: T, second: U) => V

  constructor(first: Iterable<T>, second: Iterable<U>, selector: (first: T, second: U) => V) {
    this.first = first
    this.second = second
    this.selector = selector
  }

  [Symbol.iterator](): Iterator<V> {
    return new ZippedIterator(
      this.first[Symbol.iterator](),
      this.second[Symbol.iterator](),
      this.selector,
    )
  }
}

export class ZippedIterator<T, U, V> implements Iterator<V> {
  private readonly first: Iterator<T>
  private readonly second: Iterator<U>
  private readonly selector: (first: T, second: U) => V

  constructor(first: Iterator<T>, second: Iterator<U>, selector: (first: T, second: U) => V) {
    this.first = first
    this.second = second
    this.selector = selector
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
