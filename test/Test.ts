import { ethers, network } from "hardhat";
import fetch from 'node-fetch';

// Edit the following three lines to match your EOA, deployed contract, and target block number
const puzzleSolution = "0x0000002ea74414e9"
const deployedSolutionAddress = "0xa76f94fe2f8499751ad46b83f6533f2b4c3fc4a1"
const targetBlockNumber = 28166946

const numberOfSpamTxs = 20

async function getOptimismBlockNumber() {
  const response = await fetch("https://rpc.ankr.com/optimism",
    { method: 'POST', body: '{"method":"rollup_getInfo","params":[],"id":1,"jsonrpc":"2.0"}' })
  const json = await response.json()
  return json.result.rollupContext.index
}

const providers = [
  new ethers.providers.JsonRpcProvider("https://opt-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY_HERE"),
  new ethers.providers.JsonRpcProvider("https://mainnet.optimism.io"),
  new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/optimism"),
  new ethers.providers.JsonRpcProvider("https://optimism-mainnet.public.blastapi.io"),
  new ethers.providers.JsonRpcProvider("https://1rpc.io/op"),
]

function sendSignedTransactions(txs: any) {
  for (const tx of txs) {
    Promise.all(providers.map(p => p.sendTransaction(tx).catch(console.log)))
  }
}

describe("Test", function () {
  it("SolutionCreator", async function () {
    const signer = ethers.provider.getSigner(0);
    const wallet = new ethers.Wallet((network.config.accounts as any)[0].privateKey ?? (network.config.accounts as any)[0])
    const callerAddress = await signer.getAddress();
    console.log('callerAddress', callerAddress)

    // Uncomment the following block and run "npx hardhat test"  if you want to to test that it works in a local fork
    // -----
    // const currentBlock = await ethers.provider.getBlockNumber()
    // const wantedBlock = 28166946 - 1
    // console.log(`Current block number: ${currentBlock}`)


    // const blockGap = wantedBlock - currentBlock
    // await ethers.provider.send("hardhat_mine", [`0x${blockGap.toString(16)}`]);
    // console.log(`Current block number: ${await ethers.provider.getBlockNumber()}`)


    // // console.log(`Solution: ${await solutionCreator2.connect(signer).getSolution()}`)

    // const challengeTx = await signer.sendTransaction({
    //   to: "0xC8565A653B27FB4Ae88d69e1865A2748b137805a",
    //   data: `0x00000003${puzzleSolution!.replace('0x', '')}${deployedSolutionAddress.replace('0x', '').padStart(48, '0')}`,
    //   gasLimit: 500_000,
    // })

    // console.log("challengeTx", await challengeTx.wait())

    // return
    // ----------

    const populatedTx = await signer.populateTransaction({
      to: "0xC8565A653B27FB4Ae88d69e1865A2748b137805a",
      data: `0x00000003${puzzleSolution!.replace('0x', '')}${deployedSolutionAddress.replace('0x', '').padStart(48, '0')}`,
      gasLimit: 500_000,
    })
    populatedTx.gasPrice = 2000000;

    const signedTx = await wallet.signTransaction(populatedTx);
    const signedTxs = []

    for (let i = 0; i < numberOfSpamTxs; i++) {
      signedTxs.push(await wallet.signTransaction({ ...populatedTx, nonce: Number(populatedTx.nonce) + i }))
    }

    console.log(populatedTx)
    console.log(signedTx)
    console.log(signedTxs)

    console.log(`Current block number: ${await ethers.provider.getBlockNumber()}`)
    console.log(`Target block number: ${targetBlockNumber}`)

    while (true) {
      try {
        const currentBlockNumber = await getOptimismBlockNumber()
        const blockGap = targetBlockNumber - currentBlockNumber
        console.log("Optimism block number", currentBlockNumber, "gap to target block number", blockGap)
        if (blockGap > 0 && blockGap <= (numberOfSpamTxs)) {
          console.log("Sending txs")
          for (let i = 0; i < 10; i++) {
            sendSignedTransactions(signedTxs)
            await new Promise(resolve => setTimeout(resolve, 250));
          }
          break
        }
      }
      catch (e) {
        console.log(e)
      }

      await new Promise(resolve => setTimeout(resolve, 50));
    }
  });
});
