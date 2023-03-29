module Webpack {
    type Require = (moduleId: number) => Object
    type Runtime = (require: Require) => void
    type Chunk = [number, Object][][] & {
        push(elem: [chunkIds: number[], moreModules: Object, runtime: Runtime])
    }
}

declare var webpackChunkcanvas_lms: Webpack.Chunk