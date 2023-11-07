import type { Fn } from '@rhao/types-base'
import { assign } from 'lodash-unified'
import type { BasicTreeOptions, HelperCreateTreeFuncHandler, TreeIterator } from '../tree'
import { helperCreateTreeFunc } from '../tree'

export interface SearchTreeOptions extends Pick<BasicTreeOptions, 'childrenKey'> {
  /**
   * 是否返回源对象引用，易改变源对象数据结构
   * @default false
   */
  original?: boolean
  /**
   * 源数据引用键，`original` 为 `false` 时生效，未设置时则不引用源数据
   */
  originalDataKey?: string
  /**
   * 映射后的子节点键，设置后则必定存在于节点上
   */
  mapChildrenKey?: string
}

const _searchTreeNode: Fn<
  [
    allowParent: boolean,
    ...args: Parameters<HelperCreateTreeFuncHandler<SearchTreeOptions, any[], boolean>>,
  ],
  any[]
> = (allowParent, tree, iter, parent, paths, nodes, childrenKey, options) => {
  let _paths, _nodes, result, isAllow
  const results: any[] = []
  const mapChildrenKey = options.mapChildrenKey || childrenKey

  tree.forEach((node, index) => {
    _paths = paths.concat(`${index}`)
    _nodes = nodes.concat(node)

    // 父级通过时则子级一律通过，否则执行外部迭代器获取结果
    isAllow = allowParent || iter.call(tree, node, index, parent, _paths, _nodes, tree)

    // 通过时或有子级时则递归遍历
    if (isAllow || node[childrenKey]) {
      // 处理源对象引用
      if (options.original) {
        result = node
      }
      else {
        result = assign({}, node)
        if (options.originalDataKey) result[options.originalDataKey] = node
      }

      // 存在子级时同步映射子级和原始子级
      if (node[childrenKey]) {
        result[mapChildrenKey] = result[childrenKey] = _searchTreeNode(
          isAllow,
          node[childrenKey],
          iter,
          node,
          _paths.concat(childrenKey),
          _nodes,
          childrenKey,
          options,
        )
      }

      // 如果通过或子级存在通过则添加结果
      if (isAllow || result[mapChildrenKey]?.length) results.push(result)
    }
    else if (isAllow) {
      // 通过之后添加结果
      results.push(result)
    }
  })

  return results
}

const searchTreeNode: HelperCreateTreeFuncHandler<SearchTreeOptions, any[], boolean> = (
  ...args
) => {
  return _searchTreeNode(false, ...args)
}

const searchTree = helperCreateTreeFunc(searchTreeNode)

export default searchTree as <T extends object>(
  array: T[],
  iterator: TreeIterator<T, boolean>,
  options?: SearchTreeOptions | undefined,
) => T[]
