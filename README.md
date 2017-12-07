# crypto-tools

## signer.py
Signs pending transactions in parity using JSONRPC API.

Run parity with this command:
```
parity --rpcapi web3,eth,net,parity,parity_accounts,traces,rpc,personal,signer --jsonrpc-apis   web3,eth,net,parity,parity_accounts,traces,rpc,personal,signer
```

Sign txs with this command in a new shell:
```
python signer.py
```


## parity.js
Send txs to an eth address from all your parity accounts (useful for a distributed ICO participation)

The first parameter is the size of the txs (small, medium, large). The second parameter will only send the ETH if it equals "sendeth". If you don't specify send eth, you can sample the various txs that will be sent with their amounts, gas prices, and nonces.

```
npm install web3
node parity.js [small|medium|large] [sendeth]?
```
