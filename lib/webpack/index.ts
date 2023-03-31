import { onChunksLoad, ChunkViewer } from "./runtime"
import { initReact } from "./react"
import { initReactDOM } from "./react-dom"

export function onModsLoad(callback: () => void) {
    onChunksLoad(() => {
        const viewer = new ChunkViewer()
        initReact(viewer)
        initReactDOM(viewer)
        callback()
    })
}