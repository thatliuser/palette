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

    private static require = ChunkViewer.getRequire(webpackChunkcanvas_lms)

    private static hasSymbols(module: Object, symbols: string[]): boolean {
        for (const symbol of symbols) {
            if (!(symbol in module)) {
                return false
            }
        }
        return true
    }

    static getBySymbols(symbols: string[]): Maybe<Module> {
        // We know this is non-null if we have the require function
        for (const moduleId of Object.keys(ChunkViewer.require.m)) {
            try {
                const module = ChunkViewer.require(moduleId)
                if (ChunkViewer.hasSymbols(module, symbols)) {
                    return module
                }
            } catch {
                continue
            }
        }
        return undefined
    }
}

declare global {
    var webpackChunkcanvas_lms: Chunks
}