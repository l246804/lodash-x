# `@rhao/lodash-x`

#### 介绍

基于 `lodash` 扩展通用函数。

#### 安装教程

- `CommonJS` 模块下使用 `lodash`
- `ESModule` 模块下使用 `lodash-es`

```bash
# npm
npm i lodash-es @rhao/lodash-x
# yarn | pnpm
pnpm add lodash-es @rhao/lodash-x
```

#### 使用说明

```js
import { camelCase } from 'lodash-es'
import { bigCamelCase } from '@rhao/lodash-x'

const str = 'plain-text'

console.log(camelCase(str)) // plainText
console.log(bigCamelCase(str)) // PlainText
```
