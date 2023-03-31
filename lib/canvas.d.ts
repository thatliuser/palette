// https://github.com/instructure/canvas-lms/blob/master/ui/index.js#L63
export type CanvasReadinessTarget =
    "asyncInitializers"
    | "deferredBundles"
    | "capabilities"

declare global {
    var canvasReadyState: "loading" | "complete"
    interface Window {
        addEventListener(
            type: "canvasReadyStateChange",
            listener: (this: Window, event: CustomEvent<CanvasReadinessTarget>) => void
        ): void
    }
}