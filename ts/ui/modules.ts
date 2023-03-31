import { ChunkViewer } from "./webpack"

type ReactType = typeof import("react")
type ReactDOMType = typeof import("react-dom")

export let React: ReactType
export let ReactDOM: ReactDOMType

function initReact(viewer: ChunkViewer) {
    const symbols = [
        "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED",
        "createElement",
        "useState"
    ]
    React = viewer.getBySymbols(symbols)! as ReactType
}

function initReactDOM(viewer: ChunkViewer) {
    const symbols = [
        "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED",
        "unmountComponentAtNode",
        "render"
    ]
    ReactDOM = viewer.getBySymbols(symbols)! as ReactDOMType
}

export function initMods() {
    const viewer = new ChunkViewer()
    initReact(viewer)
    initReactDOM(viewer)
}