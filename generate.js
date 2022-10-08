const { ethers } = require("ethers");

function solvePuzzle(callerAddress) {
    const nakedAddress = callerAddress.replace('0x', '')
    const hashPrefix = `0x00000003${nakedAddress}`
    for (let i = (50_000_000_000) * 0; i < 0xFFFFFFFFFFFFFFFF; i++) {
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

const addr='0x405f4b09fcc3debd5bc2d24748318b341e75ffff'
console.log('finding puzzle solution for', addr)
console.log(solvePuzzle(addr))