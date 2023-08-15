import { isNumber } from 'lodash-unified'
import toValue from '../toValue'

export interface PauseableTimerOptions {
  /**
   * 创建时立即启动计时器，如果设为 `false`，则必须手动调用 `resume()` 才可恢复定时任务
   * @default true
   */
  immediate?: boolean
  /**
   * 启动计时器时立即执行一次回调
   * @default false
   */
  immediateCallback?: boolean
  /**
   * 计时器类型
   * - `setTimeout`: 每次仅执行一次就结束
   * - `setInterval`: 循环执行，直到手动调用 `pause()`
   * - `requestAnimationFrame`: 循环执行，直到手动调用 `pause()`，非客户端环境时降级为 `setTimeout(fn, 16)`
   * @default 'setInterval'
   */
  timerType?: 'setTimeout' | 'setInterval' | 'requestAnimationFrame'
}

const isClient = typeof window !== 'undefined'

/**
 * 创建可中断的计时器
 *
 * @param callback 具体的任务执行函数
 * @param ms 计时器延迟时间，单位：`ms`，非 `0` 或小于 `0` 时不会开启任务，若 `timerType=requestAnimationFrame`，则此参数无效
 * @param timerType 计时器类型
 *
 * @example
 * ```ts
 * const timer = pauseableTimer(() => {
 *   console.log(Date.now())
 * }, {
 *   // 创建时不立即执行，需手动调用 `resume()` 恢复
 *   immediate: false
 * })
 *
 * // 恢复定时任务
 * timer.resume()
 *
 * // 停止定时任务
 * timer.pause()
 *
 * // 立即执行一次定时任务
 * timer.flush()
 * ```
 */
export default function pauseableTimer(
  callback: () => void,
  ms: number | (() => number) = 0,
  options: PauseableTimerOptions = {},
) {
  const { immediate = true, immediateCallback = false, timerType = 'setInterval' } = options

  type TimerFn = (callback: () => void, ms?: number) => number
  type ClearTimerFn = (id: number) => void

  let timer, timerFn: TimerFn, clearTimerFn: ClearTimerFn
  switch (timerType) {
    case 'requestAnimationFrame':
      timerFn = isClient ? requestAnimationFrame : (fn) => setTimeout(fn, 16) as any
      clearTimerFn = isClient ? cancelAnimationFrame : clearTimeout
      break
    case 'setTimeout':
      timerFn = setTimeout
      clearTimerFn = clearTimeout
      break
    case 'setInterval':
    default:
      timerFn = setInterval
      clearTimerFn = clearInterval
      break
  }

  let active = false
  const isActive = () => active

  const _callback = () => {
    callback()
    if (timerType === 'setTimeout') active = false
    if (timerType === 'requestAnimationFrame') resume()
  }

  const clean = () => {
    if (timer) {
      clearTimerFn(timer)
      timer = null
    }
  }

  /**
   * 恢复定时任务
   */
  function resume() {
    const msValue = toValue(ms)
    if (
      timerType !== 'requestAnimationFrame' &&
      (!isNumber(msValue) || Number.isNaN(msValue) || msValue < 0)
    ) {
      active = false
      return
    }

    active = true
    if (immediateCallback) callback()

    clean()
    timer = timerFn(_callback, timerType !== 'requestAnimationFrame' ? msValue : undefined)
  }

  /**
   * 停止定时任务
   */
  function pause() {
    active = false
    clean()
  }

  /**
   * 立即执行函数，将会取消已存在的定时任务
   */
  function flush() {
    active = true
    clean()
    callback()
    active = false
  }

  if (immediate) resume()

  return { isActive, resume, pause, flush }
}
