Web3 = require('web3');
var fs = require('fs');
var os = require("os");

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var loggingCallback = (source) => (error, result) => {
    var d = new Date();

    console.log("\n" + source);
    console.log(d);
    console.log(d.toUTCString());

    if(!error) {
        console.log('success');
        console.log(result)
    }
    else {
        console.log('error');
        console.error(error);
    }
}

var GAS = 200000;
var GWEI = 60;
var GAS_PRICE = parseInt(web3.toWei(GWEI, 'gwei'));

LARGE = [275, 220, 190, 175];
MEDIUM = [60, 50, 40, 30];
SMALL = [6];

// DRY VALUES
LARGE_DRY = [0.003176, 0.00250, 0.00200, 0.00150, 0.00100];
MEDIUM_DRY = [0.000635, 0.00055, 0.00045, 0.00035, 0.00025];
SMALL_DRY = [0.001];

var args = process.argv.slice(2);
var txSetSize = args[0];
var sendEth = args[1] === "send";
var dryRun = args[2] === "dryrun";
var dryAddress = args[3];

console.log(txSetSize);
console.log(dryRun);
console.log(dryAddress);


var EXCLUDED_ADDRESS = '';
var ADDRESS = '';
var accounts = web3.eth.accounts;
var destAddress = dryRun ? dryAddress : ADDRESS;
var txSet = getTxSet();

for (var i = 0; i < accounts.length; i++) {
    var account = accounts[i];
    var currNonce = web3.eth.getTransactionCount(account);

    if (account === EXCLUDED_ADDRESS) {
        continue;
    }

    console.log("\n\n\nACCOUNT: " + account);
    console.log("TXs to send: " + txSet);

    for (var t = 0; t < txSet.length; t++) {
        tx = txSet[t];
        sendAmountWithNonce(account, currNonce, tx);
        currNonce++;
    }
}

function getTxSet() {
    switch(txSetSize) {
        case "large":
            return dryRun ? LARGE_DRY : LARGE;
        case "medium":
            return dryRun ? MEDIUM_DRY : MEDIUM;
        case "small":
            return dryRun ? SMALL_DRY : SMALL;
        default:
            console.log("Could not read node map");
            return MEDIUM;
    }
}

function sendAmountWithNonce(account, nonce, amount){
    var txObj = {
        'from': account,
        'to': destAddress,
        'value': etherValue(amount),
        'gas': GAS,
        'gasPrice': GAS_PRICE,
        'nonce': nonce
    };

    sendParityTx(txObj);
}

function sendParityTx(txObj) {
	console.log("\nSending tx");
    printTx(txObj);

    if (sendEth) {
        web3.eth.sendTransaction(txObj, loggingCallback("parity tx cb"));
    }
}

function printTx(txObj) {
    console.log("From: " + txObj['from']);
    console.log("To: " + txObj['to']);
    console.log("Value: " + decimalValue(txObj['value']));
    console.log("Nonce: " + txObj['nonce']);
    console.log("Gas Limit: " + GAS);
    console.log("Gas Price: " + GWEI);
}

function etherValue(amount) {
	return parseInt(web3.toWei(amount, 'ether'));
}

function decimalValue(amount) {
	return web3.fromWei(amount, 'ether');
}

function hexWithPrefix(number) {
	return '0x' + number.toString(16);
}

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}
