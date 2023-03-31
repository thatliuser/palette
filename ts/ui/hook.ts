import { React, ReactDOM, initMods } from "./modules"
import { onReady } from "./webpack"

onReady(() => {
    initMods()

    console.log(`Hello from React v${React.version}, ReactDOM v${ReactDOM.version}!`)
    const announce = document.getElementById("announcementWrapper")!
    const elem = React.createElement("video")
    ReactDOM.render(elem, announce)
})