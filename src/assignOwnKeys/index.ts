import { assign, keys, pick } from 'lodash-unified'

/**
 * 仅合并自身属性值
 *
 * @example
 * ```ts
 * assignOwnKeys({ a: 1 }, { b: 2 })
 * // => { a: 1 }
 *
 * assignOwnKeys({ a: 1, b: 2 }, { a: 3, b: 4, c: 5 })
 * // => { a: 3, b: 4 }
 * ```
 */
export default function assignOwnKeys<T extends object = any>(target: T, ...sources): T {
  const onlySource = assign({}, ...sources)
  return assign(target, pick(onlySource, keys(target)))
}
