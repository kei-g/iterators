import assert from 'node:assert'
import { Members, compose, idSelector, includes, nameSelector } from './models/index.ts'
import { ZippedIterable } from '../src/index.ts'
import { describe, it } from 'node:test'

describe('zip', () => {
  it('is able to zip', () => {
    for (const foo of new ZippedIterable(
      Members.map(idSelector),
      Members.map(nameSelector),
      compose
    ))
      assert(includes(foo))
  })
})
