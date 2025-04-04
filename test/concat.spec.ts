import { ConcatenatedAsyncIterable, ConcatenatedIterable } from '../src'
import { describe, it } from 'mocha'
import { equal } from 'node:assert'

describe('async concat', () => {
  it('asynchronous', async () =>
    await testAsync(ConcatenatedAsyncIterable.of(...source))
  )
})

describe('concat iterable', () => {
  it('asynchronous', async () =>
    await testAsync(ConcatenatedIterable.of(...source))
  )
  it('synchronous', () => {
    let index = 1
    for (const value of new ConcatenatedIterable(
      [1, 2, 3],
      [4, 5, 6, 7, 8],
    ))
      equal(value, index++)
  })
})

const source = [[1, 2, 3], [4, 5, 6], [7, 8]]

const testAsync = async <T>(source: AsyncIterable<T>) => {
  let index = 1
  for await (const value of source)
    equal(value, index++)
}
