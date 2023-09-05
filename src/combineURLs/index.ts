/**
 * 根据指定的 URLs 创建新的 URL
 *
 * @see https://github.com/axios/axios/blob/v1.x/lib/helpers/combineURLs.js
 *
 * @example
 * ```ts
 * combineURLs('/website')
 * // => '/website'
 *
 * combineURLs('/website/', '/api')
 * // => '/website/api'
 * ```
 */
export default function combineURLs(baseURL: string, relativeURL = '') {
  return relativeURL
    ? `${baseURL.replace(/\/+$/, '')}/${relativeURL.replace(/^\/+/, '')}`
    : baseURL
}
