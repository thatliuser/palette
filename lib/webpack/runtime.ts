import { Maybe } from "lib/util"

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

    private static getRequire(chunks: Chunks): Require {
        let require: Maybe<Require>
        // Hack to intercept WebPack's require function, inspired by BetterDiscord
        // https://github.com/BetterDiscord/BetterDiscord/blob/main/renderer/src/modules/webpackmodules.js#L388
        chunks.push([[ChunkViewer.MODULE_ID], {}, (req) => require = req])
        // We know require is non-null now
        return require!
    }

    private require = ChunkViewer.getRequire(webpackChunkcanvas_lms!)

    private hasSymbols(module: Object, symbols: string[]): boolean {
        for (const symbol of symbols) {
            if (!(symbol in module)) {
                return false
            }
        }
        return true
    }

    getBySymbols(symbols: string[]): Maybe<Module> {
        // We know this is non-null if we have the require function
        for (const moduleId of Object.keys(this.require.m)) {
            try {
                const module = this.require(moduleId)
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

export function onChunksLoad(func: () => void) {
    try {
        const chunk = webpackChunkcanvas_lms!
        func()
    }
    catch {
        // HACK: This is a race condition. The chunks may not be loaded at document ready.
        // Try again later on.
        setTimeout(onChunksLoad.bind(func), 100)
    }
}

declare global {
    var webpackChunkcanvas_lms: Maybe<Chunks>
}