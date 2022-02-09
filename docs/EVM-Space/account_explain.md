# Correspondence between addresses in two spaces

The eSpace introduced by CIP-90 is an independent space that is logically isolated from the Core space.  Accounts in the eSpace have their own balance and status.

Interacting with the Core space requires base32 account addresses. Interacting with the eSpace requires hex40 addresses.  A private key can be used in both spaces simultaniously.  But in both spaces, they are two accounts.

Notes: Although the base32 address can be converted to hex40 format, the base32 address obtained from the private key imported in Conflux wallet will most likey be different from the address obtained from the same private key imported in Ethereum wallet with hex40 format. **Therefore, if you are not familiar with the correspondence between these two addresses (two accounts), don't mix them in the same format**.

## Mapped Address for Cross-Space Operations

Although the two Spaces are independent, atomic-crossing of CFX and data can be achieved through CrossSpaceCall (A built-in contract). The following three methods of this contract enable CFX to span between the two Spaces. (This built-in contract can only be interacted with in Core Space)

```js
function transferEVM(bytes20 to) external payable returns (bytes memory output);
function mappedBalance(address addr) external view returns (uint256);
function withdrawFromMapped(uint256 value) external;
```

To cross CFX from Core Space to eSpace, the `transferEVM(bytes20 to)` method of this contract need to be called. And the destination address is specified by the method parameter to. The whole crossing operation will be done in one step.

There will be two steps while crossing CFX from eSpace to Core Space. Each account in Core Space has a mapped account(hex40) in eSpace. First of all, you should transfer CFX to mapped account of the target crossing back address in eSpace(This action in eSpace). And then call the `withdrawFromMapped(uint256 value)` method of the `CrossSpaceCall` (The built-in contract) in Core Space to cross the CFX from the mapped address back to the receiving address.

The mapped address is calculated from the base32 address in Native Space. The rules are as follows:

1. Convert the base32 address to hex format, and then convert to bytes type
2. Keccak the bytes from the previous step to get the hash.
3. Take the last 160 bits of the hash and convert it to hex40 format, which is the mapped address in EVM Space.

`js-conflux-sdk v2.0` provides a method to get the mapped address of the base32 address

```js
const { address } = require('js-conflux-sdk');
const base32Address = 'cfx:aak2rra2njvd77ezwjvx04kkds9fzagfe6ku8scz91';
const mappedAddress = address.cfxMappedEVMSpaceAddress(base32Address);
// 0x12Bf6283CcF8Ad6ffA63f7Da63EDc217228d839A
```

Notes about the mapped address:

1. The mapped address is an address in eSpace, so it has a hex40 format.
2. The purpose of the mapped address is to serve as a transit address when crossing CFX back to Core space.
3. **Remember NOT to convert the base32 address directly to hex40 format as the mapped address. This action will result in the loss of your assets**
