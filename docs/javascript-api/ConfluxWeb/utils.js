/**
 * The randomHex library to generate cryptographically strong pseudo-random HEX strings from a given byte size.
 *
 * @param {number} bytesSize - given byte size
 * @return {string} The generated random HEX string.
 *
 * @example
 > confluxWeb.utils.randomHex(32)
 0xd3185018552117d2c4b5277307c455b4746267b27ea133abd288c0b136c3865c

 > confluxWeb.utils.randomHex(4)
 0x472ace2a

 > confluxWeb.utils.randomHex(2)
 0x52ed

 > confluxWeb.utils.randomHex(1)
 0x3b

 > confluxWeb.utils.randomHex(0)
 0x
 */
function randomHex(bytesSize) {}

/**
 * Checks if a given value is a BN.js instance.
 * @param {BN} bn - An BN.js instance
 * @return {boolean}
 *
 * @example
 > const bn = new BN(10)
 > confluxWeb.utils.isBN(bn)
 true

 */
function isBN(bn) {}

/**
 * Will calculate the sha3 of the input.
 * @param {string} str - A string to hash
 * @return {string} the result hash.
 *
 * @example
 > confluxWeb.utils.sha3('234');
 "0xc1912fee45d61c87cc5ea59dae311904cd86b84fee17cc96966216f811ce6a79"

 > confluxWeb.utils.keccak256('234'); // alias
 "0xc1912fee45d61c87cc5ea59dae311904cd86b84fee17cc96966216f811ce6a79"

 */
function sha3(str) {}

/**
 * Will calculate the sha3 of given input parameters in the same way solidity would.
 * This means arguments will be ABI converted and tightly packed before being hashed.
 *
 * @param {Array.<string|number|object|BN>} [args]
 *
 * @example
 > confluxWeb.utils.soliditySha3('234564535', '0xfff23243', true, -10);
 "0x3e27a893dc40ef8a7f0841d96639de2f58a132be5ae466d40087a2cfa83b7179"

 > confluxWeb.utils.soliditySha3('Hello!%'); // auto detects: string
 "0x661136a4267dba9ccdf6bfddb7c00e714de936674c4bdb065a531cf1cb15c7fc"

 > confluxWeb.utils.soliditySha3('234'); // auto detects: uint256
 "0x61c831beab28d67d1bb40b5ae1a11e2757fa842f031a2d0bc94a7867bc5d26c2"

 > confluxWeb.utils.soliditySha3(0xea); // same as above
 "0x61c831beab28d67d1bb40b5ae1a11e2757fa842f031a2d0bc94a7867bc5d26c2"

 > confluxWeb.utils.soliditySha3(new BN('234')); // same as above
 "0x61c831beab28d67d1bb40b5ae1a11e2757fa842f031a2d0bc94a7867bc5d26c2"

 > confluxWeb.utils.soliditySha3({type: 'uint256', value: '234'}); // same as above
 "0x61c831beab28d67d1bb40b5ae1a11e2757fa842f031a2d0bc94a7867bc5d26c2"

 > confluxWeb.utils.soliditySha3({t: 'uint', v: new BN('234')}); // same as above
 "0x61c831beab28d67d1bb40b5ae1a11e2757fa842f031a2d0bc94a7867bc5d26c2"

 > confluxWeb.utils.soliditySha3('0x407D73d8a49eeb85D32Cf465507dd71d507100c1');
 "0x4e8ebbefa452077428f93c9520d3edd60594ff452a29ac7d2ccc11d47f3ab95b"

 > confluxWeb.utils.soliditySha3({t: 'bytes', v: '0x407D73d8a49eeb85D32Cf465507dd71d507100c1'}); // same result as above
 "0x4e8ebbefa452077428f93c9520d3edd60594ff452a29ac7d2ccc11d47f3ab95b"

 > confluxWeb.utils.soliditySha3({t: 'address', v: '0x407D73d8a49eeb85D32Cf465507dd71d507100c1'}); // same as above, but will do a checksum check, if its multi case
 "0x4e8ebbefa452077428f93c9520d3edd60594ff452a29ac7d2ccc11d47f3ab95b"

 > confluxWeb.utils.soliditySha3({t: 'bytes32', v: '0x407D73d8a49eeb85D32Cf465507dd71d507100c1'}); // different result as above
 "0x3c69a194aaf415ba5d6afca734660d0a3d45acdc05d54cd1ca89a8988e7625b4"

 > confluxWeb.utils.soliditySha3({t: 'string', v: 'Hello!%'}, {t: 'int8', v:-23}, {t: 'address', v: '0x85F43D8a49eeB85d32Cf465507DD71d507100C1d'});
 "0xa13b31627c1ed7aaded5aecec71baf02fe123797fffd45e662eac8e06fbe4955"
 */
