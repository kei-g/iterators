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
