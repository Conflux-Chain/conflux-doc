---
id: installation_zh_cn
title: 安装
custom_edit_url: https://github.com/Conflux-Chain/conflux-doc/edit/master/docs/install_zh_cn.md
keywords:
  - conflux
  - install
---
##  安装构建依赖项

下面是一个关于如何从源代码构建Conflux并使节点运行的指南。


安装构建依赖项
Conflux需要**Rust1.42.0**、`clang`和`sqlite`来构建。

我们建议在通过 [rustup](https://www.rustup.rs/)安装Rust。如果您还没有rustup或clang，可以这样安装：

* Linux:

        $ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
        $ rustup install 1.42.0

    其他依赖项，包括`clang`、`cmake（版本>=3.1）`和`sqlite（版本>=3.8.3）`，可这样以安装：


    - Ubuntu 18.04:

             $ sudo apt-get install clang libsqlite3-dev pkg-config libssl-dev cmake
    
    - CentOS 7 / RHEL:

          $ sudo yum install epel-release
          $ sudo yum install clang gcc gcc-c++ openssl-devel cmake3 wget
        
          # This may fail if you have installed cmake with version 2.8. 
          # You can choose to uninstall cmake first.
          $ sudo ln -s /usr/bin/cmake3 /usr/bin/cmake
        
          # The official sqlite version on CentOS 7 is 3.7.17, so we need to    
            install the latest version from the source code.
          # The source code have be downloaded from 
            https://www.sqlite.org/download.html
          $ wget https://www.sqlite.org/2020/sqlite-autoconf-3320100.tar.gz
          $ tar xfvz sqlite-autoconf-3320100.tar.gz
          $ cd sqlite-autoconf-3320100
          $ ./configure
          $ make
          $ sudo make install
  
 * OSX:

        $ curl https://sh.rustup.rs -sSf | sh
        $ rustup install 1.42.0

    如果需要使用它来安装clang，您可能需要安装brew；

          $ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

    clang带有Xcode命令行工具，也可以与自制程序一起安装：

        $ brew install llvm    
  
* Windows:

    确保您安装了支持C++的2015版VisualStudio。然后，从网址 https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-msvc/rustup-init.exe. 下载并运行`rustup`安装文件， 启动“VS2015 x64 Native Tools Command Prompt”， 并使用以下命令安装和设置msvc工具链：

        $ rustup default stable-x86_64-pc-windows-msvc

    `clang`可以与LLVM一起安装。预构建的二进制文件可以从[Download LLVM](https://releases.llvm.org/download.html#8.0.0)下载。确保按照说明将LLVM添加到系统路径。

确保这些二进制文件位于您的路径中（安装rustup后将显示该指令）。之后，您应该能够从源代码构建Conflux。

## 从源代码构建
安装完上述依赖项后，现在可以克隆存储库并开始构建可执行二进制文件：

```bash
#下载conflux代码
$ git clone https://github.com/Conflux-Chain/conflux-rust
$ cd conflux-rust
$ git checkout v0.5.0.4

# build in release mode
$ cargo build --release
```
这将在`./target/release`子目录中生成一个可执行文件。

注意，当编译文件时，你会收到错误提示，在大多数情况下，这是因为你的rust版本过时。或者你的文件必须重新编译。如果您使用的是最新稳定版本的Rust，那么清理存存储空间很可能会解决此问题，请尝试：

    $ cargo clean && cargo update

要开始运行Conflux 全节点，可以按照运行Conflux 全节点的说明进行操作。

安装测试依赖项

我们有一个用Python3编写的测试框架（版本>=3.6）。所需要的内容可以通过运行如下命令安装

    $ ./dev-support/dep_pip3.sh

Solidity编译器solc也是必需的，安装方法如下：

* Ubuntu

      sudo add-apt-repository ppa:ethereum/ethereum
      sudo apt-get update
      sudo apt-get install solc
* OSX

      brew update
      brew upgrade
      brew tap ethereum/ethereum
      brew install solidity
* 其他

    您可以按照[安装Solidity编译器](https://solidity.readthedocs.io/en/v0.5.7/installing-solidity.html#binary-packages)的详细说明进行操作。

    请注意，最新的solidity编译器可能与Conflux不兼容，并可能导致集成测试失败。如果遇到此问题，请安装solidity编译器0.5.2版。

运行测试前，可以先生成源代码，然后按照运行测试时的说明进行操作。
