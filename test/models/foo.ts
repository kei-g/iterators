/* eslint-disable @typescript-eslint/no-namespace */

import { expect } from 'chai'

export type Foo = {
  id: number
  name: string
}

export namespace Foo {
  export const Members = [
    {
      id: 1,
      name: 'foo',
    },
    {
      id: 2,
      name: 'bar',
    },
    {
      id: 3,
      name: 'baz',
    },
  ]

  export const compose = (id: number, name: string): Foo => {
    return {
      id,
      name,
    }
  }

  export const idSelector = (foo: Foo): number => foo.id

  export const includes = (value: Foo | number | string): boolean => {
    if (typeof value === 'number')
      return Members.map(idSelector).includes(value)
    if (typeof value === 'string')
      return Members.map(nameSelector).includes(value)
    return Members.some((foo: Foo) => foo.id === value.id && foo.name === value.name)
  }

  export const nameSelector = (foo: Foo): string => foo.name

  export const testAsync =
    async (names: AsyncIterable<string>): Promise<void> => {
      for await (const name of names)
        expect(Foo.Members.map(nameSelector)).to.contain(name)
    }
}
