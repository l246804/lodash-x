import type { BasicTreeOptions } from '../tree'

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
