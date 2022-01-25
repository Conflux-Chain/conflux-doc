# 跨链

通过新增加的 `CrossSpaceCall` 内置合约(`0x0888000000000000000000000000000000000006`)可以实现跨链合约调用

```js
// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

interface CrossSpaceCall {

    event Call(bytes20 indexed sender, bytes20 indexed receiver, uint256 value, uint256 nonce, bytes data);

    event Create(bytes20 indexed sender, bytes20 indexed contract_address, uint256 value, uint256 nonce, bytes init);

    event Withdraw(bytes20 indexed sender, address indexed receiver, uint256 value);

    function createEVM(bytes calldata init) external payable returns (bytes20);

    function transferEVM(bytes20 to) external payable returns (bytes memory output);

    function callEVM(bytes20 to, bytes calldata data) external payable returns (bytes memory output);

    function staticCallEVM(bytes20 to, bytes calldata data) external view returns (bytes memory output);

    function withdrawFromMapped(uint256 value) external;

    function mappedBalance(address addr) external view returns (uint256);

    function mappedNonce(address addr) external view returns (uint256);
}
```

## CFX 跨链

将 CFX 从 Conflux 主链跨到 EVM 子链可以调用 `CrossSpaceCall.transferEVM(targetAddress)` 方法，指定接受地址并设置交易的 value 即可。

将 CFX 从 EVM 子链跨会 Conflux 主链，需要先将 CFX 转到 Conflux 接受地址的映射地址，然后调用 `CrossSpaceCall.withdrawFromMapped(amount)` 即可取回 CFX。

某个 Conflux 地址的 EVM 映射地址可通过将地址转换为 bytes 类型，然后计算 keccak hash ，取后 160 位即可。

## ERC20 跨链

## 合约跨链调用