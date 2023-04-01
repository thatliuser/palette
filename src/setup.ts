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

        {
            matches: [`https://${canvas}/*`],
            // Custom styles for Canvas
            css: [{ file: "style.css" }],
            // Inject page script into Canvas
            js: [{ file: "inject/inject.js" }],
            runAt: "document_start"
        },
    ]
    for (const script of contentScripts) {
        browser.contentScripts.register(script)
    }
}

browser.runtime.onInstalled.addListener(addScripts)
browser.runtime.onStartup.addListener(addScripts)