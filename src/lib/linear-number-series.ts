export const EvenNumberSeries = (): Iterable<bigint> => new LinearNumberSeries({
  initial: 0n,
  slope: 2n,
})

export class LinearNumberSeries implements Iterable<bigint> {
  private readonly initial: bigint
  private readonly slope: bigint

  constructor(param?: {
    initial?: bigint,
    slope?: bigint,
  }) {
    this.initial = param?.initial ?? 0n
    this.slope = param?.slope ?? 1n
  }

  [Symbol.iterator](): Iterator<bigint> {
    return function* (self: LinearNumberSeries) {
      for (let n = self.initial; ; n += self.slope)
        yield n
    }(this)
  }
}

export const OddNumberSeries = (): Iterable<bigint> => new LinearNumberSeries({
  initial: 1n,
  slope: 2n,
})
