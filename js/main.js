import { generatePassword } from "./generator.js";

const passwordElement = document.querySelector("#password")

const wordAmountInput = document.querySelector("#word-amount")
const wordLengthInput = document.querySelector("#word-length")
const includeNumbersInput = document.querySelector("#include-numbers")
const includeSpecialInput = document.querySelector("#include-special")

const generateButton = document.querySelector("#generate")
const copyButton = document.querySelector("#copy")

let currentPassword = ""
let showSpaces = true

function nextPassword() {
    currentPassword = generatePassword({
        words: wordAmountInput.value,
        wordLength: wordLengthInput.value,
        includeNumber: includeNumbersInput.checked,
        includeSpecial: includeSpecialInput.checked
    })
    displayPassword()
}

function displayPassword() {
    passwordElement.innerHTML = "";
    currentPassword.forEach(word => {
        if (showSpaces) word += " "
        const wordElm = document.createElement("span")
        wordElm.innerText = word
        passwordElement.append(wordElm)
        wordElm.append(document.createElement("wbr"))
    });
}

function copyPassword() {
    let passwordString = ""
    currentPassword.forEach(word => {
        if (showSpaces) word += " "
        passwordString += word
    });
    passwordString = passwordString.trim()
    navigator.clipboard.writeText(passwordString).then(() => {
        copyButton.innerText = "Copied!"
        setTimeout(() => copyButton.innerText = "Copy", 1000)
    }, () => {
        copyButton.innerText = "Failed to Copy!"
        setTimeout(() => copyButton.innerText = "Copy", 1000)
    });
}

generateButton.addEventListener("click", () => {
    nextPassword()
})

copyButton.addEventListener("click", copyPassword)

passwordElement.addEventListener("click", () => {
    showSpaces = !showSpaces
    displayPassword()
})

nextPassword()