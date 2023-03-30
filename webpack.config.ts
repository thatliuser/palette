import path from "path"
import * as wp from "webpack"

class GenerateInjectorPlugin {
    apply(compiler: wp.Compiler) {
        compiler.hooks.compilation.tap(
            this.constructor.name,
            (compile) => {
                compile.hooks.processAssets.tap({
                    name: this.constructor.name,
                    stage: wp.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
                }, async () => {
                    try {
                        const hook = await compile.getAsset("hook.js")!.source.buffer().toString()
                        // Escape format string
                        hook.replaceAll("`", "\\`")
                        compile.emitAsset("inject.js", new wp.sources.RawSource(`window.eval?.(\`${hook}\`)`))
                    }
                    catch (err) {
                        console.log(err)
                    }
                })
            }
        )
    }
}

function getEntries(): wp.EntryObject {
    // JS
    const scripts = ["auto/goto", "auto/submit", "hook", "setup"]
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