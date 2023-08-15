import { isFunction } from 'lodash-unified'

/**
 * 强制转换为函数
 *
 * @example
 * ```ts
 * castFunction(1)
 * // => () => 1
 *
 * castFunction(() => true)
 * // () => true
 * ```
 */
export default function castFunction<T>(value: T) {
  return (isFunction(value) ? value : () => value) as T extends (...args: any[]) => any
    ? T
    : () => T
}
