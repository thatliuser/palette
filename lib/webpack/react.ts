import { ChunkViewer } from "./runtime"

type ReactType = typeof import("react")
const React = (() => {
    const symbols = [
        "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED",
        "createElement",
        "useState"
    ]
    return ChunkViewer.getBySymbols(symbols)! as ReactType
})()
export default React