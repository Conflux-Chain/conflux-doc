/**
 * Generates an account object with private key and public key.
 *
 * > NOTE: compare to eth latest, we don’t have sign methods in the return account object
 *
 * @param [entropy] {string} - A random string to increase entropy. If given it should be at least 32 characters. If none is given a random string will be generated using randomHex.
 * @return {object} The account object.
 *
 * @example
 > confluxWeb.cfx.accounts.create();
 Account {
  address: '0xbaE14daA250D6BCE69E695217AE8B3ce1dfF7AAe',
  privateKey:
   '0xed66cd654e2d714445dd159801f7e8144d227715c1eb33865d44c056d8e23399',
  ...
 }
 */
function create(entropy) {}

/**
 * Creates an account object from a private key.
 *
 * > NOTE: compare to eth latest, we don’t have sign methods in the return account object
 *
 * @param privateKey {string} - The private key to convert.
 * @return {object} The account object.
 *
 * @example
 > confluxWeb.cfx.accounts.privateKeyToAccount('0xed66cd654e2d714445dd159801f7e8144d227715c1eb33865d44c056d8e23399');
 Account {
  address: '0xbaE14daA250D6BCE69E695217AE8B3ce1dfF7AAe',
  privateKey:
   '0xed66cd654e2d714445dd159801f7e8144d227715c1eb33865d44c056d8e23399',
  ...
 }
 */
function privateKeyToAccount(privateKey) {}

/**
 * Recovers the Conflux address which was used to sign the given RLP encoded transaction.
 *
 * @param rawTransaction {string} - The RLP encoded transaction.
 * @return {string} The Conflux address used to sign this transaction.
 *
 * @example
 > confluxWeb.cfx.accounts.recoverTransaction('0xf867800a825208941ead8630345121d19ee3604128e5dc54b36e8ea6880429d069189e00008001a01feaa7a3d6ae22c013b0987e8fa8e39ff1df1e6080c95d7d5e085e2cd9b02ff2a00451df58547f0e0ad36d06058cd0c8cfa4eb201b4d09255f56ba0d750e520a67');
 "0xbbd9E9bE525AB967e633BcDAEaC8bD5723ED4D6B"
 */
function recoverTransaction(rawTransaction) {}

/**
 *
 * @param message {string} - A message to hash, if its HEX it will be UTF8 decoded before.
 * @return {string} The hashed message
 *
 * @example
 > confluxWeb.cfx.accounts.hashMessage("Hello World");
 "0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2"

 > confluxWeb.cfx.accounts.hashMessage(confluxWeb.cfx.utf8ToHex("Hello World")); // the below results in the same hash
 "0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2"
 */
function hashMessage(message) {}

/**
 * Signs arbitrary data. This data is before UTF-8 HEX decoded and enveloped as follows:
 * `"\x19Ethereum Signed Message:\n" + message.length + message`
 *
 * @param data {string} - The data to sign.
 * @param privateKey {string} - The private key to sign with.
 * @return {object}
 *
 * @example
 > confluxWeb.cfx.accounts.sign('Hello World', 'a816a06117e572ca7ae2f786a046d2bc478051d0717bf5cc4f5397923258d393');
 {
  "message": "Hello World",
  "messageHash": "0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2",
  "v": "0x1b",
  "r": "0x14e05a1ff41165dc420414e96acd7710a49ff05eecbd2caf520ac8d2e37426b0",
  "s": "0x4236443a89cd5a5d14559bc5c115988b704d40dea7e39ed087ae80cd7822f99c",
  "signature": "0x14e05a1ff41165dc420414e96acd7710a49ff05eecbd2caf520ac8d2e37426b04236443a89cd5a5d14559bc5c115988b704d40dea7e39ed087ae80cd7822f99c1b"
 }
 */
function sign(data, privateKey) {}

/**
 * Recovers the Conflux address which was used to sign the given data.
 *
 * > confluxWeb.cfx.accounts.recover(message, signature [, preFixed]);
 *
 * > confluxWeb.cfx.accounts.recover(message, v, r, s [, preFixed]);
 *
 * > confluxWeb.cfx.accounts.recover(signatureObject);
 *
 * @param message {string}
 * @param signature {string} - The raw RLP encoded signature, OR parameter 2-4 as v, r, s values.
 * @param r {string} - First 32 bytes of the signature
 * @param s {string} - Next 32 bytes of the signature
 * @param v {string} - Recovery value
 * @param [preFixed=false] {boolean} - If the last parameter is true, the given message will NOT automatically be prefixed with "\x19Ethereum Signed Message:\n" + message.length + message, and assumed to be already prefixed.
 *
 * @param signatureObject {object}
 * @param signatureObject.messageHash {string} The hash of the given message already prefixed with "\x19Ethereum Signed Message:\n" + message.length + message.
 * @param signatureObject.r {string} same as `r`
 * @param signatureObject.s {string} same as `s`
 * @param signatureObject.v {string} same as `v`
 *
 * @return {string} The Conflux address used to sign this data.
 *
 * @example
 > confluxWeb.cfx.accounts.recover({
    messageHash: '0x1da44b586eb0729ff70a73c326926f6ed5a25f5b056e7f47fbc6e58d86871655',
    v: '0x1',
    r: '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd',
    s: '0x6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a029'
 })
 "0x2c7536E3605D9C16a7a3D7b1898e529396a65c23"

 > confluxWeb.cfx.accounts.recover('Some data', '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a02901'); // message, signature
 "0x2c7536E3605D9C16a7a3D7b1898e529396a65c23"

 > confluxWeb.cfx.accounts.recover('Some data', '0x01', '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd', '0x6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a029'); // message, v, r, s
 "0x2c7536E3605D9C16a7a3D7b1898e529396a65c23"
 */
function recover() {}
