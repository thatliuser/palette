import fs from "node:fs/promises"

async function main() {
    // Move files from static folder.
    const files = await fs.readdir("static")
    for (const file of files) {
        fs.cp(`static/${file}`, `build/${file}`)
    }

    // Create inject.js to inject hook.js into page script.
    const hook = (await fs.readFile("build/hook.js")).toString()
    // Escape format string
    hook.replaceAll("`", "\\`")
    // Use indirect eval - it's faster (?)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#using_indirect_eval
    const inject = `window.eval?.(\`${hook}\`)`
    fs.writeFile("build/inject.js", inject)
}

main()