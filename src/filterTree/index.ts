import forEachTree from '../forEachTree'
import type { BasicTreeOptions, TreeIterator } from '../tree'

export interface FilterTreeOptions extends Pick<BasicTreeOptions, 'childrenKey'> {}

/**
 * 从树结构中根据回调过滤数据
 */
export default function filterTree<T extends object = any>(
  array: T[],
  iterator: TreeIterator<T, boolean>,
  options?: BasicTreeOptions,
) {
  const result: T[] = []
  forEachTree(
    array,
    (node, ...args) => {
      if (iterator.call(array, node, ...args)) result.push(node)
    },
    options,
  )
  return result
}
