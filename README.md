# Airdrop Script 
Use this script to quickly and simply perform token airdrop from existing ERC20 Token contract on Ethereum
## Requirement
`node`

## Environment

`npm/yarn install`
## How to use

### Prepare a holder wallet for this token airdrop
1. You need to have the private key and public address of that wallet
2. Send tokens you want to do airdrop to that wallet, and necessary ethers for gas usage.

### Prepare the airdrop address list
1. prepare the airdrop address list
2. copy it into `airdrop_address.txt`

### Prepare token contract ABI and address
1. get the token contract address
2. get the token contract abi from the token contract source code (you can get it on [Etherscan](https://etherscan.io) using the contract address you get before)
3. copy it into `token_contract_abi.txt`

### Here you go
If you have setted holder address, holder key, token contract address in script, simply use this
```shell
node airdrop.js
```

Or you can use it in this way
```shell
node airdrop.js [Holder address] [Holder key] [Token Contract address]
```
A example is like this
```shell
node airdrop.js  0xC160C39E3c6De4B4E4193cAF7e0769a3E6002482 45dec472e5e726ecb7d81cfb08054ea7af6709d0e4be7d44e985960bfbdeedfd 0xB5bcf22CB47c9CacC504903F2c109041e91D7797
```
## Notice
1. When use one holder address to do airdrop, better not use this address to do other transactions at the same time because of ehthereum nonce design
2. An alternative way and more stable way is to deploy smart contract for airdrop, using this way can also avoid potential nonce issue. This will be contributed further. 
3. Some important parameters can be changed in script manually. They are `AIR_DROP_GAS_PRICE`， `NODE`, `DECIMALS`,  `air_drop_amount`and `AIR_DROP_GAS_LIMIT`.

	* `AIR_DROP_GAS_PRICE` by current network staus
	* `air_drop_amount` is the number of tokens you want to do airdrop for one address
	* `DECIMALS` is the decimals of that token, often is 1e18 
	* `AIR_DROP_GAS_LIMIT` is the gas limit of one airdrop transaction. Precisely gas limit can be setted according to the estimation from the `estimateGas()` function of `transfer()` function.
	* `NODE` is setted to determin running airdrop on which network	(public main net, public test net and local etc.)

More detailed description can be found in script comments.
