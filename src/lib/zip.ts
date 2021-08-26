export class ZippedIterable<T, U, V> implements Iterable<V> {
  constructor(
    private readonly first: Iterable<T>,
    private readonly second: Iterable<U>,
    private readonly selector: (first: T, second: U) => V,
  ) {
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
  constructor(
    private readonly first: Iterator<T>,
    private readonly second: Iterator<U>,
    private readonly selector: (first: T, second: U) => V,
  ) {
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
