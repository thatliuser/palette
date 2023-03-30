export = Webpack

namespace Webpack {
    export type Require = (moduleId: number) => any
    export type Runtime = (require: Require) => void
    export type Push = [chunkIds: number[], moreModules: any, runtime: Runtime]
    export type Chunk = [number, any][][] | {
        push(elem: Push): void
    }
}

declare global {
    var webpackChunkcanvas_lms: Webpack.Chunk | undefined
}