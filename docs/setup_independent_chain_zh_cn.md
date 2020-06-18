---
id: independent_chain_zh_cn
title: 如何设置独立的conflux区块链
custom_edit_url: https://github.com/Conflux-Chain/conflux-doc/edit/master/docs/setup_independent_chain_zh_cn.md
keywords:
  - conflux
  - run
  - chain
  - independent
---
你也许想在单个节点的链上运行Conflux，以开发和测试智能合约。你可以将Conflux以独立链形式与多台机器协同运行。

## 运行单节点开发链

为了运行单节点Conflux链进行开发，您可以按照
以下步骤进行操作：

1. 获取可执行的Conflux二进制文件（使用预编译的二进制文件或从最新的源代码构建）。您可以参考文档[安装](https://conflux-chain.github.io/conflux-doc/install/)。

2. 创建一个目录并准备一个配置文件`development.toml`。可以复制目录中提供的`default.toml`文件并遵循指南[开始](https://conflux-chain.github.io/conflux-doc/get_started/)要求进行操作。

3. 将配置文件内的`bootnodes`参数设置为空（或注释该设置行）。

4. 设置配置文件内的参数`mode`值为"dev"。如果是从`default.toml`中拷贝的，应找到被注释的行并取消注释。

5. 设置配置文件内的参数`dev_block_interval_ms`为您想要的块生成时间间隔。在开发模式下，Conflux会在固定的时间间隔内自动生成一个区块。

6. 以`development.toml`为配置文件运行Conflux二进制文件。例如：

    ```bash
    $ ../target/release/conflux --config development.toml
    ``` 

## 运行多节点生产链

若想在生产模式下拥有包含多个节点的独立Conflux链，则需要保证你的节点可以连接到这个链上的其他节点，而不会连接到其他链上（比如我们的testnet）

为了实现这一目标，你应该设置自己的引导节点，并让其他节点连接到它。然后他们会使用我们的发现协议连接到其他节点。

您需要使用引导节点的IP地址、端口号和节点ID让其他节点进行接入。节点id是节点唯一的私钥对应的公钥，用于网络层识别。有一个指令，可以让bootnode自动生成私钥，并通过日志文件获取节点id。

## 一个简单的例子

1. 获取可执行的Conflux二进制文件（使用预编译的二进制文件或从最新的源代码构建）。您可以参考文档[安装](https://conflux-chain.github.io/conflux-doc/install/)。

2. 创建一个目录并为引导节点准备配置文件`bootnode.toml`(如果没有特殊设置，默认端口号为32323)，可以参考文档[开始](https://conflux-chain.github.io/conflux-doc/get_started/).

    确保配置文件`bootnode.toml`不包含`bootnode`字段且`network`日志记录级别至少为`debug`。

    ```bash
    $ mkdir run
    $ cd run
    # Put Conflux executable `conflux` and the configuration file `bootnode.toml` under `run`
    ```

    如果您是根据我们提供的`default.toml`进行编辑，您需要注释掉`bootnode`字段。否则该节点将连接到现有的Conflux网络。

3. 运行引导节点并根据控制台输出找到节点id编号。节点id的信息样式为`Self node id: $ID`其中`$ID`是0x前缀格式的引导节点编号。移除0x前缀你将会得到这个节点的id号码`$NODEID`，如果你错过了屏幕上输出的那一行内容，则可以使用查看日志文件的方案：

    ```bash
    grep "Self node id" log/conflux.log|awk '{print $9}'|tr -d '0x'
    ```

4. 现在我们拥有了引导节点的`$IP`、`$PORT$`以及`$NODEID`我们可以按格式`cfxnode://$NODEID@$IP:$PORT`获取引导节点的url地址并使用变量`$BOOTNODE_URL`表示它。

5. 通过在其他节点配置文件中设置`bootnodes="$BOOTNODE_URL"`启动节点。

需要注意的是，使用上面的指令，连接到引导节点的其他节点将暂时处于不可信状态（默认为3天），在我们的发现协议中不可信节点将不会被广播。因此，在其他节点晋升到受信任状态之前，网络结构将是一个以引导节点为中心的星形结构。您通过修改配置文件内的`node_table_promotion_timeout_s`来缩短该周期。

## 设置多个引导节点

你也可以在一开始就设置多个引导节点。但是，这不能简单地通过多次重复上文提到的引导节点设置步骤来完成。因为你需要在每一个引导节点启动前为其设置`bootnodes`。

实现这个目标的一个方法是启动这些引导节点，并立即停止它们。随手收集它们的节点id，设置它们的配置文件，最后全部重启。

另一个比较好的方法是分别生成他们的私钥，并手动设置`net_key`以启动节点。该步骤可通过目录`test`中提供的python测试框架完成。

```python
from conflux.utils import *

num_of_bootnodes=10
for _ in range(num_of_bootnodes):
    pri_key, pub_key = ec_random_keys()
    node_id = encode_hex(encode_int32(pub_key[0]) + encode_int32(pub_key[1]))
    print(encode_hex(pri_key), node_id)
```

然后你可以用生成的节点id来构造引导节点url url，并将私钥通过设置`net_key="$NET_KEY"`或使用命令行`--net-key $NET_KEY`传递参数的方式启动每一个节点。

## 设置创世账户

在生产环境中，你可以通过将`genesis_accounts`设置为格式如下的账户文件以初始化初始创世状态：

```
0f947e34fc907008968ec99baa1dbb677b927531="1000000000000"
ab4a32bca7500d94a2cc1f3150e12686c692c590="1000000000000"
```
其中，每一行都是一个账户，键为账户地址，值则时用字符串表示的Drip余额。需要注意的是，`genesis_accounts`在`mode`被设置为`test`或`dev`时不会生效。

如果`mode`被设置为`test`或`dev`，可以通过设置`genesis_secrets`来设置创世账户的私钥。每一行都是一个无0x前缀的账户私钥。账户的余额设置默认为`10000000000000000000000`。

