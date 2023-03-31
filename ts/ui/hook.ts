import type ReactType from "react"
import webpack from "./webpack"

async function hook() {
    const symbols = [
        "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED",
        "createElement",
        "useState"
    ]
    const viewer = new webpack.ChunkViewer()
    const React = await viewer.getBySymbols(symbols) as typeof ReactType
    console.log(`Hi from React v${React.version}`)
}

hook()