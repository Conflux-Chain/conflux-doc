# Rigorous Testing Tools for Conflux

Ensuring the correctness of a blockchain system like Conflux is a challenging
task. The Conflux Rust implementation repository comes with several rigorous
testing tools and scripts.

Note that in some terminals, the default maximum number of open file
descriptors may not be enough. This is especially true if you are using Mac
with its default zsh terminal. You will need to change the limit to a larger
number as follows:

```bash
$ ulimit -n 22288
```

## Unit Tests and Integration Tests

Unit tests come together with the rust code. It can be invoked via `cargo test
--release --all` after Conflux being complied from the source code. See the
[Getting Started](https://conflux-chain.github.io/conflux-doc/get_started/)
page for more information. Integration tests are python test scripts ended with
`_test.py` in the `tests/scripts` directory. After compiled the *release*
version of the Conflux from code. One can run `tests/test_all.py` to run all
integration tests together. These tests are executed routinely for every commit
to the Conflux Rust implementation. 

## Consensus Fuzzing Tool

Inside the directory `core/benchmark/consensus/test`, there is a random fuzzing
tool for the consensus component. It works as follows.
`core/benchmark/consensus/test/gen-random-graph.cpp` is a slow C++
implementation of the Conflux TreeGraph consensus algorithm together with a
random graph generator that generates random TreeGraph blocks in a special
format. `consensus_bench` is capable of processing this input format, run the
Conflux consensus, and compare the results with the slow C++ implementation.
`iter-gen-random.py` is a python script that iteratively invoke the
generation-processing-comparing process. To run this fuzzing tool:

```bash
$ cd core/benchmark/consensus/test
$ g++ -O2 -o gen-random-graph gen-random-graph.cpp
$ ./iter-gen-random.py 10000 3 30 10 10 100
```

The python script will not stop until it finds an error or you manually
terminate it. If the python script finds an error, the `rand.in` file will
correspond to the bug triggering input for the `consensus_bench` program. The
six parameters passed to the python scripts corresponds to the number of
randomly generated block per test case, the
`TIMER_CHAIN_BLOCK_DIFFICULTY_RATIO` parameter, the `TIMER_CHAIN_BETA`
parameter, the `ADAPTIVE_WEIGHT_BETA` parameter, the
`HEAVY_BLOCK_DIFFICULTY_RATIO` parameter, the `ERA_EPOCH_COUNT` parameter,
respectively. You can pass any legitimate consensus parameter to the python
script. These numbers are default that we empirically find them useful for
detecting bugs.

The python script will also print out the processing speed of the consensus
graph in the test. The expected speed is ~1000 blocks per second (on a Mac Book
Pro 2019 laptop). If the reported speed is significantly lower than expected,
it typically means a potential performance issue. For every release, we execute
this fuzzing for at least one hour using the default parameters.

Note that if you terminate this script brutally (which you will like do). It
leaves two to three temporary directories with the `__` prefix and `sqlite_db`.
You should remove these directories manually.

## Random Tracing Test

`tests/conflux_tracing.py` is a random testing script with the failure
injection capability. It will start a Conflux network with a fixed number of
nodes and inject node crashes, db crashes, and node restarts during. During the
running, it keep fetches states from different node and verify that these nodes
have the consensus for the TreeGraph and block state. To run Conflux tracing,
you need to first compile the release version of the Conflux Rust implementation
from the source code. Then you can invoke the script as follows:

```bash
$ tests/conflux_tracing.py run
```

The python script will then start 10 different instances together with a mock
instance. It will run non-stop until it finds an error (inconsistent state or
unexpected crash). For every release, we execute this tracing script for at
least one hour. 

In case of errors, it will generate trace files `snapshot*.json` and
`txs*.json` to help diagnose the issue. Note that if you terminate this script
brutally (which you will likely do). It also generates these files so you may
want to clean them manually.

## Transaction Propagation and Performance Test

`tests/scripts/one_click.sh` together with the remaining bash scripts in the
same directory provide an automatic deployment of Conflux network on AWS for
testing the simple payment TPS and transaction pool performance. You can run
this test as follows:

1. First you need to download and install AWS CLI tools. Properly configure the
AWS credential for the CLI tool.

2. Make your default public key registered as a named key pair in *the us-west-2 region*.

3. Decide the branch of the Conflux repo you want to test. Note that this
script pulls the source code from a GitHub repo that contains the Conflux rust
implementation and compile them on the fly. You cannot run your local Conflux
copy with this script. If you do not specify the repo/branch name, it will pull
from the official Conflux-rust repo from the GitHub.

4. Run the following command:

```bash
$ cd tests/scripts
$ ./one_click.sh key-pair-name 20 branch-name [repo-name]
```

This will start 20 instances at the us-west-2 region together with a random
transaction generator. It will take roughly 15 minutes to setup the experiments
and then 20 minutes to finish the run. In the end, it will report the TPS
performance. The expected good TPS number is ~4000TPS. If you get a TPS number
much lower than the expectation, there is a performance regression at the
transaction pool or at the storage layer. For every release, we run this script
to test its performance.
