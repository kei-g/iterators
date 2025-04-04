import assert from 'node:assert'
import { Foo } from './models'
import { ZippedIterable } from '../src'
import { describe, it } from 'mocha'

describe('zip', () => {
  it('is able to zip', () => {
    for (const foo of new ZippedIterable(
      Foo.Members.map(Foo.idSelector),
      Foo.Members.map(Foo.nameSelector),
      Foo.compose
    ))
      assert(Foo.includes(foo))
  })
})
