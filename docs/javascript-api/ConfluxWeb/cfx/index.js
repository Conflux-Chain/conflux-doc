/**
 * This default address is used as the default "from" property.
 *
 * 20 Bytes: Any Conflux address. You should have the private key for that address in your node or keystore.
 *
 * @var {string|undefined}
 *
 * @example
 > confluxWeb.cfx.defaultAccount
 undefined

 > confluxWeb.cfx.defaultAccount = '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b';
 > confluxWeb.cfx.defaultAccount
 "0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b"

 */
let defaultAccount;

/**
 *
 * When requests are made that act on the state of conflux,
 * the default epoch parameter determines the height of the epoch.
 *
 * The following options are possible for the default epoch parameter:
 *
 * - `number`: An integer epoch number.
 * - `"earliest"`: The earliest epoch where the genesis block in.
 * - `"latest_state"`: The latest epoch where the latest block with an executed state in. (default)
 * - `"latest_mined"`: The latest epoch where the latest mined block in.
 *
 * @var {number|string}
 *
 * @example
 > confluxWeb.cfx.defaultEpoch; // Default is "latest_state"
 "latest_state"

 */
let defaultEpoch;

/**
 * Will return the current provider, otherwise null
 *
 * @var {object|null}
 *
 * @example
 > confluxWeb.cfx.currentProvider
 HttpProvider {
  host: 'http://testnet-jsonrpc.conflux-chain.org:12537',
  ...
 }
 */
let currentProvider;

/**
 * Will change the provider for its module.
 *
 * @param cfxProvider {object} - A valid provider.
 * @return {boolean}
 *
 * @example
 > confluxWeb.currentProvider.host
 "http://testnet-jsonrpc.conflux-chain.org:12537"
 > confluxWeb.cfx.currentProvider.host
 "http://testnet-jsonrpc.conflux-chain.org:12537"
 > confluxWeb.cfx.setProvider('http://localhost:12537') // change module provider
 > confluxWeb.currentProvider.host
 "http://testnet-jsonrpc.conflux-chain.org:12537"
 > confluxWeb.cfx.currentProvider.host
 "http://localhost:12537"
 */
function setProvider(cfxProvider) {}

/**
 * Returns the current gas price oracle.
 * The gas price is determined by the last few blocks median gas price.
 *
 * @return {Promise<string>} Number string of the current gas price in drip.
 *
 * @example
 > await confluxWeb.cfx.getGasPrice()
 "0"

 */
async function getGasPrice() {}

/**
 * Returns the current epoch number the client is on.
 *
 * @return {Promise<number>}
 *
 * @example
 > await confluxWeb.cfx.getEpochNumber();
 990902
 */
async function getEpochNumber() {}

/**
 * Get the balance of an address at a given epoch.
 *
 * @param {string} address - The address to get the balance of.
 * @param {number|string} [defaultEpoch=`confluxWeb.cfx.defaultEpoch`] - If you pass this parameter it will not use the default epoch.
 * @return {Promise<string>} The current balance for the given address in drip.
 *
 * @example
 > await confluxWeb.cfx.getBalance("0x407d73d8a49eeb85d32cf465507dd71d507100c1");
 "685539999999937000"

 > await confluxWeb.cfx.getBalance("0x407d73d8a49eeb85d32cf465507dd71d507100c1", "earliest");
 "0"

 */
async function getBalance(address, defaultEpoch) {}

/**
 * Get the code at a specific address.
 *
 * @param {string} address - The address to get the code from.
 * @param {number|string} [defaultEpoch=`confluxWeb.cfx.defaultEpoch`] - If you pass this parameter it will not use the default epoch.
 * @return {Promise<string>}  The data at given address
 *
 * @example
 > await confluxWeb.cfx.getCode("0x079352147ce2de227af6fa963f603a35aed8e601");
 "0x6080604052348015600f57600080fd5b506004361060325760003560e01c806306661abd146037578063812600df146053575b600080fd5b603d6092565b6040518082815260200191505060405180910390f35b607c60048036036020811015606757600080fd5b81019080803590602001909291905050506098565b6040518082815260200191505060405180910390f35b60005481565b60008160008082825401925050819055905091905056fea265627a7a723158203aa4346abf52089d9be8806b8bf35dff408bd9f68f668e528bc8e2e20d74b29064736f6c634300050b0032"

 */
async function getCode(address, defaultEpoch) {}

