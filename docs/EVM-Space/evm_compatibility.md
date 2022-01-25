---
id: evm_space_vm_compatibility
title: Compatibility with the EVM
custom_edit_url: https://github.com/Conflux-Chain/conflux-doc/edit/master/docs/EVM-Space/EVM_Compatibility.md
keywords:
  - EVM
  - VM
---

The EVM space implements an Ethereum Virtual Machine (EVM).

* `blockhash(uint blockNumber) returns (bytes32)`: hash of the given block - only works for `1` most recent blocks (Ethereum is 256)
* Block generate rate is 1.25s per block (mainnet)
* Contract max code size is `49152` double as Ethereum
* Opcode `SSTORE` and `SUICIDE` `do not` refund gas
* Storage related opcodes (Eg `SSTORE`) will consume double gas than Ethereum
* At most `1/4` of transaction `gasLimit` will be refund (if not used)
* Block gasLimit is 1500w now.

## Phantom transaction

TO UPDATE