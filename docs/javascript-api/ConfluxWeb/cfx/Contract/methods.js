/**
 * Encodes the ABI for this method.
 * This can be used to send a transaction, call a method,
 * or pass it into another smart contracts method as arguments.
 *
 * > NOTE: contract instance create code see Contract.constructor
 *
 * @return {string} The encoded ABI byte code to send via a transaction or call.
 *
 * @example
 > await contract.methods.inc(1).encodeABI();
 "0x812600df0000000000000000000000000000000000000000000000000000000000000001"

 > await contract.methods.count().encodeABI();
 "0x06661abd"
 */
function encodeABI() {}

/**
 * Will call estimate the gas a method execution will take when executed in the EVM without sending any transaction. The estimation can differ from the actual gas used when later sending a transaction, as the state of the smart contract can be different at that time.
 *
 * > NOTE: contract instance create code see Contract.constructor
 *
 * @return {Promise<number>}
 * @example
 > await contract.methods.inc(1).estimateGas();
 26928

 > await contract.methods.count().estimateGas();
 21655
 */
async function estimateGas(...args) {}

/**
 * Will call a “constant” method and execute its smart contract method in the EVM without sending any transaction.
 * Note calling can not alter the smart contract state.
 *
 * > NOTE: contract instance create code see Contract.constructor
 *
 * @return {Promise} contract method return value
 *
 * @example
 > await contract.methods.inc(1).call();
 BigNumber { _hex: '0xff' }

 > await contract.methods.count().call();
 BigNumber { _hex: '0xfe' }
 */
async function call() {}

/**
 * Will send a transaction to the smart contract and execute its method.
 * Note this can alter the smart contract state.
 *
 * > NOTE: contract instance create code see Contract.constructor
 *
 * @param options {object}
 * @param options.from {string} - The address the transaction should be sent from.
 * @param [options.gasPrice=contract.defaultGasPrice] {string} - The gas price in wei to use for this transaction.
 * @param [options.gas=contract.defaultGas] {number} - The maximum gas provided for this transaction (gas limit).
 * @param [options.value] {number|string|BN|BigNumber} - The value transferred for the transaction in drip.
 * @return {Promise<string>} Transaction hash.
 *
 * @example
 > await contract.methods.inc(1).send({
    from: '0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b',
    gas: 100000000,
    gasPrice: 819
 });
 "0xb01101228cbd8619ab1f8f017530ff945b655472be211eb828b31bc7c97b9d5c"
 */
async function send(options) {}
