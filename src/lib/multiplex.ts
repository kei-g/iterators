import {
  EitherIterable,
  EitherIterator,
  isAsyncIterable,
  isIterable,
} from './iterators'

export class AsyncMultiplexer<T> implements AsyncIterable<T> {
  private readonly fragments = {} as IterableRecordE<T>
  private readonly sources: EitherIterable<T>

  constructor(
    sources?: EitherIterable<T> | EitherMultiplexerLike<T> | IterableRecordE<T>
  ) {
    if (isEitherMultiplexerLike(sources)) {
      this.fragments = sources.fragments
      this.sources = sources.sources
    }
    else if (isAsyncIterable(sources) || isIterable(sources))
      this.sources = sources
    else if (isEitherIterableRecord(sources))
      this.fragments = sources
  }

  add<K extends keyof T>(
    key: K,
    source: EitherIterable<T extends Record<K, infer U> ? U : never>
  ): void {
    if (this.fragments[key])
      throw new Error(`key '${key}' duplicates`)
    this.fragments[key] = source as EitherIterable<T[K]>
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return async function* (
      fragments: IterableRecordE<T>,
      sources: EitherIterable<T>,
    ) {
      if (sources)
        for await (const value of sources)
          yield value
      const iterators = {} as IteratorRecordE<T>
      for (const key in fragments) {
        const source = fragments[key]
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
            tasks.push(
              next.then(
                (result: IteratorResult<T[keyof T]>) => {
                  return {
                    done: result.done,
                    key,
                    value: result.value,
                  }
                }
              )
            )
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
    }(this.fragments, this.sources)
  }
}

type EitherMultiplexerLike<T> = {
  readonly fragments: IterableRecord<T> | IterableRecordE<T>
  readonly sources: EitherIterable<T>
}

type IterableRecord<T> = Record<keyof T, Iterable<T[keyof T]>>

type IterableRecordE<T> = Record<keyof T, EitherIterable<T[keyof T]>>

type IteratorRecord<T> = Record<keyof T, Iterator<T[keyof T]>>

type IteratorRecordE<T> = Record<keyof T, EitherIterator<T[keyof T]>>

type KeyPromise<T> = Promise<{ key: keyof T } & IteratorResult<T[keyof T]>>

export class Multiplexer<T> implements AsyncIterable<T>, Iterable<T> {
  private readonly fragments = {} as IterableRecord<T>
  private readonly sources: Iterable<T>

  constructor(
    sources?: Iterable<T> | IterableRecord<T> | MultiplexerLike<T>
  ) {
    if (isMultiplexerLike(sources)) {
      this.fragments = sources.fragments
      this.sources = sources.sources
    }
    else if (isIterable(sources))
      this.sources = sources
    else if (isIterableRecord(sources))
      this.fragments = sources
  }

  add<K extends keyof T>(
    key: K,
    source: Iterable<T extends Record<K, infer U> ? U : never>
  ): void {
    if (this.fragments[key])
      throw new Error(`key '${key}' duplicates`)
    this.fragments[key] = source as Iterable<T[K]>
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return new AsyncMultiplexer(this.sources)[Symbol.asyncIterator]()
  }

  [Symbol.iterator](): Iterator<T> {
    return function* (fragments: IterableRecord<T>, sources: Iterable<T>) {
      if (sources)
        for (const value of sources)
          yield value
      const iterators = {} as IteratorRecord<T>
      for (const key in fragments)
        iterators[key] = fragments[key][Symbol.iterator]()
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
    }(this.fragments, this.sources)
  }
}

type MultiplexerLike<T> = {
  readonly fragments: IterableRecord<T>
  readonly sources: Iterable<T>
}

const isEitherIterableRecord =
  <T>(value: unknown): value is IterableRecordE<T> => {
    if (!value)
      return false
    const maybe = value as IterableRecordE<T>
    for (const key in maybe) {
      const value = maybe[key]
      if (isAsyncIterable(value) || isIterable(value))
        continue
      return false
    }
    return true
  }

const isEitherMultiplexerLike =
  <T>(value: unknown): value is EitherMultiplexerLike<T> => {
    if (!value)
      return false
    const maybe = value as EitherMultiplexerLike<T>
    if (maybe instanceof AsyncMultiplexer)
      return true
    if (maybe instanceof Multiplexer)
      return true
    if (!isEitherIterableRecord(maybe.fragments))
      return false
    if (maybe.sources
      && !isAsyncIterable(maybe.sources)
      && !isIterable(maybe.sources))
      return false
    return true
  }

const isIterableRecord =
  <T>(value: unknown): value is IterableRecord<T> => {
    if (!value)
      return false
    const maybe = value as IterableRecord<T>
    for (const key in maybe)
      if (!isIterable(maybe[key]))
        return false
    return true
  }

const isMultiplexerLike =
  <T>(value: unknown): value is MultiplexerLike<T> => {
    if (!value)
      return false
    const maybe = value as MultiplexerLike<T>
    if (maybe instanceof Multiplexer)
      return true
    if (!isIterableRecord(maybe.fragments))
      return false
    if (maybe.sources && !isIterable(maybe.sources))
      return false
    return true
  }
