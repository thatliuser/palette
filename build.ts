import esbuild from "esbuild"
import sassPlugin from "esbuild-sass-plugin"
import fs from "node:fs/promises"

function getEntries(): Record<string, string> {
    // JS
    const scripts = ["auto/goto", "auto/submit", "setup"]
    const entries: Record<string, string> = {}
    for (const script of scripts) {
        entries[script] = `./src/${script}.ts`
    }
    entries["ui/hook"] = "./src/ui/hook.tsx"

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

async function emitInjector() {
    let hook = (await fs.readFile("build/ui/hook.js")).toString()
    // Escape format string and any literals
    hook = hook.replaceAll("`", "\\`").replaceAll("$", "\\$")
    await fs.writeFile("build/ui/inject.js", `window.eval?.(\`${hook}\`)`)
}

async function build() {
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
    await emitInjector()
}

build()