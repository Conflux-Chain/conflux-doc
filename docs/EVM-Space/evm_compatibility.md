# Compatibility with the EVM

* `blockhash(uint blockNumber) returns (bytes32)`: hash of the given block - only works for `1` most recent blocks (Ethereum is 256)
* block generate rate is 1.3s (mainnet)
* contract code size is 49152 double as ethereum
* SSTORE 操作码和 SUICIDE 操作码无燃料费用退款
* 涉及存储占用的操作，如 SSTORE，所消耗的燃料费用不同