import assert from 'node:assert'
import { AsyncTransformer, Transformer } from '../src/index.ts'
import { Members, includes, nameSelector, testAsync } from './models/index.ts'
import { describe, it } from 'node:test'

describe('async transformer', () => {
  it('is able to transform', async () =>
    await testAsync(new AsyncTransformer(Members, nameSelector))
  )
})

describe('transformer', () => {
  it('is able to perform as AsyncIterable', async () =>
    await testAsync(new Transformer(Members, nameSelector))
  )
  it('is able to transform', () => {
    const tx = new Transformer(Members, nameSelector)
    for (const name of tx)
      assert(includes(name))
  })
})
