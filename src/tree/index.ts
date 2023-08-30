/* eslint-disable @typescript-eslint/indent */
import type { Fn, MaybeNullish } from '@rhao/types-base'
import { assign } from 'lodash-unified'
import setupDefaults from '../setupDefaults'
import type { FindResult, FindResultFlag } from '../findTree'

export interface BasicTreeOptions {
  /**
   * 严格模式，如果设为 `true`，会去掉父子关联不存在数据，当子节点为空时将没有 `childrenKey` 和 `keyMap.childrenKey` 属性
   * @default false
   */
  strict?: boolean
  /**
   * 节点键
   * @default 'id'
   */
  key?: string
  /**
   * 父节点键
   * @default 'parentId'
   */
  parentKey?: string
  /**
   * 子节点键
   * @default 'children'
   */
  childrenKey?: string
  /**
   * 数据存放键，未设置时将平铺在节点上
   */
  dataKey?: string

  [K: string]: any
}

export type TreeIterator<T, R = void> = (
  /**
   * 当前节点
   */
  node: T,
  /**
   * 节点在当前层的索引
   */
  index: number,
  /**
   * 父级节点
   */
  parent: MaybeNullish<T>,
  /**
   * 路径链路
   */
  paths: string[],
  /**
   * 路径节点
   */
  nodes: T[],
  /**
   * 树集合
   */
  tree: T[],
) => R

export type HelperCreateTreeFuncHandler<O extends BasicTreeOptions, R = void, IR = R> = Fn<
  [
    tree: any[],
    iter: TreeIterator<any, IR>,
    parent: MaybeNullish<any>,
    paths: string[],
    nodes: any[],
    childrenKey: string,
    options: O,
  ],
  R
>

type HelperCreateTreeFuncHandlerResult<T extends object, R> = R extends FindResultFlag
  ? FindResult<T> | null
  : R

export function helperCreateTreeFunc<
  H extends HelperCreateTreeFuncHandler<any, any, any>,
  O extends BasicTreeOptions = H extends HelperCreateTreeFuncHandler<infer HO, any, any> ? HO : any,
  R = H extends HelperCreateTreeFuncHandler<any, infer HR, any> ? HR : any,
  IR = H extends HelperCreateTreeFuncHandler<any, any, infer HIR> ? HIR : any,
>(
  handler: H,
): <T extends object>(
  array: T[],
  iterator: TreeIterator<T, IR>,
  options?: O,
) => HelperCreateTreeFuncHandlerResult<T, R> {
  return function (array, iterator, options) {
    const opts = assign({}, setupDefaults.treeOptions, options)
    return handler(array, iterator, null, [], [], opts.childrenKey || 'children', opts) as any
  }
}
