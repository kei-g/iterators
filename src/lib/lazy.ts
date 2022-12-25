class Complete {
}

type Executor<T> = (complete: () => void, next: (value: T) => void) => void

export class LazyIterable<T> implements AsyncIterable<T> {
  constructor(
    private readonly executor: Executor<T>
  ) {
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return new LazyIterator(this.executor)
  }
}

class LazyIterator<T> implements AsyncIterator<T> {
  private readonly pending = [] as (Complete | T)[]
  private readonly resolvers = [] as ((value: Complete | T) => void)[]

  constructor(private readonly executor: Executor<T>) {
    setImmediate(() => this.onIdle())
  }

  private iterate(value: T): void {
    setImmediate(
      () =>
        this.resolvers.length
          ? this.resolvers.shift()(value)
          : this.pending.push(value)
    )
  }

  async next(): Promise<IteratorResult<T>> {
    const value = await this.nextValueAsync()
    return {
      done: value instanceof Complete,
      value: value instanceof Complete ? undefined : value as T,
    }
  }

  private nextValueAsync(): Promise<Complete | T> {
    return new Promise(
      (resolve: (value: Complete | T) => void) => this.postpone(resolve)
    )
  }

  private onComplete(): void {
    setImmediate(
      () =>
        this.resolvers.length
          ? this.resolvers.shift()(new Complete())
          : this.pending.push(new Complete())
    )
  }

  private onIdle(): void {
    this.executor(
      () => this.onComplete(),
      (value: T) => this.iterate(value)
    )
  }

  private postpone(resolve: (value: Complete | T) => void): void {
    setImmediate(
      () =>
        this.pending.length
          ? resolve(this.pending.shift())
          : this.resolvers.push(resolve)
    )
  }

  return(value?: unknown): Promise<IteratorResult<T>> {
    throw new Error(`${value}`)
  }

  throw(error?: unknown): Promise<IteratorResult<T>> {
    throw new Error(`${error}`)
  }
}
