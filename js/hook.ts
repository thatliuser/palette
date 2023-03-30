(() => {
    // Hack to intercept WebPack's require function
    // Inspired by BetterDiscord (https://github.com/BetterDiscord/BetterDiscord/blob/main/renderer/src/modules/webpackmodules.js#L388)
    let __webpack_require__: Webpack.Require = (id) => {
        return {}
    }
    window.webpackChunkcanvas_lms.push([[0xC0FFEE], {}, (require) => {
        __webpack_require__ = require
    }])
    console.log((__webpack_require__(72408) as any).version)
})()