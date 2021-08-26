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
