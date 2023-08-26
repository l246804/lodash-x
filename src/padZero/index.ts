import { padStart } from 'lodash-unified'

/**
 * 填充 `0`
 *
 * @example
 * ```ts
 * padZero(1)
 * // => '01'
 *
 * padZero(10)
 * // => '10'
 *
 * padZero(10, 4)
 * // => '0010'
 * ```
 */
export default function padZero(num: string | number, targetLength = 2) {
  return padStart(`${num}`, targetLength, '0')
}
