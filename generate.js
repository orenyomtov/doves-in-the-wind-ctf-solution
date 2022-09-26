const { ethers } = require("ethers");

function solvePuzzle(callerAddress) {
    const nakedAddress = callerAddress.replace('0x', '')
    const hashPrefix = `0x00000003${nakedAddress}`
    for (let i = (50_000_000_000) * 13; i < 0xFFFFFFFFFFFFFFFF; i++) {
        const possibleSolution = i.toString(16).padStart(16, '0');
        const bytesToHash = `${hashPrefix}${possibleSolution}`
        const hash = ethers.utils.keccak256(bytesToHash)
        if (i % 1_000_000 == 0) {
            console.log(i)
        }

        if (hash.substr(-4) == 'd073') {
            if (ethers.BigNumber.from(hash).shr(240).eq(0x36b)) {
                return `0x${possibleSolution}`;
            }
        }
    }

    return 'ERROR';
}

console.log(solvePuzzle('0x03136ffF250585749c1CE7C89aa3563bF9058FfF'))