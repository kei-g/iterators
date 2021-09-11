class Complete {
}

type Executor<T> = (complete: () => void, next: (value: T) => void) => void

export class LazyIterable<T> implements AsyncIterable<T> {
  constructor(
    private readonly executor: Executor<T>
  ) {
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return async function* (executor: Executor<T>) {
      const pending = [] as (Complete | T)[]
      const resolvers = [] as ((value: Complete | T) => void)[]
      setImmediate(() =>
        executor(
          () => setImmediate(() =>
            resolvers.length
              ? resolvers.shift()(new Complete())
              : pending.push(new Complete())
          ),
          (value: T) => setImmediate(() =>
            resolvers.length
              ? resolvers.shift()(value)
              : pending.push(value)
          )
        )
      )
      while (true) {
        const value = await new Promise(
          (
            resolve: (value: Complete | T) => void
          ) =>
            setImmediate(() =>
              pending.length
                ? resolve(pending.shift())
                : resolvers.push(resolve)
            )
        )
        if (value instanceof Complete)
          break
        yield value
      }
    }(this.executor)
  }
}