/**
 * Returns a block matching the block number or block hash.
 *
 * @param {string|number} blockHashOrEpochNumber - The block hash or epoch.
 * @param {boolean} [returnTransactionObjects=false] - If true, the returned block will contain all transactions as objects, if false it will only contains the transaction hashes.
 * @return {Promise<object>} The block object
 - `string` miner: The address of the beneficiary to whom the mining rewards were given.
 - `string|null` hash: Hash of the block. `null` when its pending block.
 - `string` parentHash: Hash of the parent block.
 - `string[]` refereeHashes: Array of referee hashes.
 - `number|null` epochNumber: The current block epoch number in the client's view. `null` when it's not in best block's past set.
 - `boolean` stable: If the block stable or not
 - `string` nonce: Hash of the generated proof-of-work. `null` when its pending block.
 - `number` gasLimit: The maximum gas allowed in this block.
 - `string` difficulty: Integer string of the difficulty for this block.
 - `number` height: The block heights. `null` when its pending block.
 - `number` size: Integer the size of this block in bytes.
 - `number` blame: 0 if there's nothing to blame; k if the block is blaming on the state info of its k-th ancestor.
 - `boolean` adaptive: If the block's weight adaptive or not.
 - `number` timestamp: The unix timestamp for when the block was collated.
 - `string` transactionsRoot: The hash of the transactions of the block.
 - `string[]` transactions: Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
 - `string` deferredLogsBloomHash: The hash of the deferred block's log bloom filter
 - `string` deferredReceiptsRoot: The hash of the receipts of the block after deferred execution.
 - `string` deferredStateRoot: The root of the final state trie of the block after deferred execution.
 - `object` deferredStateRootWithAux: Information of deferred state root
 *
 * @example
 > await confluxWeb.cfx.getBlock("0xdf19947ee92cae1de92fd05d949c654afa4afb77ce42024533d5b47cb861575a");
 {
  "miner": "0x0000000000000000000000000000000000000015",
  "hash": "0xdf19947ee92cae1de92fd05d949c654afa4afb77ce42024533d5b47cb861575a",
  "parentHash": "0xa378c9e283c08eac0e2ac51a8c19e61717af812a157eb914d35b171ed20920b9",
  "refereeHashes": [],
  "epochNumber": 925836,
  "stable": true,
  "nonce": "0xaaa4a571ad424ec",
  "gasLimit": 3000000000,
  "difficulty": "21351313",
  "height": 925836,
  "size": 384,
  "blame": 0,
  "adaptive": false,
  "timestamp": 1570608173,
  "transactionsRoot": "0xbe7a9e531d55ed950a217272afa035f57f6c512ca249bae19e214cf2b470562e"
  "transactions": [
    "0x3910617de2a689f79bccd3d36866f4afd9ca93732c8e7be280a84190db701190"
  ],
  "deferredLogsBloomHash": "0xd397b3b043d87fcd6fad1291ff0bfd16401c274896d8c63a923727f077b8e0b5",
  "deferredReceiptsRoot": "0x522717233b96e0a03d85f02f8127aa0e23ef2e0865c95bb7ac577ee3754875e4",
  "deferredStateRoot": "0xc4ec82320df3b5ce48e22d33cc82f665a274dc920796a3e206be44682b7812a2",
  "deferredStateRootWithAux": {
    "auxInfo": {
      "intermediateDeltaEpochId": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
      "previousSnapshotRoot": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"
    },
    "stateRoot": {
      "deltaRoot": "0xbc71c52f0dae840fd8815de081a2774927077714a5fe7c342b0e5e81f7bcd38e",
      "intermediateDeltaRoot": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
      "snapshotRoot": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"
    }
  },
}

 @example
 > await confluxWeb.cfx.getBlock("0xdf19947ee92cae1de92fd05d949c654afa4afb77ce42024533d5b47cb861575a", true);
 {
  "adaptive": false,
  "blame": 0,
  "deferredLogsBloomHash": "0xd397b3b043d87fcd6fad1291ff0bfd16401c274896d8c63a923727f077b8e0b5",
  "deferredReceiptsRoot": "0x522717233b96e0a03d85f02f8127aa0e23ef2e0865c95bb7ac577ee3754875e4",
  "deferredStateRoot": "0xc4ec82320df3b5ce48e22d33cc82f665a274dc920796a3e206be44682b7812a2",
  "deferredStateRootWithAux": {
    "auxInfo": {
      "intermediateDeltaEpochId": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
      "previousSnapshotRoot": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"
    },
    "stateRoot": {
      "deltaRoot": "0xbc71c52f0dae840fd8815de081a2774927077714a5fe7c342b0e5e81f7bcd38e",
      "intermediateDeltaRoot": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
      "snapshotRoot": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"
    }
  },
  "difficulty": "21351313",
  "epochNumber": 925836,
  "gasLimit": 3000000000,
  "hash": "0xdf19947ee92cae1de92fd05d949c654afa4afb77ce42024533d5b47cb861575a",
  "height": 925836,
  "miner": "0x0000000000000000000000000000000000000015",
  "nonce": "0xaaa4a571ad424ec",
  "parentHash": "0xa378c9e283c08eac0e2ac51a8c19e61717af812a157eb914d35b171ed20920b9",
  "refereeHashes": [],
  "size": 384,
  "stable": true,
  "timestamp": 1570608173,
  "transactions": [
    {
      "blockHash": "0xdf19947ee92cae1de92fd05d949c654afa4afb77ce42024533d5b47cb861575a",
      "contractCreated": null,
      "data": "0x",
      "from": "0xA70ddf9B9750c575Db453Eea6A041f4C8536785A",
      "gas": 21000,
      "gasPrice": "819",
      "hash": "0x3910617de2a689f79bccd3d36866f4afd9ca93732c8e7be280a84190db701190",
      "nonce": 921,
      "r": "0x985743d5d627e8f93e243bfd71e401f7bf5c7b098afeb910952df789312cc7b1",
      "s": "0xaaf07bc11d56516f90697fb0f1b8140ec9b252c66e8f3172799e2829d457775",
      "status": "0x0",
      "to": "0xbbd9E9bE525AB967e633BcDAEaC8bD5723ED4D6B",
      "transactionIndex": 0,
      "v": 1,
      "value": "1000000000000000000"
    }
  ],
  "transactionsRoot": "0xbe7a9e531d55ed950a217272afa035f57f6c512ca249bae19e214cf2b470562e"
}

 */
