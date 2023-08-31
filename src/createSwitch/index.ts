import type { Fn } from '@rhao/types-base'
import { isFunction } from 'lodash-unified'

type SwitchCallback<T> = Fn<[value: T]>

export interface CreateSwitchOptions<T = boolean> {
  /**
   * 初始值
   * @default false
   */
  initialValue?: T
  /**
   * 打开时的值
   * @default true
   */
  openValue?: T
  /**
   * 关闭时的值
   * @default false
   */
  closeValue?: T
  /**
   * 一次性开关，如果设为 `true`，则在第一次切换之后切换无效，直到 `revert` 被调用。
   * @default false
   */
  once?: boolean
  /**
   * 切换时触发
   */
  onToggle?: SwitchCallback<T>
}

/**
 * 创建开关
 *
 * @example
 * ```ts
 * const handleSwitchToggle = (val) => {
 *   console.log('开关值：', val)
 * }
 * const [isCanceled, cancelControls] = createSwitch(handleSwitchToggle)
 *
 * isCanceled()
 * // => false
 *
 * cancelControls.toggle()
 * isCanceled()
 * // => true
 *
 * cancelControls.toggle()
 * isCanceled()
 * // => false
 *
 * cancelControls.open()
 * isCanceled()
 * // => true
 *
 * cancelControls.close()
 * isCanceled()
 * // => false
 *
 * cancelControls.open()
 * // 还原为初始状态
 * cancelControls.revert()
 * isCanceled()
 * // => false
 * ```
 */
export default function createSwitch<T = boolean>(
  options?: SwitchCallback<T> | CreateSwitchOptions<T>,
) {
  const {
    initialValue = false,
    closeValue = false,
    openValue = true,
    once = false,
    onToggle,
  } = isFunction(options) ? { onToggle: options } : options || {}

  let allowWrite = true
  let value = initialValue as T

  function read() {
    return value
  }
  function write(val) {
    if (!allowWrite) return
    if (once) allowWrite = false
    value = val
    onToggle?.(value)
  }
  function toggle() {
    write(value === openValue ? closeValue : openValue)
  }
  function open() {
    write(openValue)
  }
  function close() {
    write(closeValue)
  }
  function revert() {
    allowWrite = true
    write(initialValue)
  }

  const controls = { toggle, open, close, revert }

  return [read, controls] as const
}
