# Compatibility with the EVM

* `blockhash(uint blockNumber) returns (bytes32)`: hash of the given block - only works for `1` most recent blocks (Ethereum is 256)
* block generate rate is 1.3s (mainnet)
* contract code size is 49152 double as ethereum
