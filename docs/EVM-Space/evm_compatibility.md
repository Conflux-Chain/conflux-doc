---
id: evm_space_vm_compatibility
title: Compatibility with the EVM
custom_edit_url: https://github.com/Conflux-Chain/conflux-doc/edit/master/docs/EVM-Space/EVM_Compatibility.md
keywords:
  - EVM
  - VM
---

The EVM space implements an Ethereum Virtual Machine (EVM).

* The `NUMBER` opcode will return the `epoch number`.
* The `BLOCKHASH` opcode can only take `NUMBER-1` as input. (Unlike Ethereum, which takes any integer in `NUMBER-256` to `NUMBER-1` as input)
* Block generate rate is 1.25s per block (mainnet)
* Contract max code size is `49152` double as Ethereum
* No gas refund in SSTORE opcode and SUICIDE opcode.
* The operations which occupy storage have a different gas cost.
  1. `SSTORE` costs 40000 gas (instead of 20000 gas in Ethereum) when changing a storage entry from zero to non-zero.
  2. When deploying a new contract, each byte costs 400 gas (instead of 200 gas in Ethereum).
  3. When creating a new account by `CALL` or `SUICIDE`, it consumes 50000 gas (instead of 25000 gas in Ethereum).
* At most `1/4` of transaction `gasLimit` will be refund (if not used)
* Only the block whose block height is a multiple of `5` can pack Ethereum type transaction. The total gas limit of these transaction cannot exceed half of the block gas limit (1500w).

## Phantom transactions

TO UPDATE
