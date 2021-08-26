import {
  EitherIterable,
  EitherIterator,
  isAsyncIterable,
  isIterable,
} from './iterators'

export class AsyncMultiplexer<T> implements AsyncIterable<T> {
  private readonly sources = {} as SourceE<T>

  constructor(sources?: SourceE<T>) {
    this.sources = sources ?? {} as SourceE<T>
  }

  add<K extends keyof T>(
    key: K,
    source: EitherIterable<T extends Record<K, infer U> ? U : never>
  ): void {
    if (this.sources[key])
      throw new Error(`key '${key}' duplicates`)
    this.sources[key] = source
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return async function* (sources: SourceE<T>) {
      const iterators = {} as IteratorRecordE<T>
      for (const key in sources) {
        const source = sources[key]
        if (isAsyncIterable(source))
          iterators[key] = source[Symbol.asyncIterator]()
        else if (isIterable(source))
          iterators[key] = source[Symbol.iterator]()
      }
      while (true) {
        const tasks = [] as KeyPromise<T>[]
        for (const key in iterators) {
          const next = iterators[key].next()
          if (next instanceof Promise)
            tasks.push(next.then((result: IteratorResult<unknown>) => {
              return {
                done: result.done,
                key,
                value: result.value,
              }
            }))
          else
            tasks.push(Promise.resolve({
              done: next.done,
              key,
              value: next.value,
            }))
        }
        let done = true
        const value = {} as T
        for (const next of await Promise.all(tasks))
          if (!next.done) {
            done = false
            value[next.key] = next.value
          }
        if (done)
          break
        yield value
      }
    }(this.sources)
  }
}

type IteratorRecord<T> = Record<keyof T, Iterator<unknown>>

type IteratorRecordE<T> = Record<keyof T, EitherIterator<unknown>>

type KeyPromise<T> = Promise<{ key: keyof T } & IteratorResult<unknown>>

export class Multiplexer<T> implements AsyncIterable<T>, Iterable<T> {
  private readonly sources = {} as Source<T>

  add<K extends keyof T>(
    key: K,
    source: Iterable<T extends Record<K, infer U> ? U : never>
  ): void {
    if (this.sources[key])
      throw new Error(`key '${key}' duplicates`)
    this.sources[key] = source
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return new AsyncMultiplexer(this.sources)[Symbol.asyncIterator]()
  }

  [Symbol.iterator](): Iterator<T> {
    return function* (sources: Source<T>) {
      const iterators = {} as IteratorRecord<T>
      for (const key in sources)
        iterators[key] = sources[key][Symbol.iterator]()
      while (true) {
        let done = true
        const value = {} as T
        for (const key in iterators) {
          const next = iterators[key].next()
          if (!next.done) {
            done = false
            value[key] = next.value
          }
        }
        if (done)
          break
        yield value
      }
    }(this.sources)
  }
}

type Source<T> = Record<keyof T, Iterable<unknown>>

type SourceE<T> = Record<keyof T, EitherIterable<unknown>>
