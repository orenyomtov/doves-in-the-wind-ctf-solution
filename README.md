# White Noise CTF Solution

## 1. Generate vanity address
```sh
cargo install styleth
styleth --regex "fff.{29}fff$"
```
Enter the private key in `hardhat.config.ts`

## 2. Generate puzzle solution
Enter the public key in `generate.js`
```
node generate.js
```
Once you have it, insert the puzzle solution in `test/Test.ts`

## 3. Test and deploy
The `test/Test.ts` file is in an extremely messy stage, it won't work right out of the box. This is me releasing my PoC scripts while sleep deprived on a transatlantic flight.
Try commenting lines in and out, and editing it to fit your needs. Good luck :)

```
# for testing on a local hardhat forked node
npx hardhat test

# for deploying on optimism
npx hardhat test --network optimism
```
