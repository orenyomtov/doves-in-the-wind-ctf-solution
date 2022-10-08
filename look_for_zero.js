const { ethers } = require("ethers");

function generateSeed(blockNumber, callerAddress) {
    const hashPostfix = `0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000${callerAddress.replace('0x', '')}`
    const blockNumberHex = blockNumber.toString(16).padStart(64, '0');
    const bytesToHash = `0x${blockNumberHex}${hashPostfix}`
    const hash = ethers.utils.keccak256(bytesToHash)
    return hash
}

function seedToNumbers(seed) {
    const numbers = []
    for (let i = 2; i < 66; i += 2) {
        numbers.push(Number(`0x${seed.substr(i, 2)}`))
    }
    return numbers
}

function numbersToEvenAndOddSums(numbers) {
    let evenSum = 0
    let oddSum = 0

    for (const number of numbers) {
        if (number % 2 == 0) {
            evenSum += number
        } else {
            oddSum += number
        }
    }

    return { evenSum, oddSum }
}


const currentBlockNumber = 28129631
// const tomorrowBlockNumber = currentBlockNumber + (2 * 60 * 60 * 24)
const tomorrowBlockNumber = currentBlockNumber + (60 * 60 * 2 * 12)
// const tomorrowBlockNumber = currentBlockNumber
const endBlockNumber = 28332866
// const endBlockNumber = currentBlockNumber + (2 * 60 * 60 * 24 * 1)

console.log(`Current block number: ${currentBlockNumber}`)
console.log(`Tomorrow block number: ${tomorrowBlockNumber}`)
console.log(`End block number: ${endBlockNumber}`)


const addresses = require('./addresses.json')
for (const address of addresses) {
    console.log(`Address: ${address}`)
    for (let i = tomorrowBlockNumber; i < endBlockNumber; i++) {
        const seed = generateSeed(i, address)
        const numbers = seedToNumbers(seed)

        const { evenSum, oddSum } = numbersToEvenAndOddSums(numbers)

        if (evenSum == 0) {
            console.log(`Found zero even numbers sum at block ${i}. Odd numbers sum: ${oddSum.toString(16)}. Address: ${address}`)
        }
    }
}