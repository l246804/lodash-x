import { isError } from 'lodash-unified'

/**
 * 强制转换为 `Error`
 *
 * @example
 * ```ts
 * castError(1)
 * // => Error { error: 'error', message: '1' }
 *
 * castError(new Error('This is error'))
 * // => Error { name: 'error', message: 'This is error' }
 *
 * castError({ name: 'TypedError', message: 'This is TypedError' })
 * // /=> Object { name: 'TypedError', message: 'This is TypedError' }
 * ```
 */
export default function castError(value) {
  return isError(value) ? value : new Error(String(value))
}
