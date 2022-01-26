---
id: evm_space_vm_compatibility
title: Compatibility with the EVM
custom_edit_url: https://github.com/Conflux-Chain/conflux-doc/edit/master/docs/EVM-Space/EVM_Compatibility.md
keywords:
  - EVM
  - VM
---

The EVM space implements an Ethereum Virtual Machine (EVM). Below are some difference between EVM space and Ethereum:

* The `NUMBER` opcode will return the `epoch number`.
* The `BLOCKHASH` opcode can only take `NUMBER-1` as input. (Unlike Ethereum, which takes any integer in `NUMBER-256` to `NUMBER-1` as input)
* Block generate rate is 1.25s per block (mainnet)
* Contract max code size is `49152` double as Ethereum
* No gas refund in `SSTORE` opcode and `SUICIDE` opcode.
* The operations which occupy storage have a different gas cost.
  1. `SSTORE` costs 40000 gas (instead of 20000 gas in Ethereum) when changing a storage entry from zero to non-zero.
  2. When deploying a new contract, each byte costs 400 gas (instead of 200 gas in Ethereum).
  3. When creating a new account by `CALL` or `SUICIDE`, it consumes 50000 gas (instead of 25000 gas in Ethereum).
* At most `1/4` of transaction `gasLimit` will be refund (if not used)
* Only the block whose block height is a multiple of `5` can pack Ethereum type transaction. The total gas limit of these transaction cannot exceed half of the block gas limit (1500w).

## Precompiles

### Standard precompiles

<div class="compat-evm-precompiles-table"></div>

Address | ID          | Name                                 | Spec           | Status
------- | ----------- | ------------------------------------ | -------------- | ------
0x01    | `ECRecover` | ECDSA public key recovery            | [Yellow Paper] | ✅
0x02    | `SHA256`    | SHA-2 256-bit hash function          | [Yellow Paper] | ✅
0x03    | `RIPEMD160` | RIPEMD 160-bit hash function         | [Yellow Paper] | ✅
0x04    | `Identity`  | Identity function                    | [Yellow Paper] | ✅
0x05    | `ModExp`    | Big integer modular exponentiation   | [EIP-198]      | ✅
0x06    | `BN128Add`  | Elliptic curve addition              | [EIP-196]      | ✅
0x07    | `BN128Mul`  | Elliptic curve scalar multiplication | [EIP-196]      | ✅
0x08    | `BN128Pair` | Elliptic curve pairing check         | [EIP-197]      | ✅
0x09    | `Blake2F`   | BLAKE2b `F` compression function     | [EIP-152]      | ✅

[Yellow Paper]: https://ethereum.github.io/yellowpaper/paper.pdf
[EIP-152]:      https://eips.ethereum.org/EIPS/eip-152
[EIP-196]:      https://eips.ethereum.org/EIPS/eip-196
[EIP-197]:      https://eips.ethereum.org/EIPS/eip-197
[EIP-198]:      https://eips.ethereum.org/EIPS/eip-198

## Phantom transactions

TO UPDATE
