import { ChunkViewer } from "./runtime"

type ReactType = typeof import("react")
export let React: ReactType
export function initReact(viewer: ChunkViewer) {
    const symbols = [
        "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED",
        "createElement",
        "useState"
    ]
    React = viewer.getBySymbols(symbols)! as ReactType
}