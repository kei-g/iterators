export type BothIterable<T> = AsyncIterable<T> & Iterable<T>

export type EitherIterable<T> = AsyncIterable<T> | Iterable<T>

export type EitherIterator<T> = AsyncIterator<T> | Iterator<T>

export type ReturnableTypeOf<S, T extends EitherIterable<S>> =
  T extends Iterable<S>
    ? BothIterable<S>
    : T extends AsyncIterable<S>
      ? AsyncIterable<S>
      : unknown

export const isAsyncIterable =
  <T>(value: unknown): value is AsyncIterable<T> => {
    if (!value)
      return false
    const maybe = value as AsyncIterable<T>
    return typeof maybe[Symbol.asyncIterator] === 'function'
  }

export const isIterable =
  <T>(value: unknown): value is Iterable<T> => {
    if (!value)
      return false
    const maybe = value as Iterable<T>
    return typeof maybe[Symbol.iterator] === 'function'
  }
