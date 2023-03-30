function addScripts() {
    const davis = "ucdavis.edu"
    const canvas = `canvas.${davis}`

    const contentScripts: browser.contentScripts.RegisteredContentScriptOptions[] = [
        // Directly jump to login page
        {
            matches: [`https://login.${canvas}/`],
            js: [{ file: "auto/goto.js" }]
        },
        // Autoclick login button if autofill is on
        {
            matches: [`https://cas.${davis}/cas/login*`],
            js: [{ file: "auto/submit.js" }]
        },
        // Custom styles for Canvas
        {
            matches: [`https://${canvas}/*`],
            css: [{ file: "style.css" }],
            runAt: "document_start"
        },
        // Inject page script into Canvas
        {
            matches: [`https://${canvas}/*`],
            js: [{ file: "ui/inject.js" }]
        }
    ]
    for (const script of contentScripts) {
        browser.contentScripts.register(script)
    }
}

browser.runtime.onInstalled.addListener(addScripts)
browser.runtime.onStartup.addListener(addScripts)