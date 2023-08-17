import { assign, orderBy } from 'lodash-unified'
import type { Recordable } from '@rhao/types-base'
import type { BasicTreeOptions } from '../setupDefaults'
import setupDefaults from '../setupDefaults'
import batchUnset from '../batchUnset'

type OrderByParams<T extends object> = Parameters<typeof orderBy<T[]>>

export interface ToArrayTreeOptions<T extends object> extends BasicTreeOptions {
  /**
   * 键映射，映射后节点将必定包含映射键
   */
  keyMap?: Pick<BasicTreeOptions, 'key' | 'parentKey' | 'childrenKey'>
  /**
   * 排序数组，依赖于 `orderBy()`，参数同其第 `2` 第 `3` 参数
   */
  orderBy?: [iterates?: OrderByParams<T>[1], orders?: OrderByParams<T>[2]]
}

function strictTree(array: any[], opts: ToArrayTreeOptions<any>) {
  array.forEach((item) => {
    if (!item[opts.childrenKey!]?.length)
      batchUnset(item, [opts.childrenKey, opts.keyMap?.childrenKey].filter(Boolean) as string[])
  })
}

function setAttr(treeData: Recordable<any>, key?: string, value?: any) {
  if (key) treeData[key] = value
}

/**
 * 将一个带层级的数据列表转成树结构
 *
 * @example
 * ```ts
 * // 默认树结构
 * const list = [
 *   { id: 1, name: '111' },
 *   { id: 2, parentId: 1, name: '222' },
 *   { id: 3, name: '333' },
 *   { id: 4, parentId: 2, name: '444' }
 * ]
 *
 * const tree = toArrayTree(list)
 * [
 *   {
 *     id: 1,
 *     name: '111',
 *     children: [
 *       {
 *         id: 2,
 *         name: '222',
 *         parentId: 1,
 *         children: [
 *           {
 *             id: 4,
 *             name: '444',
 *             parentId: 2,
 *             children: []
 *           }
 *         ]
 *       }
 *     ]
 *   },
 *   {
 *     id: 3,
 *     name: '333',
 *     children: []
 *   }
 * ]
 * ```
 */
export default function toArrayTree<T extends object = any>(
  array: T[],
  options?: ToArrayTreeOptions<T>,
): T[] {
  // 合并配置项
  const opts = assign({}, setupDefaults.treeOptions, options)

  // 浅克隆并排序数组
  if (opts.orderBy) array = orderBy(array.slice(0), ...opts.orderBy) as T[]

  const result: T[] = []
  const treeMap: Recordable<T[]> = {}
  const idsMap: Recordable<boolean> = {}
  let id, treeData, parentId

  // 记录 id
  array.forEach((item) => {
    id = item[opts.key!]
    idsMap[id] = true
  })

  array.forEach((item) => {
    id = item[opts.key!]

    // 设置节点数据
    if (opts.dataKey) {
      treeData = {}
      treeData[opts.dataKey] = item
    } else {
      treeData = item
    }

    parentId = item[opts.parentKey!]

    // 记录 id 数据并构成关联关系
    treeMap[id] = treeMap[id] || []
    treeMap[parentId] = treeMap[parentId] || []
    treeMap[parentId].push(treeData)

    {
      // 填充节点基础数据
      const { key, parentKey, childrenKey } = opts
      setAttr(treeData, key, id)
      setAttr(treeData, parentKey, parentId)
      setAttr(treeData, childrenKey, treeMap[id])
    }

    // 设置映射子级属性
    if (opts.keyMap) {
      const { key, parentKey, childrenKey } = opts.keyMap
      setAttr(treeData, key, id)
      setAttr(treeData, parentKey, parentId)
      setAttr(treeData, childrenKey, treeMap[id])
    }

    // 根节点
    if ((!opts.strict || parentId == null) && !idsMap[parentId]) result.push(treeData)
  })

  // 严格模式去掉子级属性
  if (opts.strict) strictTree(array, opts)

  return result
}
