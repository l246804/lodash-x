import type { MaybeNullish } from '@rhao/types-base'

type SetValue<T = any> = (value: T) => void

export interface SafeJSONParseContext<T> {
  /**
   * 本次解析是否失败
   */
  isFail: () => boolean
  /**
   * 获取错误对象
   */
  getError: () => Error | undefined
  /**
   * 获取 `json` 文本
   */
  getJSON: () => string
  /**
   * 获取解析后的值
   */
  getValue: () => MaybeNullish<T>
  /**
   * 设置 `json`
   */
  setJSON: SetValue<string>
  /**
   * 设置解析后的值
   */
  setValue: SetValue
}

export interface SafeJSONParseOptions<T> {
  /**
   * 解析前回调
   */
  onBefore?: (context: SafeJSONParseContext<T>) => void
  /**
   * 解析后回调
   */
  onAfter?: (context: SafeJSONParseContext<T>) => void
  /**
   * 错误处理
   */
  errorHandler?: (error: Error, context: SafeJSONParseContext<T>) => void
  /**
   * `JSON.parse(text, reviver)`
   */
  reviver?: Parameters<typeof JSON.parse>[1]
}

/**
 * 安全的转换 JSON 字符串
 * @example
 * ```ts
 * const json = '{"a":1,"b":2}'
 * safeJSONParse(json) // => {a: 1, b: 2}
 *
 * const errorJson = '{a: 1, b: 2}'
 * safeJSONParse(errorJson) // => undefined
 * safeJSONParse(errorJson, { a: 123 }) // => {a: 123}
 * ```
 */
export default function safeJSONParse<T>(
  json: string,
  defaultValue?: T,
  options?: SafeJSONParseOptions<T>,
) {
  let value, error
  const context: SafeJSONParseContext<T> = {
    isFail: () => !!error,
    getError: () => error,
    getValue: () => value ?? defaultValue,
    getJSON: () => json,
    setValue: (v) => {
      value = v
    },
    setJSON: (v) => {
      json = v
    },
  }
  try {
    options?.onBefore?.(context)
    value = JSON.parse(json, options?.reviver)
  }
  catch (err: unknown) {
    error = err
    options?.errorHandler?.(error, context)
  }

  options?.onAfter?.(context)

  return context.getValue()
}
