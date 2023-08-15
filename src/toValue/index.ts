import { isFunction } from 'lodash-unified'

/**
 * 获取值，若 `value` 是函数，则后面的参数将传入其中并得到结果
 *
 * @example
 * ```ts
 * toValue(1)
 * // => 1
 *
 * toValue(() => 1)
 * // => 1
 *
 * toValue((v) => v, 1)
 * // => 1
 * ```
 */
export default function toValue<
  T,
  P extends any[] = T extends (...args: infer Args) => any ? Args : [],
  R = T extends (...args) => infer Value ? Value : T,
>(value: T, ...args: P): R {
  return isFunction(value) ? value(...args) : value
}
