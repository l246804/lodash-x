import type { PropertyPath } from 'lodash-unified'
import { unset } from 'lodash-unified'

/**
 * 多版本 `unset`
 *
 * @example
 * ```ts
 * unsetAttrs({ a: 1, b: { c: 2, d: 4, e: 5 } }, ['a', 'c.e'])
 * // => { b: { c: 2, d: 4 } }
 * ```
 */
export default function unsetAttrs(o, keys: PropertyPath[] = []) {
  return keys.map((k) => unset(o, k))
}
