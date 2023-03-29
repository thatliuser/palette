(() => {
    const links = document.querySelectorAll("a.marketing-highlight") as NodeListOf<HTMLAnchorElement>
    for (const link of links) {
        const text = link.querySelector("h3 > span")!.innerHTML
        // Text should be "UCD Log In"
        if (text.search("UCD") == -1) {
            continue
        }

        link.click()
    }
})()