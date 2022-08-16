### cfx_openedMethodGroups

Return fullnode's opened RPC method groups

#### Added at

`v2.0.0`

#### Parameters

None

#### Returns

Method prefix array

#### Example

```shell
curl --location --request POST 'http://localhost:12537' \
--header 'Content-Type: application/json' \
--data-raw ' {
    "jsonrpc": "2.0",
    "id": "15922956697249514502",
    "method": "cfx_openedMethodGroups",
    "params": []
  }'
```

```json
{
    "jsonrpc": "2.0",
    "result": ["cfx", "txpool", "pos", "trace", "pubsub"],
    "id": "15922956697249514502"
}
```
