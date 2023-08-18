import type { AllowNullish } from '@rhao/types-base'
import type { BasicTreeOptions, HelperCreateTreeFuncHandler } from '../tree'
import { helperCreateTreeFunc } from '../tree'

export interface FindTreeOptions extends Pick<BasicTreeOptions, 'childrenKey'> {}

export type FindResultFlag = '__FIND_RESULT__'

export interface FindResult<T = any> {
  index: number
  node: T
  paths: string[]
  nodes: T[]
  parent: AllowNullish<T>
  tree: T[]
}

const findTreeNode: HelperCreateTreeFuncHandler<FindTreeOptions, FindResultFlag, boolean> = (
  tree,
  iter,
  parent,
  paths,
  nodes,
  childrenKey,
  options,
) => {
  let _paths, _nodes, match
  for (let index = 0; index < tree.length; index++) {
    const node = tree[index]
    _paths = paths.concat(`${index}`)
    _nodes = nodes.concat(node)

    // 执行外部迭代器，若存在则返回
    if (iter.call(tree, node, index, parent, _paths, _nodes, tree)) {
      return {
        index,
        node,
        paths: _paths,
        nodes: _nodes,
        parent,
        tree,
      }
    }

    // 存在下一级时递归遍历
    if (node[childrenKey]) {
      match = findTreeNode(
        node[childrenKey],
        iter,
        node,
        _paths.concat(childrenKey),
        _nodes,
        childrenKey,
        options,
      )

      // 递归遍历的结果存在时返回
      if (match) return match
    }
  }

  // 递归结束时返回 null
  return null
}

const findTree = helperCreateTreeFunc(findTreeNode)

export default findTree
