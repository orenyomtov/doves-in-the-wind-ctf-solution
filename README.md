# White Noise CTF Solution

This is the second solution, to see the first solution, check out the [first-solution](https://github.com/orenyomtov/doves-in-the-wind-ctf-solution/tree/first-solution) tag

## 1. Generate vanity addresses
```sh
cargo install styleth
styleth --regex "ffff$"
```

## 2. Find a suitable block-address duo
Put the generated addresses in `addresses.json` and run:
```sh
node look_for_zero.js
```
If no suitable address was found, go back to Step #1.

Once you've found a suitable address:
1. Enter its private key in `hardhat.config.ts`
2. Enter its block number in `scripts/deploy.ts` and `test/Test.ts`
2. Enter its public key in `generate.js`
2. Enter its odd numbers' sum in `scripts/deploy.ts`


## 4. Deploy solution contract
```sh
npx hardhat run scripts/deploy.ts --network optimism
```
Enter the deployed contract's address in `test/Test.ts`

## 5. Generate puzzle solution
```
node generate.js
```
Once you have it, enter the puzzle solution in `test/Test.ts`

## 6. Test and deploy
```
# for testing on a local hardhat forked node, uncomment the relevant code block in test/Test.ts and run
npx hardhat test

# for waiting for the target block number and the transmitting the TXs:
npx hardhat test --network optimism
```
