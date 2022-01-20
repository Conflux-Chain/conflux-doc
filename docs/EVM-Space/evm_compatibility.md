# Compatibility with the EVM

* `blockhash(uint blockNumber) returns (bytes32)`: hash of the given block - only works for `1` most recent blocks (Ethereum is 256)
* Block generate rate is 1.3s (mainnet)
* contract code size is 49152 double as Ethereum
* Opcode `SSTORE` and `SUICIDE` do not refund gas
* Storage related opcodes (`SSTORE`) will consume double gas than Ethereum
* At most `1/4` of `gasLimit` will refund if not used
