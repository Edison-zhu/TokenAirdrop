var Web3 = require('web3');
var fs = require("fs");
const net = require("./eth_net.js");
var BigNumber = require("bignumber.js");

//Notice: When use one holder address to do airdrop, better not use this address to do other transactions at the same time because of ehthereum nonce design

//global parameters

let airDropAmount = new BigNumber(50);
//multiply decimals
const DECIMALS = 1e18;
airDropAmount = airDropAmount.times(DECIMALS);

//7.1 GWEI, change it according to current network status and the airdrop speed you want
const AIR_DROP_GAS_PRICE = 7100000000;

//the gas limit for perform one airdrop transaction, set this to avoid waste gas when some transction errors occur
const AIR_DROP_GAS_LIMIT = 100000;

//make it more readable
const LOCAL_TEST_NODE = net.t;
const PUBLIC_TEST_NODE = net.rop;
const PUBLIC_NODE = net.main;

//set network environment here
const NODE = PUBLIC_TEST_NODE;

//need set holder address
let HOLDER_ADDRESS = '';
//secret key of holder
let HOLDER_KEY = '';
//token contract address
//Sample address: 0xB5bcf22CB47c9CacC504903F2c109041e91D7797
let CONTRACT_ADDRESS = '';

//parse script parameter
var args = process.argv.splice(2);
if (HOLDER_ADDRESS == '') {
    HOLDER_ADDRESS = args[0];
}
console.log("Holder address: " + HOLDER_ADDRESS);
if (HOLDER_KEY == '') {
    HOLDER_KEY = args[1];
}
console.log("Holder key: " + HOLDER_KEY);
if (CONTRACT_ADDRESS == '') {
    CONTRACT_ADDRESS = args[2];
}
console.log("token contract address: " + CONTRACT_ADDRESS);
        
//read address array from text
let addressData = fs.readFileSync('airdrop_address.txt', 'utf8');
addressData = addressData.toString();
addressArray = addressData.split("\r\n");
console.log(addressArray.length);

//connect web3
var web3 = new Web3(new Web3.providers.HttpProvider(NODE));

web3.eth.getBlockNumber().then((result) => {
    console.log('Block Number:' + result);
});

//some global variables
let instance;
let result;
let nonce;


//read contract abi file
let data = fs.readFileSync('./token_contract_abi.json', 'utf8');
let abi = JSON.parse(data);

//Do airdrop logic
(async() => {

    //init Contract
    instance = await new web3.eth.Contract(abi, CONTRACT_ADDRESS);

    // let balance = await instance.methods.balanceOf(HOLDER_ADDRESS).call();
    // console.log(balance);

    let receivers = addressArray;
    let testBalance;

    // clear address log
    fs.writeFileSync('successful_address.txt', '');
    //Notice some addresses maybe failed becuase early abortion, it will not be in error list
    fs.writeFileSync('error_address.txt', '');

    //airdrop interval, this maybe can make script perform more stable
    INTERVAL = 2000; //ms

    nonce = await web3.eth.getTransactionCount(HOLDER_ADDRESS, "pending");
    console.log(nonce);

    receivers.forEach(function(receiver, index) {
        setTimeout(async() => {
            console.log(index);
            console.log(receiver);
            await transferToken(receiver);
        }, INTERVAL * index);
    });

})();


async function transferToken(to) {
    let transaferMethod = instance.methods.transfer(to, airDropAmount.toString());
    // let gas = await instance.methods.transfer(to, airDropAmount).estimateGas();
    // console.log(gas);

    //console.log(transaferMethod.encodeABI());
    //
    console.log('transfer token to: ' + to);

    web3.eth.accounts.signTransaction({
        to: CONTRACT_ADDRESS,
        data: transaferMethod.encodeABI(),
        gas: AIR_DROP_GAS_LIMIT,
        //Notice nonce here
        nonce: nonce++,
        gasPrice: AIR_DROP_GAS_PRICE
    }, HOLDER_KEY).then((signedTransaction) => {
        console.log("nonce: " + nonce);
        web3.eth.sendSignedTransaction(signedTransaction.rawTransaction).then((result, error) => {
            if (error) {
                console.error(error);
            } else {
                console.log(result);
            }
        });
    });
}