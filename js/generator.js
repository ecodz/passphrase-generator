const vowels = "aeiou"
const consonants = "bcdfghjklmnpqrstvwxyz"
const numbers = "1234567890"
const special = "!();:-#+="

function secureRandom(length) {
    var array = new Uint8Array(length);
    var res = new Float32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < array.length; i++) {
        if (array[i] % 0xff === 0) {
            array[i] = 0xfe;
        }
        res[i] = array[i] / 0xff;
    }
    return res;
}

function isVowel(letter) {
    if (letter == "") return false
    return vowels.includes(letter)
}

/**
 * @param {string} previous Previous password
 */
function getNextAllowedChars(previous) {
    previous = previous.toLocaleLowerCase()
    if (previous.length === 0) {
        return vowels + consonants
    } else if (isVowel(previous[previous.length - 1])) {
        if (isVowel(previous[previous.length - 2]))
            return consonants
        return vowels + consonants
    } else {
        return vowels
    }
}

function pickRandom(chars, random) {
    return chars[Math.floor(random * chars.length)]
}

function makeUpWord(length, random) {
    let result = ""
    for (let i = 0; i < length; i++) {
        const chars = getNextAllowedChars(result)
        result += pickRandom(chars, random[i])
    }
    return result
}

export function generatePassword(options) {
    const words = options["words"] || 6
    const wordLength = options["wordLength"] || 4
    const includeNumber = options["includeNumber"] || false
    const includeSpecial = options["includeSpecial"] || false

    const totalWordChars = words * wordLength
    const extraChars = 2
    const random = secureRandom(totalWordChars + extraChars)

    let result = [];

    for (let i = 0; i < words; i++) {
        result.push(makeUpWord(wordLength, random.slice(i*wordLength, i*wordLength+wordLength)))
    }

    let extra = ""
    if (includeNumber) extra += pickRandom(numbers, random[totalWordChars])
    if (includeSpecial) extra += pickRandom(special, random[totalWordChars + 1])
    if (extra) result.push(extra)

    return result
}