import requests
import json
import time

URL = 'http://localhost:8545'
headers = {'content-type': 'application/json'}

def get_pending_txs():
    payload = {
        "method": "signer_requestsToConfirm",
        "params": [] ,
        "jsonrpc": "2.0",
	    "id": 1,
    }

    txs = []

    try:
        response = json.loads(requests.post(URL, data=json.dumps(payload), headers=headers).content)
        txs = response['result']
    except Exception as e:
	    print e.message

    return txs


def get_request_ids_from_pending(txs):
    request_ids = []
	
    for tx in txs:
        request_ids.append(tx['id'])
	
    return request_ids


def sign_pending_txs(txs):
    ids = get_request_ids_from_pending(txs)	

    payload = {
	"method": "signer_confirmRequest",
	"id": 1,
	"jsonrpc": "2.0"
    }

    for id in ids:
        payload['params'] = [id, {}, '']
        print json.dumps(payload)

        try:
	        response = json.loads(requests.post(URL, data=json.dumps(payload), headers=headers).content)
	        print response
        except Exception as e:
            print e.message
            print "Could not sign request {id}".format(id=id)


def main():
    while True:
        time.sleep(0.5) 
        try:
            txs = get_pending_txs()
            sign_pending_txs(txs)
        except Exception as e:
            print e.message


if __name__ == "__main__":
    main()

