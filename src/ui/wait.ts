// Wait until Canvas is ready to inject the rest of the payload.
// https://github.com/instructure/canvas-lms/blob/master/ui/index.js#L63
export type CanvasReadinessTarget =
    "asyncInitializers"
    | "deferredBundles"
    | "capabilities"

declare global {
    interface Window {
        addEventListener(
            type: "canvasReadyStateChange",
            listener: (this: Window, event: CustomEvent<CanvasReadinessTarget>) => void
        ): void
        injectPalette(): void
    }
    var canvasReadyState: "loading" | "complete"
}

window.addEventListener("canvasReadyStateChange", () => {
    if (window.canvasReadyState === "complete") {
        window.injectPalette()
    }
})