function soliditySha3(...args) {}

/**
 * Checks if a given string is a HEX string.
 *
 * @param {string} hex - The given HEX string.
 * @return {boolean}
 *
 * @example
 > confluxWeb.utils.isHex('0xc1912');
 true

 > confluxWeb.utils.isHex(0xc1912);
 true

 > confluxWeb.utils.isHex('c1912');
 true

 > confluxWeb.utils.isHex(345); // this is tricky, as 345 can be a a HEX representation or a number, be careful when not having a 0x in front!
 true

 > confluxWeb.utils.isHex('0xZ1912');
 false

 > confluxWeb.utils.isHex('Hello');
 false
 */
function isHex(hex) {}

/**
 * Checks if a given string is a HEX string. Difference to isHex() is that it expects HEX to be prefixed with 0x.
 *
 * @param {string} hex - The given HEX string.
 * @return {boolean}
 *
 * @example
 > confluxWeb.utils.isHexStrict('0xc1912');
 true

 > confluxWeb.utils.isHexStrict(0xc1912);
 false

 > confluxWeb.utils.isHexStrict('c1912');
 false

 > confluxWeb.utils.isHexStrict(345); // this is tricky, as 345 can be a a HEX representation or a number, be careful when not having a 0x in front!
 false

 > confluxWeb.utils.isHexStrict('0xZ1912');
 false

 > confluxWeb.utils.isHex('Hello');
 false
 */
function isHexStrict(hex) {}

/**
 * Checks if a given string is a valid Conflux address. It will also check the checksum, if the address has upper and lowercase letters.
 * @param {string} address - An address string.
 * @return {string} The checksum address.
 *
 * @example
 > confluxWeb.utils.isAddress('0xc1912fee45d61c87cc5ea59dae31190fffff232d');
 true

 > confluxWeb.utils.isAddress('c1912fee45d61c87cc5ea59dae31190fffff232d');
 true

 > confluxWeb.utils.isAddress('0XC1912FEE45D61C87CC5EA59DAE31190FFFFF232D'); // as all is uppercase, no checksum will be checked
 true

 > confluxWeb.utils.isAddress('0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d');
 true

 > confluxWeb.utils.isAddress('0xC1912fEE45d61C87Cc5EA59DaE31190FFFFf232d'); // wrong checksum
 false
 */
function isAddress(address) {}

/**
 * Will convert an upper or lowercase Conflux address to a checksum address.
 * @param {string} address - An address string.
 *
 * @example
 > confluxWeb.utils.toChecksumAddress('0xc1912fee45d61c87cc5ea59dae31190fffff2323');
 "0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d"

 > confluxWeb.utils.toChecksumAddress('0XC1912FEE45D61C87CC5EA59DAE31190FFFFF232D'); // same as above
 "0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d"
 */
function toChecksumAddress(address) {}

/**
 * Checks the checksum of a given address. Will also return false on non-checksum addresses.
 * @param {string} address - An address string.
 * @return {boolean} true when the checksum of the address is valid, false if its not a checksum address, or the checksum is invalid.
 *
 * @example
 > confluxWeb.utils.checkAddressChecksum('0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d');
 true

 */
function checkAddressChecksum(address) {}

