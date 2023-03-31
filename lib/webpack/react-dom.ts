import { ChunkViewer } from "./runtime"

type ReactDOMType = typeof import("react-dom")
export let ReactDOM: ReactDOMType
export function initReactDOM(viewer: ChunkViewer) {
    const symbols = [
        "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED",
        "unmountComponentAtNode",
        "render"
    ]
    ReactDOM = viewer.getBySymbols(symbols)! as ReactDOMType
}