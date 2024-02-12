import { generatePassword } from "./generator.js";

const passwordElement = document.querySelector("#password")

const passwordQuality = document.querySelector("#password-quality")
const entropyValue = document.querySelector("#entropy-value")
const entropyBar = document.querySelector("#entropy-bar")

const wordAmountInput = document.querySelector("#word-amount")
const wordLengthInput = document.querySelector("#word-length")
const includeNumbersInput = document.querySelector("#include-numbers")
const includeSpecialInput = document.querySelector("#include-special")

const generateButton = document.querySelector("#generate")
const copyButton = document.querySelector("#copy")

let currentPassword = ""
let currentEntropy = 0
let showSpaces = true

function nextPassword() {
    const password = generatePassword({
        words: wordAmountInput.value,
        wordLength: wordLengthInput.value,
        includeNumber: includeNumbersInput.checked,
        includeSpecial: includeSpecialInput.checked
    })
    currentPassword = password[0]
    currentEntropy = password[1]

    displayEntropy()
    
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

function displayEntropy() {
    let quality;
    let color = "mauve"
    if(currentEntropy < 40) {
        quality = "Bad"
        color = "red"
    } else if (currentEntropy < 75){
        quality = "Weak"
        color = "peach"
    } else if (currentEntropy < 100) {
        quality = "Good"
        color = "green"
    } else {
        quality = "Strong"
        color = "teal"
    }
    entropyValue.innerText = Math.floor(currentEntropy)
    passwordQuality.innerText = quality
    entropyBar.style.width = `${currentEntropy / 1.5}%` || "100%"
    entropyBar.style.backgroundColor = `var(--${color})`
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