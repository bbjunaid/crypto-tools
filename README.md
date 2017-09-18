# crypto-tools

## parity_signer.js / sh
Signs pending transactions in parity using JSONRPC API. Needed because the web3.personal.unlockAccount API is useless. Run parity_signer.sh in a cronjob

```
* * * * * parity_signer.sh >> /tmp/cron.log 2>&1
```

