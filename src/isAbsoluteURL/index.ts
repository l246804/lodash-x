/**
 * 是否时绝对 URL
 *
 * @see https://github.com/axios/axios/blob/v1.x/lib/helpers/isAbsoluteURL.js
 *
 * @example
 * ```ts
 * isAbsoluteURL('./a.txt')
 * // => false
 *
 * isAbsoluteURL('http://www.ccc.cn/a.img')
 * // => true
 * ```
 */
export default function isAbsoluteURL(url: string) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)
}