/**
 * Will auto convert any given value to HEX. Number strings will interpreted as numbers.
 * Text strings will be interpreted as UTF-8 strings.
 *
 * @param {string|number|BN|BigNumber} value - The input to convert to HEX.
 * @return {string} The resulting HEX string.
 *
 * @example
 > confluxWeb.utils.toHex('234');
 "0xea"

 > confluxWeb.utils.toHex(234);
 "0xea"

 > confluxWeb.utils.toHex(new BN('234'));
 "0xea"

 > confluxWeb.utils.toHex(new BigNumber('234'));
 "0xea"

 > confluxWeb.utils.toHex('I have 100€');
 "0x49206861766520313030e282ac"
 */
function toHex(value) {}

/**
 * Will safely convert any given value (including BigNumber.js instances) into a BN.js instance, for handling big numbers in JavaScript.
 *
 * > NOTE: For just the BN.js class use utils.BN
 *
 * @param {number|string} num - Number to convert to a big number.
 * @return {BN} The BN.js instance.
 *
 * @example
 > confluxWeb.utils.toBN(1234).toString();
 "1234"

 > confluxWeb.utils.toBN('1234').add(confluxWeb.utils.toBN('1')).toString();
 "1235"

 > confluxWeb.utils.toBN('0xea').toString();
 "234"
 */
function toBN(num) {}

/**
 * Returns the number representation of a given HEX value.
 *
 * > NOTE: This is not useful for big numbers, rather use utils.toBN instead.
 *
 * @param {string} hex -  A string to hash.
 * @return {number}
 *
 * @example
 > confluxWeb.utils.hexToNumber('0xea');
 234

 */
function hexToNumber(hex) {}

/**
 * Returns the number representation of a given HEX value as a string.
 *
 * @param {string} hex - A string to hash
 * @return {string} The number as a string
 *
 * @example
 > confluxWeb.utils.hexToNumberString('0xea');
 "234"
 */
function hexToNumberString(hex) {}

/**
 * Returns the HEX representation of a given number value.
 *
 * @param {number|string|BN|BigNumber} num - A number as string or number.
 * @return {string} The HEX value of the given number.
 *
 * @example
 > confluxWeb.utils.numberToHex('234');
 '0xea'
 */
function numberToHex(num) {}

/**
 * Returns the UTF-8 string representation of a given HEX value.
 *
 * @param {string} hex - A HEX string to convert to a UTF-8 string.
 * @return {string} The UTF-8 string.
 *
 * @example
 > confluxWeb.utils.hexToUtf8('0x49206861766520313030e282ac');
 "I have 100€"
 */
function hexToUtf8(hex) {}

/**
 * Returns the ASCII string representation of a given HEX value.
 *
 * @param {string} hex - A HEX string to convert to a ASCII string.
 * @return {string} The ASCII string.
 *
 * @example
 > confluxWeb.utils.hexToAscii('0x4920686176652031303021');
 "I have 100!"
 */
function hexToAscii(hex) {}

/**
 * Returns the HEX representation of a given UTF-8 string.
 *
 * @param {string} str - A UTF-8 string to convert to a HEX string.
 * @return {string} The HEX string
 *
 * @example
 > confluxWeb.utils.utf8ToHex('I have 100€');
 "0x49206861766520313030e282ac"
 */
function utf8ToHex(str) {}

/**
 * Returns the HEX representation of a given ASCII string.
 *
 * > NOTE: it behaves differently from 1.2.1
 *
 * @param {string} str - A ASCII string to convert to a HEX string.
 * @return {string} The HEX string
 *
 * @example
 > confluxWeb.utils.asciiToHex('I have 100!');
 "0x4920686176652031303021"
 */
function asciiToHex(str) {}

/**
 * Returns a byte array from the given HEX string.
 *
 * > NOTE: it behaves differently from 1.2.1
 *
 * @param {string} hex - A HEX to convert.
 * @return {array} The byte array.
 *
 * @example
 > confluxWeb.utils.hexToBytes('0x000000ea');
 [ 0, 0, 0, 234 ]

 > confluxWeb.utils.hexToBytes(0x000000ea);
 [ 234 ]
 */
function hexToBytes(hex) {}

/**
 * Returns a HEX string from a byte array.
 *
 * @param {array} byteArray - A byte array to convert.
 * @return {string} The HEX string
 *
 * @example
 > confluxWeb.utils.bytesToHex([ 72, 101, 108, 108, 111, 33, 36 ]);
 "0x48656c6c6f2124"
 */
