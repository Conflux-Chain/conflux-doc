In this document, we go through the process of using command-line interface toolkit 
to create and manage your key-pair, create and sign your transaction, and submit your
transaction to Conflux. 

## Get Key Management Toolkit
You can download the key management toolkit of Conflux (**keymgr**) from [here]().
Or you can directly build **keymgr** from Conflux source code with the following steps.
```markdown
$ git clone ssh://git@base.conflux-chain.org:2222/source/conflux-rust.git
$ cd conflux-rust/key_manager/cli
$ cargo build
```
The binary of **keymgr** is then under the folder <code><span style="color:black">conflux-rust/key_manager/cli/target/</code>.

## Create Key Pair Using KeyMgr
You can use **keymgr** to create your own secret/public key-pair.
```markdown
$ keymgr generate random
```
A sample output is:
```markdown
secret:  074842cdfa28a02fd23f244126618bcb49588a5530e7135dcd8c86aa3fbf0103
public:  7827b388197a9b4c4c97aafff400b1d168439b0b6b2428dad9a8f8ec461789155a9318c7d0d38a2e696e41c99faa0e7f7ab55bc21814b6e7809936f1d51ee5b0
address: 71e177b579a4b1ad24382f4b559f479ca0099572
``` 
***address*** is the 160-bit account Id derived from the public key. You can keep privately your secret key at anywhere that only you know. 

## Generate, Sign, and Submit Token Transferring Transaction
Conflux provides Javascript library **CfxWeb** to help user generate transactions in programmable way. The following is a sample code snippet.
```Javascript
#!/usr/bin/env node

var Tx = require('ethereumjs-tx');
var secretKey = Buffer.from('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109', 'hex')
var rawTx = {
 nonce: '0x00',
 gasPrice: '0x09184e72a000',
 gasLimit: '0x2710',
 to: '0x0000000000000000000000000000000000000000',
 value: '0x00',
 data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
}
var tx = new Tx(rawTx);
tx.sign(secretKey);
console.log('0x' + serializedTx.toString('hex'));

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:12345'));
let answer = web3.cfx.sendRawTransaction('0x' + serializedTx.toString('hex'));
console.log(answer);

```  
To run the above code, you need to first install Node.js and CfxWeb.js. 