async function getBlock(blockHashOrEpochNumber, returnTransactionObjects) {}

/**
 * Returns a transaction matching the given transaction hash.
 *
 * @param {string} transactionHash - The transaction hash.
 * @return {Promise<object>} The transaction object
 - `string` blockHash: Hash of the block where this transaction was in and got executed. `null` when its pending.
 - `number` transactionIndex: Integer of the transactions index position in the block.
 - `string` hash: Hash of the transaction.
 - `number` nonce: The number of transactions made by the sender prior to this one.
 - `string` from: Address of the sender.
 - `string` to: Address of the receiver. null when its a contract creation transaction.
 - `string` value: Value transferred in Drip.
 - `string` data: The data send along with the transaction.
 - `number` gas: Gas provided by the sender.
 - `number` gasPrice: Gas price provided by the sender in Drip.
 - `string` status: '0x0' successful execution; '0x1' exception happened but nonce still increased; '0x2' exception happened and nonce didn't increase.
 - `string|null` contractCreated: The contract address created, if the transaction was a contract creation, otherwise null.
 - `string` r: ECDSA signature r
 - `string` s: ECDSA signature s
 - `string` v: ECDSA recovery id
 *
 * @example
 > await confluxWeb.cfx.getTransaction("0xdf19947ee92cae1de92fd05d949c654afa4afb77ce42024533d5b47cb861575a");
 {
  "blockHash": "0xdf19947ee92cae1de92fd05d949c654afa4afb77ce42024533d5b47cb861575a",
  "transactionIndex": 0,
  "hash": "0x3910617de2a689f79bccd3d36866f4afd9ca93732c8e7be280a84190db701190",
  "nonce": 921,
  "from": "0xA70ddf9B9750c575Db453Eea6A041f4C8536785A",
  "to": "0xbbd9E9bE525AB967e633BcDAEaC8bD5723ED4D6B",
  "value": "1000000000000000000"
  "data": "0x",
  "gas": 21000,
  "gasPrice": "819",
  "status": "0x0",
  "contractCreated": null,
  "r": "0x985743d5d627e8f93e243bfd71e401f7bf5c7b098afeb910952df789312cc7b1",
  "s": "0xaaf07bc11d56516f90697fb0f1b8140ec9b252c66e8f3172799e2829d457775",
  "v": 1,
}
 */
async function getTransaction(transactionHash) {}

/**
 * Get the numbers of transactions sent from this address.
 *
 * @param {string} address - The address to get the numbers of transactions from.
 * @param {number|string} [defaultEpoch=`confluxWeb.cfx.defaultEpoch`] - If you pass this parameter it will not use the default epoch.
 *
 * @return {Promise<number>}  The number of transactions sent from the given address.
 *
 * @example
 > await confluxWeb.cfx.getTransactionCount("0xa70ddf9b9750c575db453eea6a041f4c8536785a");
 974

 > await confluxWeb.cfx.getTransactionCount("0xa70ddf9b9750c575db453eea6a041f4c8536785a", 'earliest');
 0
 */
