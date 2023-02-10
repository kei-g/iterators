import { EitherIterable, ReturnableTypeOf, isAsyncIterable, isIterable } from '..'

type CountOrPredicate<S> =
  bigint |
  boolean |
  number |
  string |
  ((value: S) => PromiseLike<boolean> | boolean)

export const take = <S, T extends EitherIterable<S>>(
  source: T,
  countOrPredicate: CountOrPredicate<S>,
): ReturnableTypeOf<S, T> => {
  const a: AsyncIterable<S> = isAsyncIterable<S>(source) ? source : undefined
  const s: Iterable<S> = isIterable<S>(source) ? source : undefined
  const g = a || s ? async function* () {
    if (typeof countOrPredicate === 'bigint'
      || typeof countOrPredicate === 'boolean'
      || typeof countOrPredicate === 'number'
      || typeof countOrPredicate === 'string') {
      const limit = BigInt(countOrPredicate)
      let num = 0n
      if (num < limit)
        for await (const value of a) {
          if (limit <= num++)
            break
          yield value
        }
    }
    else if (typeof countOrPredicate === 'function')
      for await (const value of a) {
        const maybe = countOrPredicate(value)
        if (typeof maybe === 'boolean')
          if (maybe)
            yield value
          else
            break
        else if (maybe instanceof Promise)
          if (await maybe)
            yield value
          else
            break
        else
          throw new Error('predicate must return Promise or boolean')
      }
  } : undefined
  if (s)
    return {
      [Symbol.asyncIterator]: () => g(),
      [Symbol.iterator]: () => {
        return function* () {
          if (typeof countOrPredicate === 'bigint'
            || typeof countOrPredicate === 'boolean'
            || typeof countOrPredicate === 'number'
            || typeof countOrPredicate === 'string') {
            const limit = BigInt(countOrPredicate)
            let num = 0n
            if (num < limit)
              for (const value of s) {
                if (limit <= num++)
                  break
                yield value
              }
          }
          else if (typeof countOrPredicate === 'function')
            for (const value of s) {
              const maybe = countOrPredicate(value)
              if (typeof maybe === 'boolean')
                if (maybe)
                  yield value
                else
                  break
              else
                throw new Error('predicate must return boolean')
            }
        }()
      },
    } as ReturnableTypeOf<S, T>
  else if (a)
    return {
      [Symbol.asyncIterator]: () => g()
    } as ReturnableTypeOf<S, T>
}

export const until =
  <S, T extends EitherIterable<S>>(
    source: T,
    predicate: ((value: S) => PromiseLike<boolean> | boolean),
  ): ReturnableTypeOf<S, T> => {
    return take(
      source,
      (value: S) => {
        const maybe = predicate(value)
        if (typeof maybe === 'boolean')
          return !maybe
        else if (maybe instanceof Promise)
          return new Promise(
            (resolve: (value: boolean) => void, reject: (reason?: unknown) => void) =>
              maybe.catch(reject).then((value: boolean) => resolve(!value))
          )
        else
          throw new Error('predicate must return Promise or boolean')
      }
    )
  }
