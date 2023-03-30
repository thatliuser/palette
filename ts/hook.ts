import type ReactType from "react"
import Webpack from "./webpack"

// Hack to intercept WebPack's require function
// Inspired by BetterDiscord (https://github.com/BetterDiscord/BetterDiscord/blob/main/renderer/src/modules/webpackmodules.js#L388)
function initWebpack() {
    let temp: any
    const elem: Webpack.Push = [[0xC0FFEE], {}, (require: Webpack.Require) => {
        temp = require
    }]
    const chunk = window.webpackChunkcanvas_lms
    if (chunk) {
        chunk.push(elem)
        const __webpack_require__ = (temp as Webpack.Require)
        const React = (__webpack_require__(72408) as typeof ReactType)
        console.log(React.version)
        return __webpack_require__
    }
    else {
        // HACK: This is a race condition. The chunks may not be loaded at document ready.
        // Try again later on.
        console.log("Waiting a bit")
        setTimeout(initWebpack, 100)
    }
}

initWebpack()