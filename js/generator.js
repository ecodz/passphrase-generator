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
    let combinations = []
    for (let i = 0; i < length; i++) {
        const chars = getNextAllowedChars(result)
        combinations.push(chars.length)
        result += pickRandom(chars, random[i])
    }
    combinations = combinations.reduce(function(product, value) { return product * value; })
    return [result, combinations]
}

export function generatePassword(options) {
    const words = Math.ceil(options["words"]) || 6
    const wordLength = Math.ceil(options["wordLength"]) || 4
    const includeNumber = options["includeNumber"] || false
    const includeSpecial = options["includeSpecial"] || false
    if(words > 255 || wordLength > 255) return [["", "Please enter a lower value."], 0]

    const totalWordChars = words * wordLength
    const extraChars = 2
    const random = secureRandom(totalWordChars + extraChars)

    let result = [];
    let combinations = []

    for (let i = 0; i < words; i++) {
        const word = makeUpWord(wordLength, random.slice(i*wordLength, i*wordLength+wordLength))
        result.push(word[0])
        combinations.push(word[1])
    }

    let extra = ""
    if (includeNumber) {
        extra += pickRandom(numbers, random[totalWordChars]);
        combinations.push(numbers.length);
    } 
    if (includeSpecial) {
        extra += pickRandom(special, random[totalWordChars + 1]);
        combinations.push(special.length);
    } 
    if (extra) result.push(extra);

    combinations = combinations.reduce(function(product, value) { return product * value; })

    const entropy = Math.log2(combinations)
    return [result, entropy]
}