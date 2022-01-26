---
id: intro_of_evm_space
title: Introduction
custom_edit_url: https://github.com/Conflux-Chain/conflux-doc/edit/master/docs/EVM-Space/intro.md
keywords:
  - Introduction
---

Conflux has a virtual machine that is similar to EVM. However, there are still some differences between Conflux VM and Ethereum VM. Conflux has a different transaction format and a different rule for generating addresses from public keys. This impedes the EVM compatible dApps porting to Conflux. The previous CIP-72 and CIP-80 try to solve these obstacles. But that will influence the current applications. So the CIP-90 introduces a new space to construct a space that is fully EVM-compatible without changing the existing accounts and transactions.

The [CIP-90](https://github.com/Conflux-Chain/CIPs/blob/master/CIPs/cip-90.md) has introduced a new fully EVM-compatible space. The new space is called `EVM Space`, and the current space is called `Native Space`. The EVM Space follows the same rule as EVM and supports eth rpc like eth_getBalance, so the tools from ethereum ecosystem can be used on Conflux directly.

The accounts in two spaces are `separated`. A native space account can only interact with the other accounts in native space with the original conflux transaction type. An EVM space account can only interact with the other accounts in EVM space with Ethereum transaction type `EIP-155`. A new internal contract will be deployed for `assets and data cross-space`. Unlike cross-chain operations, the cross-space operations are `atomic` and with `layer 1 security`.