function bytesToHex(byteArray) {}

/**
 * Converts any cfx value value into drip.
 *
 * > NOTE: "drip" are the smallest conflux unit, and you should always make calculations in drip and convert only for display reasons.
 *
 * > NOTE: can not pass a Number, only string or BN are acceptable
 *
 * @param {string|BN} str - The value
 * @param {string} [unit="cfx"] - The cfx to convert from. Possible units are ['cfx', 'gdrip', 'drip']
 * @return {string|BN} If a number, or string is given it returns a number string, otherwise a BN.js instance.
 *
 * @example
 > confluxWeb.utils.toDrip('1');
 "1000000000000000000"

 > confluxWeb.utils.toDrip('1', 'cfx');
 "1000000000000000000"

 > confluxWeb.utils.toDrip('1', 'gdrip');
 "1000000000"

 > confluxWeb.utils.toDrip('1', 'drip');
 "1"
 */
function toDrip(str, unit) {}

/**
 * Converts any drip value into a cfx value.
 *
 * > NOTE: "drip" are the smallest conflux unit, and you should always make calculations in drip and convert only for display reasons.
 *
 * > NOTE: can not pass a Number, only string or BN are acceptable
 *
 * @param {string|BN} str - The value in drip
 * @param {string} [unit="cfx"] - The cfx to convert to. Possible units are ['cfx', 'gdrip', 'drip']
 * @return {string|BN} If a number, or string is given it returns a number string, otherwise a BN.js instance.
 *
 * @example
 > confluxWeb.utils.fromDrip('1');
 "0.000000000000000001"

 > confluxWeb.utils.fromDrip('1', 'cfx');
 "0.000000000000000001"

 > confluxWeb.utils.fromDrip('1', 'gdrip');
 "0.000000001"

 > confluxWeb.utils.fromDrip('1', 'gdrip');
 "1"
 */
function fromDrip(str, unit) {} // can not pass a Number, only string or BN are acceptable

/**
 * Adds a padding on the left of a string, Useful for adding paddings to HEX strings.
 *
 * @param {string} value - The string to add padding on the left.
 * @param {number} characterAmount - The number of characters the total string should have.
 * @param {string} [sign="0"] - The character sign to use.
 * @return {string} The padded string.
 *
 * @example
 > confluxWeb.utils.padLeft('0x3456ff', 20);
 "0x000000000000003456ff"

 > confluxWeb.utils.padLeft(0x3456ff, 20);
 "0x000000000000003456ff"

 > confluxWeb.utils.padLeft('Hello', 20, 'x');
 "xxxxxxxxxxxxxxxHello"
 */
function padLeft(value, characterAmount, sign) {}

/**
 * Adds a padding on the right of a string, Useful for adding paddings to HEX strings.
 *
 * @param {string} value - The string to add padding on the right.
 * @param {number} characterAmount - The number of characters the total string should have.
 * @param {string} [sign="0"] - The character sign to use.
 * @return {string} The padded string.
 *
 * @example
 > confluxWeb.utils.padRight('0x3456ff', 20);
 "0x3456ff00000000000000"

 > confluxWeb.utils.padRight(0x3456ff, 20);
 "0x3456ff00000000000000"

 > confluxWeb.utils.padRight('Hello', 20, 'x');
 "Helloxxxxxxxxxxxxxxx"
 */
function padRight(value, characterAmount, sign) {}

/**
 * Converts a negative numer into a two’s complement.
 *
 * @param {number|string|BigNumber} value - The number to convert.
 * @return {string} The converted hex string.
 *
 * @example
 > confluxWeb.utils.toTwosComplement('-1');
 "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"

 > confluxWeb.utils.toTwosComplement(-1);
 "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"

 > confluxWeb.utils.toTwosComplement('0x1');
 "0x0000000000000000000000000000000000000000000000000000000000000001"

 > confluxWeb.utils.toTwosComplement(-15);
 "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1"

 > confluxWeb.utils.toTwosComplement('-0x1');
 "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
 */
function toTwosComplement(value) {}
