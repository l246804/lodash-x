import { assign } from 'lodash-unified'
import type { BasicTreeOptions } from '../tree'
import setupDefaults from '../setupDefaults'
import batchUnset from '../batchUnset'

export interface ToTreeArrayOptions extends Pick<BasicTreeOptions, 'childrenKey' | 'dataKey'> {
  /**
   * 需要放弃的键，设置后将会移除对应键，例如节点上的 `children` 或其他。
   */
  dropKeys?: string[]
}

function unTreeList<T extends object = any>(result: T[], array: T[], opts: ToTreeArrayOptions) {
  array.forEach((item) => {
    // 获取子级列表
    const children = item[opts.childrenKey!]

    // 取出原始数据
    if (opts.dataKey) item = item[opts.dataKey]

    // 将数据添加进结果，若存在子级列表则递归遍历
    result.push(item)
    if (children?.length) unTreeList(result, children, opts)

    // 移除数据上的键
    if (opts.dropKeys) batchUnset(item, opts.dropKeys)
  })

  return result
}

/**
 * 将一个树结构转成数组列表
 */
export default function toTreeArray<T extends object = any>(
  array: T[],
  options?: ToTreeArrayOptions,
) {
  return unTreeList([], array, assign({}, setupDefaults.treeOptions, options))
}
