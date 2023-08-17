import type { PropertyPath } from 'lodash-unified'
import { unset } from 'lodash-unified'

/**
 * 批量执行 `unset` 操作
 *
 * @example
 * ```ts
 * batchUnset({ a: 1, b: { c: 2, d: 4, e: 5 } }, ['a', 'c.e'])
 * // => { b: { c: 2, d: 4 } }
 * ```
 */
export default function batchUnset(o, keys: PropertyPath[] = []) {
  return keys.map((k) => unset(o, k))
}