async function getTransactionCount(address, defaultEpoch) {}

/**
 * Sends an already signed transaction, generated for example using confluxWeb.cfx.accounts.signTransaction
 *
 * @param {string} signedTransactionData - Signed transaction data in HEX format
 * @return {Promise<string>} Transaction hash
 *
 * @example
 > const ConfluxTx = require('confluxjs-transaction');
 > const tx = new ConfluxTx({
    nonce: '0x03',
    gasPrice: '0x01',
    gasLimit: '0x5208', // 21000
    to: '0x1ead8630345121d19ee3604128e5dc54b36e8ea6', // ADDRESS_TO
    value: '0x01',
  });
 > tx.sign(Buffer.from('a816a06117e572ca7ae2f786a046d2bc478051d0717bf5cc4f5397923258d393', 'hex')); // KEY_FROM
 > await confluxWeb.cfx.sendSignedTransaction('0x' + tx.serialize().toString('hex'));
 0x200b930e95b3c8c54978499c6407ef71fc96a83eced88640fae59b75e1d16ef4
 */
async function sendSignedTransaction(signedTransactionData) {}

/**
 * Signs a transaction. This account needs to be unlocked.
 *
 * @param rawTx {object}
 * @param rawTx.from {number} - An address or index of a local wallet in confluxWeb.cfx.accounts.wallet.
 * @param [rawTx.to=undefined] {string} - The destination address of the message, left undefined for a contract-creation transaction.
 * @param [rawTx.value] {number|string|BN|BigNumber} - The value transferred for the transaction in drip, also the endowment if it’s a contract-creation transaction.
 * @param [rawTx.gas=`To-Be-Determined`] {number} - The amount of gas to use for the transaction (unused gas is refunded).
 * @param [rawTx.gasPrice=`confluxWeb.cfx.gasPrice`] {number|string|BN|BigNumber} - The price of gas for this transaction in drip.
 * @param [rawTx.data] {string} - Either a ABI byte string containing the data of the function call on a contract, or in the case of a contract-creation transaction the initialisation code.
 * @param [rawTx.nonce] {number} - Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.
 * @return {Promise<object>}  The RLP encoded transaction. The raw property can be used to send the transaction using confluxWeb.cfx.sendSignedTransaction.
 - `string` rawTransaction: Raw transaction string
 - `string` messageHash: Hash of transaction for calculating signature
 - `string` r: ECDSA signature r
 - `string` s: ECDSA signature s
 - `string` v: ECDSA recovery id
 *
 * @example
 > confluxWeb.cfx.accounts.wallet.add('a816a06117e572ca7ae2f786a046d2bc478051d0717bf5cc4f5397923258d393'); // KEY_FROM
 > await confluxWeb.cfx.signTransaction({
    from: 0, // index
    nonce: 0, // make nonce appropriate
    gasPrice: 10,
    gas: 21000,
    value: new BN('300000000000000000'), // 300000000000000000 drip === 0.3 cfx token
    to: '0x1ead8630345121d19ee3604128e5dc54b36e8ea6', // ADDRESS_TO
    data: '',
  });

 {
  "messageHash": "53aec3cdccb8ab438303ece4559fc4464a118416828d8c7c0427f5debcd8feae",
  "r": "0x1feaa7a3d6ae22c013b0987e8fa8e39ff1df1e6080c95d7d5e085e2cd9b02ff2",
  "s": "0x0451df58547f0e0ad36d06058cd0c8cfa4eb201b4d09255f56ba0d750e520a67",
  "v": "0x01",
  "rawTransaction": "0xf867800a825208941ead8630345121d19ee3604128e5dc54b36e8ea6880429d069189e00008001a01feaa7a3d6ae22c013b0987e8fa8e39ff1df1e6080c95d7d5e085e2cd9b02ff2a00451df58547f0e0ad36d06058cd0c8cfa4eb201b4d09255f56ba0d750e520a67"
 }
 */
async function signTransaction(rawTx) {}

/**
 * Executes a message call transaction, which is directly executed in the VM of the node, but never mined into the blockchain.
 *
 * @param callObject {object} - A transaction object, with the difference that for calls the from property is optional as well.
 * @param [defaultEpoch=conflux.cfx.defaultEpoch] {string|number}
 * @return {Promise<string>} The returned data of the call, e.g. A smart contract functions return value.
 *
 * @example
 > await confluxWeb.cfx.call({
    to: "0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae", // contract address
    data: "0xc6888fa10000000000000000000000000000000000000000000000000000000000000003"
  })
 0x000000000000000000000000000000000000000000000000000000000000000a
 */
async function call(callObject, defaultEpoch) {}

