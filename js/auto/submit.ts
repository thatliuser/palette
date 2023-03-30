// Autosubmit CAS stuff if autofilled
(() => {
    // Make username and password fields required
    // This way the page won't reload and the clicking won't infinitely loop
    // Also it's just generally more ergonomic
    for (const id of ["username", "password"]) {
        const input = document.querySelector(`input#${id}`) as HTMLInputElement
        input.setAttribute("required", "")
    }
    const submit = document.querySelector("input#submit") as HTMLInputElement
    submit.click()
})()
