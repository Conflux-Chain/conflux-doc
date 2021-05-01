# Block Synchronization

This describes the p2p message exchanges to synchronize blocks among all nodes. It two different mechanisms for new nodes catching up old blocks and normal nodes synchronizing new blocks, but some message types are shared. 

We will first introduce how the two mechanisms work if everything goes well, and later discuss how we defend against possible active attacks or network failures.

## Assumptions

Every node is connected to several peers. 

A request will eventually be received and responded by some peers. The process of requests will be discussed in another documentation.

## New block propagation in normal cases

When a new block is mined, the block is broadcast to ALL peers (unless throttled) with `NewBlockHashes(block_hashes)`.

On receiving `NewBlockHashes`, the node checks if it has already received all these block headers (*by checking both the database and sync graph*). If not, the node will request the missing block headers by sending back `GetBlockHeaders(block_hashes)`.

On receiving `GetBlockHeaders`, the node will load the headers from its local database and return a `GetBlockHeadersResponse(headers)` to the sender.

On receiving `GetBlockHeadersResponse`, the node will first verify the headers (PoW, timestamp), and then insert the not-received-before headers into the sync graph if. For all the new valid headers, we will request their block bodies. In normal cases, the *compact block* mechanism is enabled and we will request with `GetCompactBlocks(hashes)`. For all received headers, we will request the headers of their dependents (parent and referees) with `GetBlockHeaders`. We will also broadcast `NewBlockHashes` for the headers that become `BLOCK_HEADER_GRAPH_READY` because of the insertion of these new headers.

On receiving `GetCompactBlocks`, the node will try to load the corresponding compact blocks from the database. If the compact blocks for some requested hashes are missing, the node will then try to load the full block instead. The loaded compact blocks and full blocks will be included in a `GetCompactBlocksResponse` for responding. Note that the node will not try to build a new compact block on receiving `GetCompactBlocks`.

On receiving `GetCompactBlocksResponse`, the node will try to build the full block with the local transactions based on the received compact blocks. The built/received full blocks will be inserted into sync graph. If there are some transactions missing for a compact block, the node will send `GetBlockTxn(block_hash, index_skips)` to request the missing transactions.

On receiving `GetBlockTxn`, the node will try to load the full block and return requested transactions to the sender with `GetBlockTxnResponse(block_hash, block_txn)`.

On receiving `GetBlockTxnResponse`, the node will build the full block again and insert it into the sync graph. If the `GetBlockTxnResponse` is incorrect, the built full block will not pass transaction root validation. It's either because of a short hash collision or because of an adversarial peer. The node will first try to request the full block from the same peer with `GetBlocks(hashes)`.

On receiving `GetBlocks`, the node simply load the requested blocks and respond with `GetBlocksResponse`. If the sender requests too much blocks, we will only respond a partial result without overflowing the packet size limit.

On receiving `GetBlocksResponse`, the node will eventually insert the full block into the sync graph.

## Old block downloading for catching-up

When the `best_epoch` of a node is far behind its peers, either because it's a new node or because it is restarted after a long stop, it needs to download a large amount of blocks to catch up the latest blockchain state. If we start from the chain tip and rely on the dependency relations to retrieve the old blocks like in the normal cases, we'll only request several blocks at the same time, leaving the network resources under-utilized. And before we download all the blocks needed, there is a gap between downloaded blocks and our local latest state, so we are unable to process received blocks, leaving our local CPU resources also under-utilized. Therefore, we have designed a seperate mechanism to download blocks in an ascending order and in batches.

When the node starts, it starts from its local `best_epoch`, and request epoch hashes with `GetBlockHashesByEpoch(epochs)`. Each request contains at most `EPOCH_SYNC_BATCH_SIZE` epochs, and the gap between the furthest request epoch and the local `best_epoch` is limited to `EPOCH_SYNC_MAX_GAP`.

On receiving `GetBlockHashesByEpoch`, the node will load the epoch set of the requested epoch numbers, and respond with `GetBlockHashesResponse(hashes)`. The response does not maintain the relation between the requested epoch numbers and the responded block hashes.

On receiving `GetBlockHashesResponse`, the node will request the block headers of the received block hashes by sending `GetBlockHeaders`. The following procedure will be similar to the one in normal cases that we have described above, but the compact block mechanism will not be enabled in catching-up phases. Thus, on receiving `GetBlockHeadersResponse`, the node will request full blocks with `GetBlocks` directly.

