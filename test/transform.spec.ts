import { AsyncTransformer, Transformer } from '../src/index'
import { Foo } from './models'
import { describe, it } from 'mocha'
import { expect } from 'chai'

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
      expect(name).to.satisfy(Foo.includes)
  })
})
