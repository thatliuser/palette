import { ChunkViewer } from "./runtime"

type ReactDOMType = typeof import("react-dom")
const ReactDOM = (() => {
    const symbols = [
        "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED",
        "unmountComponentAtNode",
        "render"
    ]
    return ChunkViewer.getBySymbols(symbols)! as ReactDOMType
})()
export default ReactDOM