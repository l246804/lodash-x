import type { BasicTreeOptions, HelperCreateTreeFuncHandler, TreeIterator } from '../tree'
import { helperCreateTreeFunc } from '../tree'

export interface MapTreeOptions extends Pick<BasicTreeOptions, 'childrenKey'> {
  /**
   * 映射后的子节点键，设置后则必定存在于节点上
   */
  mapChildrenKey?: string
}

const mapTreeNode: HelperCreateTreeFuncHandler<MapTreeOptions, any[], any> = (
  tree,
  iter,
  parent,
  paths,
  nodes,
  childrenKey,
  options,
) => {
  let _paths, _nodes
  const mapChildrenKey = options.mapChildrenKey || childrenKey
  return tree.map((node, index) => {
    _paths = paths.concat(`${index}`)
    _nodes = nodes.concat(node)

    // 执行外部迭代器获取新节点
    const newNode = iter.call(tree, node, index, parent, _paths, _nodes, tree)

    // 若当前节点存在子级则递归遍历
    if (newNode[childrenKey]) {
      const children = mapTreeNode(
        newNode[childrenKey],
        iter,
        node,
        _paths.concat(childrenKey),
        _nodes,
        childrenKey,
        options,
      )
      // 同步映射子级和原始子级
      newNode[mapChildrenKey] = newNode[childrenKey] = children
    }

    // 返回新节点
    return newNode
  })
}

const mapTree = helperCreateTreeFunc(mapTreeNode)

export default mapTree as <T extends object, U extends object>(
  array: T[],
  iterator: TreeIterator<T, U>,
  options?: MapTreeOptions | undefined,
) => U[]
