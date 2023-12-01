# ~~@rhao/lodash-x~~

> ***废弃声明：该包已被废弃，推荐使用 [`nice-fns`](https://www.npmjs.com/package/nice-fns)，拥有完整的单测和文档，并实现和优化了该包所有功能！***

#### 迁移至指南

安装 `nice-fns`

```shell
# npm
npm i nice-fns

# yarn or pnpm
pnpm add nice-fns
```

函数迁移指南：

1. `assignOwnKeys` => `assignOwn`
2. `bigCamelCase` => `pascalCase`
3. `combineURLs` 支持多 `relativeURL`
4. `controllablePromise` => `promiseWithControl`
5. `createSwitch` 调用方式更改
6. `pauseableTimer` => `timerWithControl`
7. `safeJSONParse` => `parseJSON`
8. `setupDefaults` 被移除
9. `setupDefaults.treeOptions` => `treeDefaults`
