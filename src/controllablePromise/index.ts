/**
 * 创建可控的 `promise`
 *
 * @example
 * ```ts
 * const { promise, resolve } = controllablePromise()
 *
 * function run() {
 *   // 竟态执行
 *   return Promise.race([promise, sleep(10e3)])
 * }
 *
 * run()
 * // 中断运行，直接结束
 * resolve()
 * ```
 */
export default function controllablePromise<T = any>() {
  let resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })
  return {
    promise,
    // @ts-expect-error
    resolve,
    // @ts-expect-error
    reject,
  }
}
