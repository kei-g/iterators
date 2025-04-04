import assert from 'node:assert'
import { AsyncTransformer, Transformer } from '../src'
import { Foo } from './models'
import { describe, it } from 'mocha'

describe('async transformer', () => {
  it('is able to transform', async () =>
    await Foo.testAsync(new AsyncTransformer(Foo.Members, Foo.nameSelector))
  )
})

describe('transformer', () => {
  it('is able to perform as AsyncIterable', async () =>
    await Foo.testAsync(new Transformer(Foo.Members, Foo.nameSelector))
  )
  it('is able to transform', () => {
    const tx = new Transformer(Foo.Members, Foo.nameSelector)
    for (const name of tx)
      assert(Foo.includes(name))
  })
})
