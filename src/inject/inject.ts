import main from "payload/main.txt"
import wait from "payload/wait.txt"

type ExportFunctionOptions = {
    defineAs?: string,
    allowCrossOriginRequests?: boolean
}
// For some reason this isn't declared in @types/firefox-webext-browser
declare function exportFunction(func: Function, scope: Object, options?: ExportFunctionOptions): void

function injectPalette() {
    window.eval?.(main)
}

exportFunction(injectPalette, window, { defineAs: "injectPalette" })

window.eval?.(wait)
