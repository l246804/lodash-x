/**
 * 获取对象的符号属性列表，同 `Object.getOwnPropertySymbols`
 */
export default function symbolsOf<T extends object>(o: T) {
  return Object.getOwnPropertySymbols(o)
}
