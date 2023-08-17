export interface BasicTreeOptions {
  /**
   * 严格模式，如果设为 `true`，会去掉父子关联不存在数据，当子节点为空时将没有 `childrenKey` 和 `keyMap.childrenKey` 属性
   * @default false
   */
  strict?: boolean
  /**
   * 节点键值
   * @default 'id'
   */
  key?: string
  /**
   * 父节点键值
   * @default 'parentId'
   */
  parentKey?: string
  /**
   * 子节点键值
   * @default 'children'
   */
  childrenKey?: string
  /**
   * 数据存放键值，未设置时将平铺在节点上
   */
  dataKey?: string

  [K: string]: any
}

export interface SetupDefaults {
  treeOptions?: BasicTreeOptions
}

const setupDefaults: SetupDefaults = {
  treeOptions: {
    key: 'id',
    parentKey: 'parentId',
    childrenKey: 'children',
  },
}

export default setupDefaults