/**
 * Executes a message call or transaction and returns the amount of the gas used.
 *
 * @param callObject {object} - A transaction object, with the difference that for calls the from property is optional as well.
 * @return {Promise<number>} - the used gas for the simulated call/transaction.
 *
 * @example
 > await confluxWeb.cfx.estimateGas({
    to: "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe",
    data: "0xc6888fa10000000000000000000000000000000000000000000000000000000000000003"
  })
 0x0000000000000000000000000000000000000000000000000000000000000015
 */
async function estimateGas(callObject) {}

/**
 * Returns the receipt of a transaction by transaction hash.
 *
 * > NOTE: The receipt is not available for pending transactions and returns null.
 *
 * @param txHash {string} - The transaction hash.
 * @return {Promise<object>} A transaction receipt object, or null when no receipt was found.
 - `boolean` status: `true` if the transaction was successful; `false`, if the EVM reverted the transaction.
 - `number` outcomeStatus: 1 status `true`; 0 status `false`.
 - `string` stateRoot: The state root of transaction execution.
 - `number` epochNumber: Epoch number where this transaction was in.
 - `string` blockHash: Hash of the block where this transaction was in.
 - `string` transactionHash: Hash of the transaction.
 - `number` index: Integer of the transactions index position in the block.
 - `string` from: Address of the sender.
 - `string` to: Address of the receiver. null when its a contract creation transaction.
 - `string|null` contractCreated: The contract address created, if the transaction was a contract creation, otherwise null.
 - `number` gasUsed: The amount of gas used by this specific transaction alone.
 - `[object]` logs: Array of log objects, which this transaction generated.
 - `[string]` logs[].address: The address of the contract executing at the point of the `LOG` operation.
 - `[string]` logs[].topics: The topics associated with the `LOG` operation.
 - `[string]` logs[].data: The data associated with the `LOG` operation.
 - `string` logsBloom:
 *
 * @example
 > await confluxWeb.cfx.getTransactionReceipt('0x689258ba9fe2c25bcdc43ebb5c9018d1b56d25b1c87de1b371a19f5548c16dc1');
 {
  status: true,
  outcomeStatus: 0,
  stateRoot: '0x75df853d267b40a98f6fe1103a510822bc1582894e8a9e95eb9ff0697545e4d2',
  epochNumber: 1017673,
  blockHash: '0xdefb3add0256b12c80f6e4fddde81da9c93ec88861cbee14051379f79624f911',
  transactionHash: '0x689258ba9fe2c25bcdc43ebb5c9018d1b56d25b1c87de1b371a19f5548c16dc1',
  index: 0,
  from: '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b',
  to: '0x1ead8630345121d19ee3604128e5dc54b36e8ea6',
  contractCreated: null,
  gasUsed: 21000,
  logs: [],
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
 }

 */
async function getTransactionReceipt(txHash) {}

/**
 * Gets past logs, matching the given options.
 *
 * @param options {object}
 * @param [options.fromEpoch] {string} - The number of the earliest block
 * @param [options.toEpoch] {string} - The number of the latest block
 * @param options.address {string|string[]} - An address or a list of addresses to only get logs from particular account(s).
 * @param options.topics {array} - An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null, e.g. [null, '0x12...']. You can also pass an array for each topic with options for that topic e.g. [null, ['option1', 'option2']]
 * @return {Promise<object[]>} Array of log objects.
 *
 * @example
 > await confluxWeb.cfx.getPastLogs({
    fromEpoch: '0x0',
    toEpoch: 'latest_mined',
    address: '0x169a10a431130B2F4853294A4a966803668af385'
  });

 [
   {
      "address": "0x169a10a431130B2F4853294A4a966803668af385",
      "blockHash": "0x9f18cbbbc432d678b94ee6446e9305abf8f02deb0b03877cc0c71c0a71c08faf",
      "epochNumber": "0x0",
      "data": "0x",
      "logIndex": 0,
      "removed": false,
      "topics": [
        "0x44d6d25963f097ad14f29f06854a01f575648a1ef82f30e562ccd3889717e339",
        "0x000000000000000000000000c24a31039a4dfc9ee9039bd9241a0c7848b92ae1"
      ],
      "transactionHash": "0xb777fc8ee9c5b5f6eb2b1c7d73106f07eb1692b9db08d9f65affafb82641559f",
      "transactionIndex": 0,
      "transactionLogIndex": "0x0",
      "type": "mined",
      "id": "log_0x5157483fef4019b6a231963496322bbf123b2559f73eef47f60dd5d1b1364fe4"
    },
   ...
 ]
 */
async function getPastLogs(options) {}
