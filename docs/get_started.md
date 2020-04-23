---
id: get_started
title: Getting Started
custom_edit_url: https://github.com/Conflux-Chain/conflux-doc/edit/master/docs/get_started.md
keywords:
  - conflux
  - started
  - running
  - full node
---

Here we walk through how to quickly setup conflux full node to join the testnet and how to use Conflux wallet to manage your account, transfer Conflux token, and deploy smart contract.

## Running Conflux Full Node

First, please build the binary as instructed in [Installation](install.md#Install).

To start Conflux manually, you need to edit the default configuration file `run/default.toml`:

* Set `public_address` according to your public IP. The port should be 32323 by default.
* Set `mining_author` to the account address to receive mining reward.
* Conflux team has maintained some full nodes for the test net, and they have been provided as `bootnodes`. If you want to use other nodes to bootstrap your new node, you should edit this entry.

Then you can run the following commands:

```bash
$ cd run
$ ../target/release/conflux --config default.toml
```

It will start a full node and begin syncing the Conflux testnet blockchain. 

Note that two new directories (`blockchain_db` and `net_config`) will be created in the current working directory ( `run` ) to keep the persistent data. Please do not remove them unless data are corrupt or you want to start a fresh new node.

To restart a node, just run the same command line in the same directory.

## Configuring Conflux Full Node

Conflux can be configured using either the CLI options or a config file. Should the CLI flags and the config file disagree about a setting, the CLI takes precedence.  

The config file follows the format of [TOML](https://github.com/toml-lang/toml). The path of the configuration file can be set with the CLI option `--config path/to/conflux.toml`. A default configuration file `default.toml` with every configuration explained has been provided in the directory `run`, and you can start customizing your configuration from there.

You can list all CLI options by running  `$ ./conflux --help`. The vast majority of CLI options map to a setting in the TOML file, for example `--public-address 127.0.0.1:32323` can be set by creating a config file:

```toml
public_address="127.0.0.1:32323"
```

If you are going to set up a node and let it join the Conflux mainnet(testnet), you need to set the `public_address` appropriately. It should be set as the IP address of your node which can be accessed publicly from Internet. If your node is covered under a public gateway, you can get its public address by searching "ip" in [Baidu](https://www.baidu.com).

If you want to let your node participate the mining process, you need to enable it by setting `start_mining` as "true" and `mining_author` as the account address that receives the mining reward. 

## Running Test

We have both unit tests written in Rust and integration tests written in python. After you make some modifications to the code, you can run these tests to see if the system still runs correctly.

First, you need to install the dependencies as instructed in [Install Test Dependencies](install.md#install-test-dependencies).

Then you can run the tests as follows

* Linux:

        $ ./dev-support/test.sh

    This will automatically run the unit tests in our Rust code and the python tests.

* Others:

    To run unit tests in Rust:

        $ cargo test --release --all

    To run python integration tests:

        $ ./tests/test_all.py

    

## Using Conflux Web Wallet

You can access [Conflux web wallet](https://wallet.confluxscan.io) and 
create a new wallet by clicking "New Wallet" button that provides you a seed phrase 
(used to restore your wallet if you close it) and a password (used to unlock your wallet if you lock it 
when you leave your computer). Once a wallet is created, you can then manage your account addresses,
send transactions, and deploy smart contract.

In order to issue on-chain operations, you will need Conflux tokens. 
You can periodically (1 Conflux token per hour) get Conflux tokens from a faucet account.
A pop-up box will appear to inform you to get the tokens.  

For developers to build smart contract, you can use [remix](https://remix.ethereum.org) to write and compile your
contract to generate bytecode which you can then copy-paste to "Contract" page of the wallet
that is triggered by action "Contract".
