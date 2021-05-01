# Request Management

Most of our p2p messages are transmitted as Request/Response pairs (like `GetBlockHeaders` and `GetBlockHeadersResponse`). Here we will introduce how we match a response with its request, and how we handle request retransmission/timeout.

## Request Id

Each request/response has a `request_id`, and the node sending a response of a request should use the same request id, so the requester can match the response with the correct request and handle it accordingly. 

The request id is maintained per peer session. The value is randomly initialized after the session is established, and it is increased by one for each new request. 

## Inflight Requests Management

The number of inflight requests (a sent request whose response has not been received) per session is limited by `max_inflight_request_count` to avoid network congestion. If the upper layer sent more quests than this limit, some requests will be cached in `pending_requests` and sent after some responses are received or some requests timeout. 

The inflight requests of a session are stored in `inflight_requests`. If a response with the same `request_id` is received in time, the request is removed from `inflight_requests` and returned. Otherwise, if no response is received before the request timeouts, the request wil be removed and resent to another peer.

To avoid requesting the same data redundantly, each request is also tied with a `Key` representing the unique identifier of the requested data. For a block, the key is its hash. For an epoch set, the key is the epoch number. And a global `inflight_keys` tracks if the resource is right being requested. Each time we try to request a resource, we will check and update `inflight_keys` atomically. If it's not in `inflight_keys` , it will be inserted. If another request has already been in flight, the request operation will return without sending duplicated requests.

After receiving a response, if the response include the correct requested data (note that the resources in a correct response may still be invalid), the corresponding `Key`  will be removed from `inflight_keys`, and we rely on the upper layer application logic to avoid requesting the same data again. If the response does not include all the requested data, we will request the missing data again. The `Key`  of these missing data in the request will be removed first, so these request can be successfully sent and they will update `inflight_keys` again.

## Request Timeout and Retransmission

As we have mentioned, a request should be resent if no response is received. Each request is associated with a `timeout_time` timestamp indicating when the request should timeout, and `requests_queue` tracks the inflight requests among all sessions. We will check the request timeout periodically and update `inflight_requests` and `inflight_keys` for timeout requests as discussed. For each peer, we also track the number of timeout requests in a recent period of time. If the requests sent to a peer frequently timeout, we will disconnect it.

The type of the resent request is determined by the return value of `resend()` and may not be the same as the original request type. For example, if a `GetCompactBlock` request timeouts, a `GetBlocks` request is resent instead, because an honest node with the latest data should be able to respond with a full block but may be unable to respond with a compact block.

If a request should be resent because of timeout or because the response does not include the requested data, it is not resent directly, but stored in `waiting_requests` with a delay time. Note that when a request is in `waiting_requests`, its still regarded as already sent in `inflight_keys` to avoid sending duplicate requests. The periodical invoking of `resend_waiting_requests` resends the requests whose delay time has elapsed. And the delay is increased each time the request should be resent after failure (the initial value and the increasement are both `REQUEST_START_WAITING_TIME` for now). If a request fails too many times (the delay time reaches a threshold `DEFAULT_REQUEST_DELAY_UPPER_BOUND`), it will be removed without resending, so the system resources wasted on requesting non-existent data will be limited. Permanently removing a request violates the simple assumption that each request will eventually succeed, so they are explicitly returned by `resend_waiting_requests` and should be handled by the upper layer. For example, if a block request is removed, we should remove all its future blocks from our sync graph. (TODO: Explain why)

Another benefit of not resending failed requests directly is that the same type of requests can be batched. Most of our request message types allow requesting multiple resources at the same time. `resend_waiting_requests` will try to batch several requests  into a single one if their resending types are the same and their delays are close. The delay of the new request, which may be used if the new request fails again, is the average of all batched requests.

## Requests Throttling

We have limited the number of inflight requests per session, but this is not enough. After we receive a response, we still need system resources to process this response, and sending requests too fast may make the node overloaded when the responses are received. Especially, received blocks are cached and processed asynchronously. If we request blocks too fast, cached blocks may consume a lot of memory and cause OOM errors.

To keep the workload of response processing under control, we also limit the number of inflight block requests according to an estimation of the processing cost based on recent received responses (the estimation is returned by `recover_public_queue.estimated_available_count()`. If there have already been enough inflight block requests, new requests will be inserted into `waiting_requests` to be sent later, and the limit is also checked again when we want to resend requests in `waiting_requests`. 

Note that requests in `waiting_requests` still have its `Key` inserted in `inflight_keys`, so `inflight_keys` of block-related request types cannot accurately reflect the number of actually sent requests. Thus, the number of inflight blocks is tracked in `inflight_keys` with a special message ID `msgid::NET_INFLIGHT_BLOCKS`. It is updated for `GetBlocks`, `GetCompactBlocks`, and `GetBlockTxn` accordingly.

