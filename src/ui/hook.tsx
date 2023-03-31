import { onModsLoad } from "lib/webpack"
import { ReactDOM } from "lib/webpack/react-dom"
import { React } from "lib/webpack/react"
import Test from "./test"

onModsLoad(() => {
    console.log(`Hello from React v${React.version}, ReactDOM v${ReactDOM.version}!`)
    const announce = document.getElementById("announcementWrapper")!
    ReactDOM.render(<Test></Test>, announce)
})