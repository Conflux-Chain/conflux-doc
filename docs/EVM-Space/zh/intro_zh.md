---
id: intro_of_evm_space
title: Introduction
custom_edit_url: https://github.com/Conflux-Chain/conflux-doc/edit/master/docs/EVM-Space/intro.md
keywords:
  - Introduction
---

Conflux 在 `v2.0` 引入了一个兼容 EVM 网络的空间，能够实现`虚拟机完全兼容`以及`核心 eth RPC 兼容`。加密用户和开发者可以直接使用以太坊生态的钱包(MetaMask)和开发工具(Truffle, Hardhat, Remix, web3.js, ethers.js等) 来跟 EVM Space 直接交互。使得以太坊生态用户和开发者可以很方便体验 Conflux 网络的高 TPS 和低手续费优势。

底层实现上 EVM Space 同 Conflux Native Space 共用一套共识协议及数据账本，但从逻辑上看是独立的两条链。通过内置合约可以实现 CFX 在个 Space 之间互跨。并且可以实现一定程度的跨 Space 合约调用（从 Conflux Native Space call EVM Space 合约）。

* [CIP-90](https://forum.conflux.fun/t/cip-90-evm/13143)
