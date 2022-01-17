# EVM Space

Conflux-rust 在 v2.0 版本引入了一条兼容 EVM 的子链，能够实现`虚拟机完全兼容`以及`核心 eth RPC 兼容`。加密用户和开发者可以直接使用以太坊生态的钱包(MetaMask)和开发工具(Truffle, Hardhat, web3.js, ethers.js等) 来跟 EVM 子网直接交互。使得以太坊生态用户和开发者可以很方便体验 Conflux 网络的高 TPS 和低手续费优势。

底层实现上 EVM 子链同 Conflux 主链共用一套共识协议及数据账本，但从逻辑上看是独立的两条链。通过内置合约可以实现 CFX 在两条链之间互跨。并且可以实现一定程度的跨链合约调用（从 Conflux 链 call EVM 子链合约）。
