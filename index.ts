export class ConcatenatedIterable<T> implements Iterable<T> {
  constructor(private readonly first: Iterable<T>, private readonly second: Iterable<T>) {
  }

  [Symbol.iterator](): Iterator<T> {
    return new ConcatenatedIterator(this.first[Symbol.iterator](), this.second[Symbol.iterator]())
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
  private iterated: boolean = false

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
