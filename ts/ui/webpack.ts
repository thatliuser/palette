import { Maybe } from "../util"

namespace webpack {
    export type ModuleId = string | number
    export type Module = Object
    export type ModuleLoadFunc = (exports: Object, module: Module, require: Require) => void
    export type ModuleLoadMap = Record<ModuleId, ModuleLoadFunc>
    export type Require = ((id: ModuleId) => Module) & {
        m: ModuleLoadMap
    }
    export type RuntimeFunc = (require: Require) => void
    export type Chunks = [ModuleId[], ModuleLoadMap][] & {
        push(elem: [chunkIds: ModuleId[], moreModules: Module, runtime: RuntimeFunc]): void
    }

    export class ChunkViewer {
        private static MODULE_ID: ModuleId = "palette"

        private static getRequireImpl(chunks: Chunks): Require {
            let require: Maybe<Require>
            // Hack to intercept WebPack's require function, inspired by BetterDiscord 
            // https://github.com/BetterDiscord/BetterDiscord/blob/main/renderer/src/modules/webpackmodules.js#L388
            chunks.push([[ChunkViewer.MODULE_ID], {}, (req) => require = req])
            // We know require is non-null now
            return require!
        }

        private require: Maybe<Require>

        async getRequire(): Promise<Require> {
            // If we cached the require function, just return it
            if (this.require) {
                return this.require
            }
            // Otherwise, get it
            return new Promise<Require>(resolve => {
                const func = () => {
                    if (webpackChunkcanvas_lms) {
                        this.require = ChunkViewer.getRequireImpl(webpackChunkcanvas_lms)
                        resolve(this.require)
                    }
                    else {
                        // HACK: This is a race condition. The chunks may not be loaded at document ready.
                        // Try again later on.
                        setTimeout(func, 100)
                    }
                }
                func()
            })
        }

        private hasSymbols(module: Object, symbols: string[]): boolean {
            for (const symbol of symbols) {
                if (!(symbol in module)) {
                    return false
                }
            }
            return true
        }

        async getBySymbols(symbols: string[]): Promise<Maybe<Module>> {
            const require = await this.getRequire()
            // We know this is non-null if we have the require function
            for (const moduleId of Object.keys(require.m)) {
                try {
                    const module = require(moduleId)
                    if (this.hasSymbols(module, symbols)) {
                        return module
                    }
                } catch {
                    continue
                }
            }
            return undefined
        }
    }
}

export default webpack

declare global {
    var webpackChunkcanvas_lms: Maybe<webpack.Chunks>
}