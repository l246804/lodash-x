import type { Falsey } from 'lodash'
import { fromPairs, toPairs } from 'lodash-unified'

/**
 * 对象版 `compact`
 *
 * @example
 * ```ts
 * compactObject({ a: 1, b: 0, c: false, d: '' })
 * // => { a: 1 }
 * ```
 */
export default function compactObject<const T extends object>(object: T) {
  return fromPairs(toPairs(object).filter(([_, v]) => !!v)) as {
    -readonly [K in keyof T as T[K] extends Falsey ? never : K]: T[K]
  }
}
