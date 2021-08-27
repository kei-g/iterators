import { ConcatenatedIterable } from './src/index'

const foo = [8, 3, 8, 8, 6, 1]
const bar = [114, 514]

const baz = ConcatenatedIterable.of(foo, bar)
for (const v of baz)
  console.debug({ v })
