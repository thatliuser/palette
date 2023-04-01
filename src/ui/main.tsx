import React from "lib/webpack/react"
import ReactDOM from "lib/webpack/react-dom"

function main() {
    console.log(`Hello from React v${React.version}, ReactDOM v${ReactDOM.version}!`)
    const div = document.getElementById("announcementWrapper")!
    ReactDOM.render(<h1>Hello World</h1>, div)
}

main()