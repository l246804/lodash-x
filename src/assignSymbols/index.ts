import { isObject } from 'lodash-unified'
import symbolsOf from '../symbolsOf'

/**
 * 合并符号属性到目标对象上
 *
 * @example
 * ```ts
 * const obj = {}
 *
 * const obj1 = {}
 * obj1[Symbol('key1')] = 1
 *
 * const obj2 = {}
 * obj2[Symbol('key2')] = 2
 *
 * assignSymbols(obj, obj1, obj2)
 * obj // => { [Symbol('key1')]: 1, [Symbol('key2')]: 2 }
 * ```
 */
export default function assignSymbols<T extends object>(o: T, ...sources): T {
  if (isObject(o)) {
    for (const source of sources) {
      const symbols = symbolsOf(source || {})
      for (const syb of symbols) o[syb] = source[syb]
    }
  }
  return o
}
