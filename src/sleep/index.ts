/**
 * 睡眠 `n` 毫秒
 *
 * @example
 * ```ts
 * async run() {
 *   console.log(Date.now())
 *   await sleep(1000)
 *   console.log(Date.now())
 * }
 * ```
 */
export default function sleep(ms = 0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, ms)
  })
}
