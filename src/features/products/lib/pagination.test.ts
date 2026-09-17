import { describe, expect, it } from 'vitest'

import { getPageItems } from './pagination'

describe('getPageItems', () => {
  it('pokazuje wszystkie strony, gdy jest ich mało', () => {
    expect(getPageItems(1, 3)).toEqual([1, 2, 3])
  })

  it('skraca długą listę wielokropkiem', () => {
    expect(getPageItems(5, 10)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10])
  })
})
