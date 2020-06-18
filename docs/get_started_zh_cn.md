---
id: get_started_zh_cn
title: Getting Started
custom_edit_url: https://github.com/Conflux-Chain/conflux-doc/edit/master/docs/get_started_zh_cn.md
keywords:
  - conflux
  - started
  - running
  - full node
---

在本文中，我们将介绍如何快速设置conflux全节点加入testnet，以及如何使用Conflux钱包管理账户、转移Conflux代币以及部署智能合约。

## 运行Conflux全节点

首先，请按照[安装](install.md#Install)中的指导编译构建二进制文件。

如要手动启动Conflux，需要编辑默认的配置文件。 `run/default.toml`:

* 根据您的公共IP地址设置`public_address`，默认情况下端口应设置为32323。
* 将`mining_author`设置为接收挖矿奖励的账户地址。
* Conflux团队为测试网维护了一些全功能节点，它们以`bootnodes`的形式提供出来。 "bootnodes"。如果你想使用其他节点来引导您新创建的节点，您应当编辑该条目。

之后您就可以按如下命令执行:

```bash
$ cd run
$ ../target/release/conflux --config default.toml
```

这段代码会启动全节点并与Conflux区块链测试网同步。

值得一提的是，在当前工作目录( `run` ) 中会创建两个新目录 (`blockchain_db` 和 `net_config`) 以留存数据。除了数据损坏或您想启用一个全新的节点这两种例外情况，不要删除它们。

如若要重新启动一个节点，只要在相同的目录下运行相同的命令即可。

## 配置Conflux全节点

Conflux可以使用CLI选项或配置文件进行配置。如CLI标志和配置文件对某项设置存在差异，则优先以CLI选项为准。 

配置文件遵循[TOML](https://github.com/toml-lang/toml)格式。配置文件的路径可以通过CLI选项`--config path/to/conflux.toml`来设置。在 `run` 目录下还提供了一个默认配置文件 `default.toml`，其中包含了所有的配置选项，您可以从那里开始定制您的配置。

您可以通过运行`$ ./conflux --help`来列出所有CLI选项。绝大多数CLI选项都会对应到TOML文件内的设置，例如`--public-address 127.0.0.1:32323`可以通过创建一个配置文件来进行设置。

```toml
public_address="127.0.0.1:32323"
```

如果要设置一个节点并让它加入Conflux主网(testnet)，需要正确设置`public_address`。它应被设置为从互联网上公开访问你节点的IP地址。如果节点被覆盖于公共网关下，则可以通过在[百度](https://www.baidu.com)中搜索"ip"来获取公共地址。

如果想让节点参与到挖矿过程中去，你需要在设置`start_mining`为"true"以及`mining_author`为接收挖矿奖励的账户地址来启用它。

## 运行测试

我们提供了使用Rust编写的单元测试和用python编写的集成测试案例。这允许你在对代码进行部分修改后，通过运行这些测试检查系统是否还能正常运行。

首先，需要按照[安装测试依赖项](install.md#install-test-dependencies)的指引安装依赖项。

之后，您就可以运行一下测试。

* Linux:

        $ ./dev-support/test.sh

    这将自动运行Rust代码中的单元测试和python测试。

* Others:

    To run unit tests in Rust:

        $ cargo test --release --all

    运行python集成测试：

        $ ./tests/test_all.py

    

## 使用Conflux的网页端钱包

您可以访问 [Conflux web wallet](https://wallet.confluxscan.io)并点击"创建新钱包"按钮创建一个新钱包并向您提供了助记词（用于恢复钱包）及密码（如果在您离开电脑时锁定了钱包，可使用其进行解锁操作）。一旦钱包被创建，你就可以管理你的账户地址，发送交以及部署智能合约。

您需要使用Conflux代币以发起链上操作。
您可以定期（每小时1枚Conflux代币）从水龙头账户中获取Conflux代币。通过弹出一个通知提示框，告知您获取代币。

在开发者构建智能这一方面，可以使用[remix](https://remix.ethereum.org)撰写并编译您的合约以生成字节码，之后可以通过复制粘贴到钱包的"Contract"页面触发合约。