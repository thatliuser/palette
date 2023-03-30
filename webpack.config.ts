import path from "path"
import wp from "webpack"

class GenerateInjectorPlugin {
    name = this.constructor.name
    compile?: wp.Compilation

    onProcessAssets() {
        const hook = this.compile?.getAsset("ui/hook.js")!
        const source = hook.source.buffer().toString()
        // Escape format string
        source.replaceAll("`", "\\`")
        const asset = new wp.sources.RawSource(`window.eval?.(\`${source}\`)`)
        this.compile?.emitAsset("ui/inject.js", asset)
    }

    onCompile(compile: wp.Compilation) {
        this.compile = compile
        compile.hooks.processAssets.tap(
            this.name,
            this.onProcessAssets.bind(this)
        )
    }

    apply(compiler: wp.Compiler) {
        compiler.hooks.compilation.tap(
            this.name,
            this.onCompile.bind(this)
        )
    }
}

function getEntries(): wp.EntryObject {
    // JS
    const scripts = ["auto/goto", "auto/submit", "ui/hook", "setup"]
    const entries: wp.EntryObject = {}
    for (const script of scripts) {
        entries[script] = `./ts/${script}.ts`
    }

    // CSS
    entries["style.css"] = "./css/style.scss"

    // Static assets
    const assets = ["96x96.png", "manifest.json"]
    for (const file of assets) {
        entries[file] = `./static/${file}`
    }
    return entries
}

const config: wp.Configuration = {
    mode: "production",
    context: __dirname,
    entry: getEntries(),
    module: {
        rules: [
            {
                test: new RegExp(".tsx?$"),
                use: "ts-loader",
            },
            {
                test: new RegExp(".scss$"),
                use: {
                    loader: "sass-loader",
                    // Disable minification
                    options: {
                        sassOptions: {
                            outputStyle: "expanded"
                        }
                    }
                },
                type: "asset/resource",
                generator: {
                    filename: "[name].css"
                }
            },
            {
                test: new RegExp("(.png|.json)$"),
                type: "asset/resource",
                generator: {
                    filename: "[name][ext]"
                }
            }
        ]
    },
    plugins: [new GenerateInjectorPlugin()],
    output: {
        path: path.resolve(__dirname, "build"),
        // We don't need a wrapper since Firefox extensions
        // Don't contaminate global namespace
        iife: false
    },
    // Disable minification
    optimization: {
        minimize: false
    }
}

export default config