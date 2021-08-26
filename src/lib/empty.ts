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
