import esbuild from "esbuild"
import sassPlugin from "esbuild-sass-plugin"
import fs from "node:fs/promises"

function getEntries(): Record<string, string> {
    // JS
    const scripts = ["auto/goto", "auto/submit", "inject/inject", "setup"]
    const entries: Record<string, string> = {}
    for (const script of scripts) {
        entries[script] = `./src/${script}.ts`
    }

    // CSS
    entries["style"] = "./css/style.scss"

    // Static assets
    const assets = ["96x96.png", "manifest.json"]
    for (const file of assets) {
        const name = file.substring(0, file.search("\\."))
        entries[name] = `./static/${file}`
    }
    return entries
}

async function build() {
    // Compile payloads to be used in injector
    await esbuild.build({
        bundle: true,
        format: "iife",
        outdir: "payload",
        entryPoints: ["src/ui/wait.ts", "src/ui/main.tsx"],
        // These become strings for `src/inject/inject.ts`, so use .txt
        outExtension: { ".js": ".txt" }
    })
    // Compile everything else
    await esbuild.build({
        bundle: true,
        format: "iife",
        outdir: "build",
        entryPoints: getEntries(),
        plugins: [sassPlugin()],
        loader: {
            ".png": "copy",
            ".json": "copy",
        }
    })
}

build()