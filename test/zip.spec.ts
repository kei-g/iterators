import { Foo } from './models'
import { ZippedIterable } from '../src'
import { describe, it } from 'mocha'
import { expect } from 'chai'

describe('zip', () => {
  it('is able to zip', () => {
    for (const foo of new ZippedIterable(
      Foo.Members.map(Foo.idSelector),
      Foo.Members.map(Foo.nameSelector),
      Foo.compose
    ))
      expect(foo).to.satisfy(Foo.includes)
  })
})
