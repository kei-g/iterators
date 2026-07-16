export class SingleIterable<T> implements Iterable<T> {
  private readonly value: T

  constructor(value: T) {
    this.value = value
  }

  [Symbol.iterator](): Iterator<T> {
    return new SingleIterator(this.value)
  }
}

export class SingleIterator<T> implements Iterator<T> {
  private iterated = false
  private readonly value: T

  constructor(value: T) {
    this.value = value
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
