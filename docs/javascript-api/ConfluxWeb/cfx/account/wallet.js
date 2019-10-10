/**
 * Generates one or more accounts in the wallet. If wallets already exist they will not be overridden.
 *
 * @param numberOfAccounts {number} - Number of accounts to create. Leave empty to create an empty wallet.
 * @param [entropy] {string} - A string with random characters as additional entropy when generating accounts. If given it should be at least 32 characters.
 * @return {object} The wallet object
 *
 * @example
 > confluxWeb.cfx.accounts.wallet.create(2);
 Wallet {
   ...
   accounts: {
     '0':
      Account {
        address: '0x52B2a035bbC4263D46a327376195e86dbaAF0b42',
        privateKey:
         '0x9887b79bd08ac7ee5897a24c50ee366450edd706cd8cec637cbb91234638d6bb',
        accounts: [Accounts] },
     '1':
      Account {
        address: '0x52B2a035bbC4263D46a327376195e86dbaAF0b42',
        privateKey:
         '0x9887b79bd08ac7ee5897a24c50ee366450edd706cd8cec637cbb91234638d6bb',
        accounts: [Accounts] },
   },
   ...
 }
 */
function create(numberOfAccounts, entropy) {}

/**
 * Adds an account using a private key or account object to the wallet.
 *
 * @param account {string|object} - A private key or account object created with confluxWeb.cfx.accounts.create().
 * @return {object} The added account
 *
 * @example
 > confluxWeb.cfx.accounts.wallet.add('a816a06117e572ca7ae2f786a046d2bc478051d0717bf5cc4f5397923258d393');
 Account {
  address: '0x4060E99f892E052dF9F59126D3F1eF2240A5df97',
  privateKey:
   'a816a06117e572ca7ae2f786a046d2bc478051d0717bf5cc4f5397923258d393',
  ...
 }
 */
function add(account) {}

/**
 * Removes an account from the wallet.
 *
 * @param address {string|number} - The account address, or index in the wallet.
 * @return {boolean} true if the wallet was removed. false if it couldn’t be found.
 *
 * @example
 > confluxWeb.cfx.accounts.wallet.remove('0xbbd9e9be525ab967e633bcdaeac8bd5723ed4d6b');
 true

 > confluxWeb.cfx.accounts.wallet.remove(0);
 true
 */
function remove(address) {}

/**
 * Securely empties the wallet and removes all its accounts.
 *
 * @return {Object} The wallet object.
 * @example
 > confluxWeb.cfx.accounts.wallet.clear();
 Wallet {
   accounts: {},
   accountsIndex: 0
   ...
 }
 */
function clear() {}
