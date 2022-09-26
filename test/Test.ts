import { ethers, network } from "hardhat";
import { SolutionCreator } from "../typechain-types";

const puzzleSolution = "0x00000097aa556c85"

describe("Test", function () {
  it("SolutionCreator", async function () {
    const signer = ethers.provider.getSigner(0);
    const wallet = new ethers.Wallet((network.config.accounts as any)[0].privateKey ?? (network.config.accounts as any)[0])
    const callerAddress = await signer.getAddress();

    console.log(`callerAddress: ${callerAddress}`)
    if (/fff.{29}fff$/.test(callerAddress.toLowerCase()) == false) {
      throw new Error('callerAddress is not a valid address. It needs to end with fff...(29 characters)...fff');
    }

    // const SolutionCreator = await ethers.getContractFactory("SolutionCreator", signer);
    // const solutionCreator = await SolutionCreator.deploy();
    // await solutionCreator.deployed();
    const solutionCreator = await ethers.getContractAt("SolutionCreator", "0x700f3524ca5b8c3f5abc602803b2f2106027a989", signer) as SolutionCreator;

    if (network.name == 'hardhat') {
      await ethers.provider.send("evm_setAutomine", [false]);
    }

    const solutionAddress = await solutionCreator.connect(signer).callStatic.createSolutionContract();
    // const createSolutionTx = await solutionCreator.connect(signer).createSolutionContract({ gasLimit: 500_000 });
    const createSolutionPopulatedTx = await signer.populateTransaction(await solutionCreator.connect(signer).populateTransaction.createSolutionContract({ gasLimit: 500_000 }));
    createSolutionPopulatedTx.gasPrice = 2000000;

    // const challengeTxResponse = await signer.sendTransaction({
    //   to: "0xC8565A653B27FB4Ae88d69e1865A2748b137805a",
    //   data: `0x00000003${puzzleSolution!.replace('0x', '')}${solutionAddress.replace('0x', '').padStart(48, '0')}`,
    //   gasLimit: 500_000,
    // })
    const challengePopulatedTx = await signer.populateTransaction({
      to: "0xC8565A653B27FB4Ae88d69e1865A2748b137805a",
      data: `0x00000003${puzzleSolution!.replace('0x', '')}${solutionAddress.replace('0x', '').padStart(48, '0')}`,
      gasLimit: 500_000,
    })
    challengePopulatedTx.gasPrice = 2000000;
    challengePopulatedTx.nonce = Number(challengePopulatedTx.nonce) + 1;

    const signedCreateSolutionTx = await wallet.signTransaction(createSolutionPopulatedTx);
    const signedChallengeTx = await wallet.signTransaction(challengePopulatedTx);

    console.log(createSolutionPopulatedTx)
    console.log(challengePopulatedTx)

    console.log(signedCreateSolutionTx)
    console.log(signedChallengeTx)

    const [createSolutionTx, challengeTxResponse] = await Promise.all([
      ethers.provider.sendTransaction(signedCreateSolutionTx),
      ethers.provider.sendTransaction(signedChallengeTx)
    ])

    if (network.name == 'hardhat') {
      await ethers.provider.send("evm_mine", []);
    }

    const createSolutionReceipt = await createSolutionTx.wait();
    console.log(createSolutionReceipt)

    const solutionDeployedCode = await ethers.provider.getCode(solutionAddress);
    console.log(`solutionDeployedCode: ${solutionDeployedCode}`);

    const challengeTxReceipt = await challengeTxResponse.wait()
    console.log(challengeTxReceipt)
  });
});
