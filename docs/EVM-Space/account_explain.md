# 两个 Space 的账户关系

CIP-90 引入的 EVM space 是一个独立的空间，其与 Native space 是逻辑上隔绝开的。EVM space 中的账户有自己的 balance 和状态。

与 Native space 交互需要使用 `base32` 格式的账户地址。而与 EVM space 交互则需要使用 `hex40` 格式的 地址。一个私钥可以同时在两个 Space 使用，但在两个 Space 中是两个账户。
另外`需要注意`的是：**虽然 base32 地址也可以转换成 hex40 格式，但同一个私钥导入 Conflux 钱包获取的 base32 地址转换为 hex40 格式之后，`大概率`与该私钥导入以太坊钱包获取的地址`不相同`**。因此如果对两种地址（两个账户）的对应关系不熟悉的话，不要随意互相转换格式混用。

## 用于跨 Space 操作的`映射地址`

虽然两个 Space 是独立的，但通过内置合约 CrossSpaceCall 可以实现 CFX 和 数据的原子互跨。通过该合约的以下三个方法可实现 CFX 在两个 Space 互跨。（该内置合约只能在 Native Space 进行交互）

```js
function transferEVM(bytes20 to) external payable returns (bytes memory output);
function mappedBalance(address addr) external view returns (uint256);
function withdrawFromMapped(uint256 value) external;
```

CFX 从 Native Space 跨入 EVM Space 需要调用该合约的 `transferEVM(bytes20 to)` 方法，目标地址通过方法参数 `to` 来指定，整个操作一步即可完成。

若想将 CFX 从 EVM Space 跨会 Native Space 则需要分成两步来实现。每个 Native Space 的账户`在 EVM Space` 都有一个一一对应的`映射账户(hex40)`。跨回 CFX，需要首先在 EVM Space 将 CFX 转给`跨回目标地址`在 EVM Space 的`映射地址`, 然后在 Native Space 调用 CrossSpaceCall 内置合约的 `withdrawFromMapped(uint256 value)` 方法，将 CFX 从映射地址跨回接受地址。

映射地址是通过 Native Space base32 地址计算出来的，计算规则如下：

1. 将 base32 地址转换为 hex 格式，进而转换为 bytes 类型
2. 对上一步的 bytes 进行 keccak 计算得到 hash
3. 取 hash 的后 160 位，然后转换为 hex40 格式，即为在 EVM Space 的映射地址。

`js-conflux-sdk v2.0` 提供了方法，获取 base32 地址的映射地址

```js
const { address } = require('js-conflux-sdk');
const base32Address = 'cfx:aak2rra2njvd77ezwjvx04kkds9fzagfe6ku8scz91';
const mappedAddress = address.cfxMappedEVMSpaceAddress(base32Address);
// 0x12Bf6283CcF8Ad6ffA63f7Da63EDc217228d839A
```

关于映射地址需要注意的几个地方：

1. 映射地址是一个 EVM Space 地址，所以格式为 hex40
2. 映射地址的作用是，在 CFX 跨回 Native Space 时作为中转地址
3. **切记`不要`直接把 base32 地址转换为 hex40 格式作为映射地址，此操作会导致资产丢失**
