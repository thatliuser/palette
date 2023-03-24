import fs from "node:fs/promises"

async function main() {
    const files = await fs.readdir("static")
    for (const file of files) {
        fs.cp(`static/${file}`, `build/${file}`)
    }
}

main()