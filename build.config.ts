import { ModuleResolutionKind } from 'typescript'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  clean: true,
  declaration: true,
  failOnWarn: false,
  rollup: {
    emitCJS: true,
    dts: {
      compilerOptions: {
        moduleResolution: ModuleResolutionKind.Bundler,
        noEmitOnError: false,
      },
    },
  },
})
