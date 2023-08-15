export interface ToSwitchOptions<T = boolean> {
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
}

/**
 * 创建开关
 *
 * @example
 * ```ts
 * const handleSwitchToggle = (val) => {
 *   console.log('开关值：', val)
 * }
 * const [isCanceled, cancelControls] = toSwitch(handleSwitchToggle)
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
export default function toSwitch<T = boolean>(
  onToggle?: (value: T) => void,
  options?: ToSwitchOptions<T>,
) {
  const { initialValue = false, closeValue = false, openValue = true, once = false } = options || {}

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

  return [read, controls]
}
