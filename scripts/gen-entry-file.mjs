import { resolve } from 'node:path'
import { cwd } from 'node:process'
import fs from 'fs-extra'

const onlyNamedExportFns = ['tree']

const srcDir = resolve(cwd(), 'src')

function writeEntryFile(content = '') {
  fs.writeFileSync(resolve(srcDir, 'index.ts'), content, { encoding: 'utf-8' })
}

function resolveEntryFileContent(fns = []) {
  const defaultExports = fns
    .filter((fn) => !onlyNamedExportFns.includes(fn))
    .map((fn) => `export { default as ${fn} } from './${fn}'`)
    .join('\n')
  const namedExports = fns
    .concat(onlyNamedExportFns)
    .map((fn) => `export * from './${fn}'`)
    .join('\n')
  return `\
${defaultExports}

${namedExports}
`
}

function start() {
  const fns = fs.readdirSync(resolve(srcDir)).filter((name) => {
    return fs.statSync(resolve(srcDir, name)).isDirectory()
  })
  const content = resolveEntryFileContent(fns)
  writeEntryFile(content)
}

start()
