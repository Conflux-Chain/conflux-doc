# Installation

Here is a step by step guide on how to build Conflux from the source code and get a node running.

## Install Build Dependencies

Conflux requires **latest stable Rust version** and `clang` to build.

We recommend installing Rust through [rustup](https://www.rustup.rs/). If you don't already have `rustup` or `clang`, you can install them like this:

* Linux:

        $ curl https://sh.rustup.rs -sSf | sh
    `clang` can be installed with:

    - Ubuntu:

            $ sudo apt-get install clang
    
    - CentOS / RHEL: 

            $ sudo yum install clang

* OSX:

        $ curl https://sh.rustup.rs -sSf | sh

    You might need to install `brew` if you need to use it to install `clang`:

        $ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    
    `clang` comes with Xcode command line tools, and can also be installed with homebrew:
    
        $ brew install --with-clang llvm    

* Windows:

    Make sure you have Visual Studio 2015 with C++ support installed. Next, download and run the `rustup` installer from https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-msvc/rustup-init.exe, start "VS2015 x64 Native Tools Command Prompt", and use the following command to install and set up the `msvc` toolchain:

        $ rustup default stable-x86_64-pc-windows-msvc

    `clang` can be installed with LLVM. Pre-built binaries can be downloaded from [Download LLVM](https://releases.llvm.org/download.html#8.0.0). Make sure to add LLVM to the system PATH as instructed.

Make sure that these binaries are in your `PATH` (the instruction will be shown after installing `rustup`). After that, you should be able to build Conflux from source.

## Build from Source Code
After installing the dependencies mentioned above, now you can clone our repository and start building the executable binary:

```bash
# download Conflux code
$ git clone https://github.com/Conflux-Chain/conflux-rust
$ cd conflux-rust
$ git checkout v0.1.0


# build in release mode
$ cargo build --release
```

This produces an executable in the `./target/release` subdirectory.

Note, when compiling a crate and you receive errors, it's in most cases your outdated version of Rust, or some of your crates have to be recompiled. Cleaning the repository will most likely solve the issue if you are on the latest stable version of Rust, try:

```bash
$ cargo clean && cargo update
```

To start running a Conflux full node, you can follow the instructions at [Running Conflux Full Node](get_started.md#running-conflux-full-node).

## Install Test Dependencies

We have a test framework written in Python3 (version>=3.6). Required packages can be installed by running
```bash
$ ./dev-support/dep_pip3.sh
```

Solidity compiler `solc` is also required, and be installed as follows:

* Ubuntu

        sudo add-apt-repository ppa:ethereum/ethereum
        sudo apt-get update
        sudo apt-get install solc

* OSX

        brew update
        brew upgrade
        brew tap ethereum/ethereum
        brew install solidity

* Others

    You can follow the detailed instructions at [Installing the Solidity Compiler](https://solidity.readthedocs.io/en/v0.5.7/installing-solidity.html#binary-packages).

    Note that latest solidity compiler may be incompatible with Conflux and may cause the integration test to fail. If you encounter such problem, please install solidity compiler version 0.5.2.

To run tests, you can build the source code first and follow the instructions at [Running Test](get_started.md#running-test).

