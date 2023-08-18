import { helperCreateTreeFunc } from '../tree'
import type { BasicTreeOptions, HelperCreateTreeFuncHandler } from '../tree'

export interface ForEachTreeOptions extends Pick<BasicTreeOptions, 'childrenKey'> {}

const forEachTreeNode: HelperCreateTreeFuncHandler<ForEachTreeOptions> = (
  tree,
  iter,
  parent,
  paths,
  nodes,
  childrenKey,
  options,
) => {
  let _paths, _nodes

  tree.forEach((node, index) => {
    // 记录当前链路
    _paths = paths.concat(`${index}`)
    _nodes = nodes.concat(node)

    // 执行外部迭代器
    iter.call(tree, node, index, parent, _paths, _nodes, tree)

    // 递归遍历子级
    if (node[childrenKey]) {
      forEachTreeNode(
        node[childrenKey],
        iter,
        node,
        _paths.concat(childrenKey),
        _nodes,
        childrenKey,
        options,
      )
    }
  })
}

const forEachTree = helperCreateTreeFunc(forEachTreeNode)

export default forEachTree
