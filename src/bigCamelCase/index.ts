import { camelCase, upperFirst } from 'lodash-unified'

/**
 * 大驼峰格式
 */
export default function bigCamelCase(string = '') {
  return upperFirst(camelCase(string))
}
