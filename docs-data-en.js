// DEXLESS API Documentation Data - English

const docsDataEN = {
  "introduction": {
    title: "Introduction",
    content: `# DEXLESS API Documentation

Welcome to the DEXLESS API documentation. We provide two interfaces for communicating with DEXLESS.

## RESTful API Interface

Provides functionality for sending events such as creating orders, canceling orders, fetching balances, etc.

## WebSocket Interface

Provides real-time orderbook data feed and order update feed.

## Base Endpoints

**Mainnet**: \`https://api.orderly.org/\`

**Testnet**: \`https://testnet-api.orderly.org\`

## General Information on REST Endpoints

- For \`GET\` and \`DELETE\` endpoints, parameters must be sent as a \`query string\`.
- For \`POST\` and \`PUT\` endpoints, the parameters must be sent in the \`request body\` with content type \`application/json\`.
- Parameters may be sent in any order.

## Authorization

All our private interfaces require signing via cryptographically secure keys for authentication, also known as Orderly key. Please set the corresponding header in your request. Please refer to [API Authentication](#rest-api-authentication) for more information.

## Symbol

DEXLESS uses the format of \`PERP_<SYMBOL>_USDC\` to represent a symbol name, for example: \`PERP_ETH_USDC\`.

## Rate Limit

Rate limit is counted using the Orderly key. If your application reached the rate limit of certain endpoint, the server will return an error result with HTTP code \`429\`. You may need wait until next time horizon.

## Error Message

> **Errors consist of three parts: an error code, detailed message and a success flag.**

\`\`\`json
{
  "success": false,
  "code": -1005,
  "message": "order_price must be a positive number"
}
\`\`\`

All API will return following json when api fails, the "message" will contain the detail error message, it may be because some data are in wrong format, or other reasons. Specific error codes and messages are defined in [Error Codes](#rest-error-codes).`
  },

  "rest-api-authentication": {
    title: "API Authentication",
    content: `# API Authentication

All requests need to be signed using orderly-key and orderly-secret.

## Generate Request Signature

DEXLESS uses the ed25519 elliptic curve standard for request authentication via signature verification. The necessary steps in order to send a valid request to DEXLESS are provided below.

### 1. Orderly Account ID

Before being able to authenticate, you must first register your account and get your account ID. You need to add your account ID to the request header as \`orderly-account-id\`.

### 2. Access Key (Orderly key)

Your Orderly public key needs to be added to the request header as \`orderly-key\`.

### 3. Timestamp

Take the timestamp of the request in milliseconds and add it as \`orderly-timestamp\` to the request header.

### 4. Normalize Request Content

The message that you need to sign with your Orderly private key needs to be normalized to a string via this method:

1. Get current timestamp in milliseconds, e.g. \`1649920583000\`
2. Append HTTP method in uppercase, e.g. \`POST\`
3. Append path of request including query parameters (without base URL), e.g. \`/v1/orders?symbol=PERP_BTC_USDC\`
4. (optional) If request has method body, JSON stringify this and append it

The resulting string could look like following:

\`\`\`
1649920583000POST/v1/order{"symbol": "PERP_ETH_USDC", "order_type": "LIMIT", "order_price": 1521.03, "order_quantity": 2.11, "side": "BUY"}
\`\`\`

### 5. Generate a Signature

Use the normalized request content to generate a signature using the ed25519 algorithm, and encode the signature in base64 url-safe format. Add the result to the request headers as \`orderly-signature\`.

### 6. Content Type

Add Content-Type header. All GET and DELETE requests use \`application/x-www-form-urlencoded\`. Any other method type uses \`application/json\`.

### 7. Send the Request

The final request should have following headers:

\`\`\`
Content-Type, orderly-account-id, orderly-key, orderly-signature, orderly-timestamp
\`\`\`

> **Note**: Orderly key should be used without the \`ed25519:\` prefix when used in code samples below.

## Security

There is a three-layer checker to verify a request is valid. DEXLESS server only accepts the request that passes all checks.

### Request Timestamp

The request would be considered expired and get rejected if the timestamp in orderly-timestamp header has 300+ seconds difference from the API server time.

### HMAC Parameter Signature

The request must have a orderly-signature header that is generated from request parameters and signed with your Orderly secret key.

### Orderly Key Validity Check

The request must have an orderly-key header, and the orderly-key has to be added to the network via the Add Key functionality, matched with the account and is still valid (not expired yet).`
  },

  "rest-error-codes": {
    title: "Error Codes",
    content: `# Error Codes

| Error Code | Status Code | Description |
|-----------|------------|-------------|
| -1000 | 500 | An unknown error occurred while processing the request. |
| -1000 | 500 | The data does not exist. |
| -1001 | 401 | The api key or secret is in wrong format. |
| -1002 | 401 | API key or secret is invalid, it may be because key have insufficient permission or the key is expired/revoked. |
| -1003 | 429 | Rate limit exceed. |
| -1004 | 400 | An unknown parameter was sent. |
| -1005 | 400 | Some parameters are in wrong format for api. |
| -1005 | 400 | ratio_qty_request should be in range 0-1. |
| -1005 | 400 | extra_liquidation_ratio should be in range 0-1. |
| -1005 | 400 | if you set extra_liquidation_ratio > 0, ratio_qty_request must be 1. |
| -1006 | 400 | The data is not found in server. For example, when client try canceling a CANCELLED order, will raise this error. |
| -1007 | 409 | The data is already exists or your request is duplicated. |
| -1008 | 400 | The quantity of settlement is too high than you can request. |
| -1009 | 400 | Can not request withdrawal settlement, you need to deposit other arrears first. |
| -1011 | 400 | Can not place/cancel orders, it may be because internal network error. Please try again in a few seconds. |
| -1012 | 400 | The place/cancel order request is rejected by internal module, it may because the account is in liquidation or other internal errors. Please try again in a few seconds. |
| -1012 | 400 | Another liquidation is in process. |
| -1101 | 400 | The risk exposure for client is too high, it may cause by sending too big order or the leverage is too low. please refer to client info to check the current exposure. |
| -1101 | 400 | The margin will be insufficient after. |
| -1102 | 400 | The order value (price * size) is too small. |
| -1103 | 400 | Order price is below the minimum allowed price {quote_min}. |
| -1103 | 400 | Order price exceeds the maximum allowed price {quote_max}. |
| -1103 | 400 | Order price does not match the tick size. |
| -1104 | 400 | Order quantity is below the minimum allowed amount {base_min}. |
| -1104 | 400 | Order quantity exceeds the maximum allowed amount {base_max}. |
| -1104 | 400 | Order quantity does not match the step size. |
| -1104 | 400 | Visible quantity does not match the step size. |
| -1105 | 400 | Price is X% too high or X% too low from the mid price. |
| -1201 | 400 | total notional < 10000, least req ratio should = 1 |
| -1201 | 400 | least req ratio should = xxxx |
| -1202 | 400 | No need to liquidation because user margin is enough. |
| -1202 | 400 | Can not find given liquidationId. |`
  },

  "rest-create-order": {
    title: "Create Order",
    content: `# Create Order

> **Limit: 10 requests per 1 second**

<div class="api-endpoint">
  <span class="badge badge-post method">POST</span>
  <span class="path">/v1/order</span>
</div>

Place order maker/taker, the order executed information will be update from websocket stream. Will response immediately with an order created message.

## Order Type Behaviors

### MARKET Order
It matches until the full size is executed. If the size is too large (larger than whole book) or the matching price exceeds the price limit (refer to \`price_range\`), then the remaining quantity will be cancelled.

### IOC Order
It matches as much as possible at the order_price. If not fully executed, then remaining quantity will be cancelled.

### FOK Order
If the order can be fully executed at the order_price then the order gets fully executed otherwise would be cancelled without any execution.

### POST_ONLY Order
If the order will be executed with any maker trades at the time of placement, then it will be cancelled without any execution.

### ASK Order
The order price is guaranteed to be the best ask price of the orderbook at the time it gets accepted.

### BID Order
The order price is guaranteed to be the best bid price of the orderbook at the time it gets accepted.

## Parameter Behaviors

### visible_quantity
It sets the maximum quantity to be shown on orderbook. By default, it is equal to order_quantity, negative number and number larger than \`order_quantity\` is not allowed. If it sets to 0, the order would be hidden from the orderbook. It doesn't work for \`MARKET\`/\`IOC\`/\`FOK\` orders since orders with these types would be executed and cancelled immediately and not be shown on orderbook.

### order_quantity
The precision of the number should be within 8 digits.

### client_order_id
Customized order_id, a unique id among open orders. Orders with the same \`client_order_id\` can be accepted only when the previous one if completed, otherwise the order will be rejected.

> **Note**: This endpoint requires \`trading\` scope in Orderly Key.

## Request Headers (Required for Authentication)

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| orderly-timestamp | string | Yes | Millisecond timestamp |
| orderly-account-id | string | Yes | Account ID |
| orderly-key | string | Yes | Orderly API Key |
| orderly-signature | string | Yes | Ed25519 signature (Base64 encoded) |

## Request Headers (Optional)

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| x-recv-window | number | No | Controls the timeout threshold for placing order, unit in milliseconds (e.g., 20) |

## Request Parameters (Request Body)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair, e.g. PERP_ETH_USDC |
| client_order_id | string | No | 36 length, accepts hyphen but cannot be the first character, default: null |
| order_type | string | Yes | \`LIMIT\`/\`MARKET\`/\`IOC\`/\`FOK\`/\`POST_ONLY\`/\`ASK\`/\`BID\` |
| order_price | number | Conditional | If order_type is MARKET/ASK/BID, then is not required, otherwise this parameter is required |
| order_quantity | number | Conditional | Order quantity |
| order_amount | number | Conditional | For MARKET/ASK/BID order, the order size in terms of quote currency |
| visible_quantity | number | No | Order quantity shown on orderbook (default: equal to order_quantity) |
| side | string | Yes | \`SELL\`/\`BUY\` |
| reduce_only | boolean | No | Default false |
| slippage | number | No | MARKET orders beyond this slippage will not be executed |
| order_tag | string | No | Order tag |
| level | number | No | Integer value from 0 to 4. Controls whether to present the price of bid0-bid4 or ask0-ask4. Only allowed when \`order_type\` is \`BID\` or \`ASK\` |
| post_only_adjust | boolean | No | If set to true, then price will be adjusted to 1 tick close to current best price. Only supported for \`POST_ONLY\` type orders |

## Request Body Example

\`\`\`json
{
  "symbol": "PERP_ETH_USDC",
  "order_type": "LIMIT",
  "order_price": 1521.03,
  "order_quantity": 2.11,
  "side": "BUY"
}
\`\`\`

## Response Example

\`\`\`json
{
  "success": true,
  "timestamp": 1702989203989,
  "data": {
    "order_id": 13,
    "client_order_id": "testclientid",
    "order_type": "LIMIT",
    "order_price": 100.12,
    "order_quantity": 0.987654,
    "error_message": "none"
  }
}
\`\`\``
  },

  "rest-cancel-order": {
    title: "Cancel Order",
    content: `# Cancel Order

> **Limit: 10 requests per 1 second**

<div class="api-endpoint">
  <span class="badge badge-delete method">DELETE</span>
  <span class="path">/v1/order?order_id={order_id}&symbol={symbol}</span>
</div>

Cancels a single order by \`order_id\`.

> **Note**: This endpoint requires \`trading\` scope in Orderly Key.

## Request Headers (Required for Authentication)

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| orderly-timestamp | string | Yes | Millisecond timestamp |
| orderly-account-id | string | Yes | Account ID |
| orderly-key | string | Yes | Orderly API Key (e.g., \`ed25519:...\`) |
| orderly-signature | string | Yes | Ed25519 signature (Base64 encoded) |

## Request Parameters (Query String)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair |
| order_id | number | Yes | Order ID |

## Response Example

\`\`\`json
{
  "success": true,
  "timestamp": 1702989203989,
  "data": {
    "status": "CANCEL_SENT"
  }
}
\`\`\``
  },

  "rest-edit-order": {
    title: "Edit Order",
    content: `# Edit Order

> **Limit: 10 requests per 1 second**

<div class="api-endpoint">
  <span class="badge badge-put method">PUT</span>
  <span class="path">/v1/order</span>
</div>

Edit a pending order by \`order_id\`. Only the \`order_price\` or \`order_quantity\` can be amended.

> **Note**: This endpoint requires \`trading\` scope in Orderly Key.

## Request Headers (Required for Authentication)

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| orderly-timestamp | string | Yes | Millisecond timestamp |
| orderly-account-id | string | Yes | Account ID |
| orderly-key | string | Yes | Orderly API Key |
| orderly-signature | string | Yes | Ed25519 signature (Base64 encoded) |

## Request Parameters (Request Body)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| order_id | string | Yes | Order ID |
| symbol | string | Yes | Trading pair |
| client_order_id | string | No | Client order ID |
| order_type | string | Yes | Order type |
| order_price | number | No | New order price |
| order_quantity | number | No | New order quantity |
| order_amount | number | No | Order amount |
| side | string | Yes | \`SELL\`/\`BUY\` |
| reduce_only | boolean | No | Default false |
| visible_quantity | number | No | Visible quantity |
| order_tag | string | No | Order tag |

## Request Body Example

\`\`\`json
{
  "order_id": "12345",
  "symbol": "PERP_ETH_USDC",
  "order_type": "LIMIT",
  "side": "BUY",
  "order_price": 1520.00,
  "order_quantity": 3.0
}
\`\`\`

## Response Example

\`\`\`json
{
  "success": true,
  "timestamp": 1702989203989,
  "data": {
    "status": "EDIT_SENT"
  }
}
\`\`\``
  },

  "rest-batch-create-order": {
    title: "Batch Create Order",
    content: `# Batch Create Order

> **Limit: 1 request per 1 second**

<div class="api-endpoint">
  <span class="badge badge-post method">POST</span>
  <span class="path">/v1/batch-order</span>
</div>

Creates a batch of orders as a list according to the same rules as a single Create Order.

Parameters for each order within the batch will be the same as the create single order. The batch of orders should be sent as a JSON array containing all the orders. The maximum number of orders that can be sent in 1 batch order request is 10. Each order within the batch order request is counted as 1 order towards the overall create order rate limit.

> **Note**: This endpoint requires \`trading\` scope in Orderly Key.

## Request Headers (Required for Authentication)

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| orderly-timestamp | string | Yes | Millisecond timestamp |
| orderly-account-id | string | Yes | Account ID |
| orderly-key | string | Yes | Orderly API Key |
| orderly-signature | string | Yes | Ed25519 signature (Base64 encoded) |

## Request Headers (Optional)

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| x-recv-window | number | No | Controls the timeout threshold for placing order, unit in milliseconds |

## Request Body Structure

The request body should be a JSON object with an \`orders\` array. Each order object contains the same parameters as the Create Order endpoint.

## Request Body Example

\`\`\`json
{
  "orders": [
    {
      "symbol": "PERP_ETH_USDC",
      "order_type": "LIMIT",
      "order_price": 1521.03,
      "order_quantity": 2.11,
      "side": "BUY"
    },
    {
      "symbol": "PERP_BTC_USDC",
      "order_type": "LIMIT",
      "order_price": 45000.50,
      "order_quantity": 0.5,
      "side": "SELL"
    }
  ]
}
\`\`\`

## Response Example

\`\`\`json
{
  "success": true,
  "timestamp": 1702989203989,
  "data": {
    "rows": [
      {
        "order_id": 13,
        "client_order_id": "testclientid1",
        "order_type": "LIMIT",
        "order_price": 100.12,
        "order_quantity": 0.987654,
        "error_message": "none"
      }
    ]
  }
}
\`\`\``
  },

  "rest-create-algo-order": {
    title: "Create Algo Order",
    content: `# Create Algo Order

> **Limit: 1 request per 1 second**

<div class="api-endpoint">
  <span class="badge badge-post method">POST</span>
  <span class="path">/v1/algo/order</span>
</div>

Place maker/taker order that requires an additional trigger for order execution such as stop orders.

## Algo Order Types

\`STOP\` type order behavior: an order to buy or sell at the market/limit price once the asset has traded at or through a specified price (the "stop price"). If the asset reaches the stop price, the order becomes a market order and is filled at the next available market price.

To place \`Positional TP/SL\` order, the input fields is 2 layer and includes an array of the objects named childOrder. The take-profit or stop-loss order should be the objects in the array. For the sub-order in childOrder, please input \`CLOSE_POSITION\` as type, and \`TAKE_PROFIT\` or \`STOP_LOSS\` in algoType field.

To place \`Trailing Stop\` order, please use \`TRAILING_STOP\` as algoType and \`MARKET\` as type. Please also input your trailing rate setting in callbackRate field.

> **Note**: This endpoint requires \`trading\` scope in Orderly Key.

## Request Headers (Required for Authentication)

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| orderly-timestamp | string | Yes | Millisecond timestamp |
| orderly-account-id | string | Yes | Account ID |
| orderly-key | string | Yes | Orderly API Key |
| orderly-signature | string | Yes | Ed25519 signature (Base64 encoded) |

## Request Parameters (Request Body)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair |
| algo_type | string | Yes | \`STOP\`/\`TP_SL\`/\`POSITIONAL_TP_SL\`/\`BRACKET\`/\`BRACKET + TP_SL\`/\`TRAILING_STOP\` |
| client_order_id | string | No | 36 length, accepts hyphen but cannot be the first character, default: null |
| type | string | Conditional | \`LIMIT\` / \`MARKET\`, required if \`algo_type\` = \`STOP\` |
| price | number | No | Optional for \`TP_SL\` and \`POSTIONAL_TP_SL\` |
| quantity | number | Conditional | For \`MARKET\`/\`ASK\`/\`BID\` order, if order_amount is given, it is not required. Not required if type is \`POSITIONAL_TP_SL\` |
| trigger_price_type | string | No | Only \`MARK_PRICE\` is available for now |
| trigger_price | number | No | Trigger price |
| reduce_only | boolean | No | Default false |
| visible_quantity | number | No | Default false |
| side | string | Conditional | \`SELL\`/\`BUY\`, required if \`STOP\` type |
| order_tag | string | No | Order tag |
| child_orders | array | No | Array of child order objects for complex TP/SL orders |
| activatedPrice | string | No | Activated price for algoType=\`TRAILING_STOP\` |
| callbackRate | string | No | Callback rate, only for algoType=\`TRAILING_STOP\`, i.e. the value = 0.1 represent to 10% |
| callbackValue | string | No | Callback value, only for algoType=\`TRAILING_STOP\`, i.e. the value = 100 |

## Request Body Examples

### STOP Order

\`\`\`json
{
  "symbol": "PERP_ETH_USDC",
  "algo_type": "STOP",
  "type": "MARKET",
  "side": "BUY",
  "quantity": 1.5,
  "trigger_price": 1500.00,
  "trigger_price_type": "MARK_PRICE"
}
\`\`\`

### TRAILING_STOP Order

\`\`\`json
{
  "symbol": "PERP_BTC_USDC",
  "algo_type": "TRAILING_STOP",
  "type": "MARKET",
  "side": "SELL",
  "quantity": 0.1,
  "activatedPrice": "45000",
  "callbackRate": "0.05"
}
\`\`\`

## Response Example

\`\`\`json
{
  "success": true,
  "timestamp": 1702989203989,
  "data": {
    "order_id": 13,
    "client_order_id": "testclientid",
    "algo_type": "STOP",
    "quantity": 100.12
  }
}
\`\`\``
  },

  "rest-cancel-algo-order": {
    title: "Cancel Algo Order",
    content: `# Cancel Algo Order

> **Limit: 5 requests per 1 second**

<div class="api-endpoint">
  <span class="badge badge-delete method">DELETE</span>
  <span class="path">/v1/algo/order?order_id={order_id}&symbol={symbol}</span>
</div>

Cancels a single algo order by \`order_id\`.

> **Note**: This endpoint requires \`trading\` scope in Orderly Key.

## Request Headers (Required for Authentication)

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| orderly-timestamp | string | Yes | Millisecond timestamp |
| orderly-account-id | string | Yes | Account ID |
| orderly-key | string | Yes | Orderly API Key |
| orderly-signature | string | Yes | Ed25519 signature (Base64 encoded) |

## Request Parameters (Query String)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair |
| order_id | number | Yes | Algo order ID |

## Response Example

\`\`\`json
{
  "success": true,
  "timestamp": 1702989203989,
  "data": {
    "status": "CANCEL_SENT"
  }
}
\`\`\``
  },

  "rest-edit-algo-order": {
    title: "Edit Algo Order",
    content: `# Edit Algo Order

> **Limit: 5 requests per 1 second**

<div class="api-endpoint">
  <span class="badge badge-put method">PUT</span>
  <span class="path">/v1/algo/order</span>
</div>

Edit a pending algo order by \`order_id\`. Only the price or quantity can be amended.

> **Note**: This endpoint requires \`trading\` scope in Orderly Key.

## Request Headers (Required for Authentication)

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| orderly-timestamp | string | Yes | Millisecond timestamp |
| orderly-account-id | string | Yes | Account ID |
| orderly-key | string | Yes | Orderly API Key |
| orderly-signature | string | Yes | Ed25519 signature (Base64 encoded) |

## Request Parameters (Request Body)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| order_id | string | Yes | Algo order ID |
| price | number | No | New price |
| quantity | number | No | New order quantity |
| trigger_price | number | No | New trigger price |
| trigger_price_type | string | No | Trigger price type |
| child_orders | array | No | Array of child order objects |

## Response Example

\`\`\`json
{
  "success": true,
  "timestamp": 1702989203989,
  "data": {
    "status": "EDIT_SENT"
  }
}
\`\`\``
  },

  "rest-get-all-positions-info": {
    title: "Get All Positions Info",
    content: `# Get All Positions Info

> **Limit: 30 requests per 10 second per user**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/positions</span>
</div>

Get detailed information of all current positions including margin ratios, collateral values, and individual position details.

> **Note**: This endpoint requires \`read\` scope in Orderly Key.

## Request Parameters

This endpoint does not require any query parameters or request body. Only authentication headers are required.

### Required Headers

| Header | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| orderly-timestamp | string | Yes | Millisecond timestamp | \`1649920583000\` |
| orderly-account-id | string | Yes | Account ID | \`0x...\` |
| orderly-key | string | Yes | Orderly API Key | \`ed25519:...\` |
| orderly-signature | string | Yes | Ed25519 signature | Base64 encoded |

## Response Fields

### Account Level Fields

| Field | Type | Description |
|-------|------|-------------|
| current_margin_ratio_with_orders | number | Current margin ratio including open orders |
| free_collateral | number | Available collateral for new positions |
| initial_margin_ratio | number | Initial margin ratio for existing positions |
| initial_margin_ratio_with_orders | number | Initial margin ratio including open orders |
| maintenance_margin_ratio | number | Maintenance margin ratio for existing positions |
| maintenance_margin_ratio_with_orders | number | Maintenance margin ratio including open orders |
| margin_ratio | number | Current margin ratio |
| open_margin_ratio | number | Margin ratio for open positions |
| total_collateral_value | number | Total collateral value in USDC |
| total_pnl_24_h | number | Total PnL in last 24 hours |

### Position Level Fields (rows array)

| Field | Type | Description |
|-------|------|-------------|
| symbol | string | Trading pair symbol |
| position_qty | number | Current position quantity (negative for short) |
| cost_position | number | Total cost of the position |
| average_open_price | number | Average entry price |
| unsettled_pnl | number | Unrealized PnL |
| settle_price | number | Settlement price |
| mark_price | number | Current mark price |
| est_liq_price | number | Estimated liquidation price |
| last_sum_unitary_funding | number | Cumulative funding payment |
| pending_long_qty | number | Pending long quantity from open orders |
| pending_short_qty | number | Pending short quantity from open orders |
| fee_24_h | number | Trading fees in last 24 hours |
| pnl_24_h | number | PnL in last 24 hours |
| imr | number | Initial Margin Ratio |
| mmr | number | Maintenance Margin Ratio |
| IMR_withdraw_orders | number | IMR including pending orders |
| MMR_with_orders | number | MMR including pending orders |
| leverage | number | Current leverage setting |
| seq | number | Sequence number for ordering |
| timestamp | number | Position creation timestamp |
| updated_time | number | Last update timestamp |

## Response Example

\`\`\`json
{
  "success": true,
  "timestamp": 1702989203989,
  "data": {
    "current_margin_ratio_with_orders": 1.2385,
    "free_collateral": 450315.09115,
    "initial_margin_ratio": 0.1,
    "initial_margin_ratio_with_orders": 0.1,
    "maintenance_margin_ratio": 0.05,
    "maintenance_margin_ratio_with_orders": 0.05,
    "margin_ratio": 1.2385,
    "open_margin_ratio": 1.2102,
    "total_collateral_value": 489865.71329,
    "total_pnl_24_h": 0,
    "rows": [
      {
        "symbol": "PERP_BTC_USDC",
        "position_qty": -5,
        "cost_position": -139329.358492,
        "average_open_price": 27908.14386047,
        "unsettled_pnl": 354.858492,
        "settle_price": 27865.8716984,
        "mark_price": 27794.9,
        "est_liq_price": 117335.92899428,
        "last_sum_unitary_funding": 70.38,
        "pending_long_qty": 0,
        "pending_short_qty": 0,
        "fee_24_h": 0,
        "pnl_24_h": 0,
        "imr": 0.1,
        "mmr": 0.05,
        "IMR_withdraw_orders": 0.1,
        "MMR_with_orders": 0.05,
        "leverage": 10,
        "seq": 1730181536341943600,
        "timestamp": 1685429350571,
        "updated_time": 1685429350571
      }
    ]
  }
}
\`\`\``
  },

  "rest-get-position-history": {
    title: "Get Position History",
    content: `# Get Position History

> **Limit: 10 requests per 1 second per user**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/position_history</span>
</div>

Get position history.

> **Note**: This endpoint requires \`read\` scope in Orderly Key.

## Request Headers (Required for Authentication)

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| orderly-timestamp | string | Yes | Millisecond timestamp |
| orderly-account-id | string | Yes | Account ID |
| orderly-key | string | Yes | Orderly API Key |
| orderly-signature | string | Yes | Ed25519 signature (Base64 encoded) |

## Request Parameters (Query String)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | No | Trading pair |
| limit | number | No | Number of records to return |

## Response Example

\`\`\`json
{
  "success": true,
  "data": {
    "rows": [
      {
        "position_id": 1,
        "status": "closed",
        "type": "liquidated",
        "symbol": "PERP_ETH_USDC",
        "avg_open_price": 61016.1,
        "avg_close_price": 61016.1,
        "max_position_qty": 56.6,
        "closed_position_qty": 56.6,
        "side": "LONG",
        "trading_fee": 0.015,
        "accumulated_funding_fee": 0.11,
        "insurance_fund_fee": 0,
        "liquidator_fee": 0,
        "liquidation_id": null,
        "realized_pnl": -9.09691927314905,
        "open_timestamp": 1685429350571,
        "close_timestamp": 1685429350571,
        "last_update_timestamp": 1685429350571,
        "leverage": 10
      }
    ]
  }
}
\`\`\``
  },

  "rest-get-leverage-setting": {
    title: "Get Leverage Setting",
    content: `# Get Leverage Setting

> **Limit: 1 requests per 1 second per IP address**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/client/leverage</span>
</div>

Get account's leverage setting for a specific symbol.

> **Note**: This endpoint requires \`read\` scope in Orderly Key.

## Request Headers (Required for Authentication)

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| orderly-timestamp | string | Yes | Millisecond timestamp |
| orderly-account-id | string | Yes | Account ID |
| orderly-key | string | Yes | Orderly API Key |
| orderly-signature | string | Yes | Ed25519 signature (Base64 encoded) |

## Request Parameters (Query String)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair, e.g. PERP_BTC_USDC |

## Response Example

\`\`\`json
{
  "success": true,
  "data": {
    "symbol": "PERP_BTC_USDC",
    "leverage": 10
  }
}
\`\`\``
  },

  "rest-update-leverage-setting": {
    title: "Update Leverage Setting",
    content: `# Update Leverage Setting

> **Limit: 5 requests per 60 second per user**

<div class="api-endpoint">
  <span class="badge badge-post method">POST</span>
  <span class="path">/v1/client/leverage</span>
</div>

Allow users to customize leverage for each symbol or choose maximum leverage for account's futures mode.

## Validation Logic

1. Check the leverage range is eligible

2. Check if the position notional under the updated leverage is acceptable
   - \`max_notional = (1 / (symbol_leverage * imr_factor)) ^ (1/0.8)\`
   - \`symbol_leverage_max = round down to int → min(1 / (imr_factor * notional ^ 0.8), 1/base_imr)\`

3. Check if the margin is enough

> **Note**: This endpoint requires \`trading\` scope in Orderly Key.

## Request Headers (Required for Authentication)

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| orderly-timestamp | string | Yes | Millisecond timestamp |
| orderly-account-id | string | Yes | Account ID |
| orderly-key | string | Yes | Orderly API Key |
| orderly-signature | string | Yes | Ed25519 signature (Base64 encoded) |

## Request Parameters (Request Body)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| leverage | number | Yes | Integer between 1 to 50 |
| symbol | string | No | Specific trading pair, if not provided updates account-level leverage |

## Response Example

\`\`\`json
{
  "success": true,
  "timestamp": 1702989203989,
  "data": {
    "symbol": "PERP_BTC_USDC",
    "leverage": 10
  }
}
\`\`\``
  },

  "rest-get-available-symbols": {
    title: "Get Available Symbols",
    content: `# Get Available Symbols

> **Limit: 10 requests per 1 second per IP address**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/public/info</span>
</div>

Get available symbols that DEXLESS supports, and also send order rules for each symbol.

## Request Parameters

This is a public endpoint and does not require any request parameters or authentication.

## Response Example

\`\`\`json
{
  "success": true,
  "data": {
    "rows": [
      {
        "symbol": "PERP_BTC_USDC",
        "quote_min": 0,
        "quote_max": 100000,
        "quote_tick": 0.1,
        "base_min": 0.00001,
        "base_max": 20,
        "base_tick": 0.00001,
        "min_notional": 1,
        "price_range": 0.02,
        "price_scope": 0.4,
        "std_liquidation_fee": 0.03,
        "liquidator_fee": 0.015,
        "claim_insurance_fund_discount": 0.0075,
        "funding_period": 8,
        "cap_funding": 0.000375,
        "floor_funding": -0.000375,
        "cap_ir": 0.0003,
        "floor_ir": -0.0003,
        "interest_rate": 0.0001,
        "imr_factor": 0.025,
        "base_mmr": 0.05,
        "base_imr": 0.1,
        "created_time": 1684140107326,
        "updated_time": 1685345968053,
        "liquidation_tier": 1,
        "global_max_oi_cap": 11111
      }
    ]
  }
}
\`\`\``
  },

  "rest-get-predicted-funding-rates-for-all-markets": {
    title: "Get Predicted Funding Rates for All Markets",
    content: `# Get Predicted Funding Rates for All Markets

> **Limit: 10 requests per 1 second per IP address**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/public/funding_rates</span>
</div>

Get predicted funding rates for all futures trading pairs.

Get the:
- \`last_funding_rate\`: latest hourly funding rate for all the markets for the last funding period (dt = 8h)
- \`est_funding_rate\`: rolling average of all funding rates over the last 8 hours

## Request Parameters

This is a public endpoint and does not require any request parameters or authentication.

## Response Example

\`\`\`json
{
  "success": true,
  "data": {
    "rows": [
      {
        "symbol": "PERP_ETH_USDC",
        "est_funding_rate": 0,
        "est_funding_rate_timestamp": 1683880020000,
        "last_funding_rate": 0.0001,
        "last_funding_rate_timestamp": 1683878400000,
        "next_funding_time": 1683907200000,
        "sum_unitary_funding": 521.367
      }
    ]
  }
}
\`\`\``
  },

  "rest-get-predicted-funding-rate-for-one-market": {
    title: "Get Predicted Funding Rate for One Market",
    content: `# Get Predicted Funding Rate for One Market

> **Limit: 30 requests per 1 second per IP address**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/public/funding_rate/{symbol}</span>
</div>

Get latest funding rate for one market.

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair (in path), e.g. PERP_ETH_USDC |

## Response Example

\`\`\`json
{
  "success": true,
  "data": {
    "symbol": "PERP_ETH_USDC",
    "est_funding_rate": 0,
    "est_funding_rate_timestamp": 1683880020000,
    "last_funding_rate": 0.0001,
    "last_funding_rate_timestamp": 1683878400000,
    "next_funding_time": 1683907200000,
    "sum_unitary_funding": 521.367
  }
}
\`\`\``
  },

  "ws-introduction": {
    title: "WebSocket API Introduction",
    content: `# WebSocket API

## Market Data Base Endpoints

**Mainnet**: \`wss://ws-evm.orderly.org/ws/stream/{account_id}\`

**Testnet**: \`wss://testnet-ws-evm.orderly.org/ws/stream/{account_id}\`

\`{account_id}\` is your account id.

### Available Public Topics

Users can subscribe/unsubscribe to the following topics:

- Market Data: \`orderbook\`, \`orderbookupdate\`, \`trade\`, \`bbo\`, \`bbos\`
- Tickers: \`ticker\`, \`tickers\`
- Funding: \`estfundingrate\`
- Index & Mark: \`indexprice\`, \`indexprices\`, \`markprice\`, \`markprices\`
- Liquidation: \`liquidation\`
- Open Interest: \`openinterest\`
- Klines: \`kline_1m\`, \`kline_5m\`, \`kline_15m\`, \`kline_30m\`, \`kline_1h\`, \`kline_1d\`, \`kline_1w\`, \`kline_1M\`

## Private User Data Stream Base Endpoints

**Mainnet**: \`wss://ws-private-evm.orderly.org/v2/ws/private/stream/{account_id}\`

**Testnet**: \`wss://testnet-ws-private-evm.orderly.org/v2/ws/private/stream/{account_id}\`

\`{account_id}\` is your account id

Users need to be authenticated before subscribing to any topic. They would be disconnected if authentication fails. For more information, refer to the [Authentication](#ws-authentication) section.

### Available Private Topics

Users can subscribe/unsubscribe to the following topics:

- Account: \`account\`, \`balance\`, \`position\`, \`wallet\`
- Orders: \`executionreport\`
- Liquidations: \`liquidationsaccount\`, \`liquidatorliquidations\`
- Others: \`notifications\`, \`settle\``
  },

  "ws-authentication": {
    title: "WebSocket Authentication",
    content: `# WebSocket Authentication

Before subscribing to private data streams, users need to be authenticated. Refer to [API Authentication](#rest-api-authentication) for details about how to sign the request with \`orderly-key\` and \`orderly-secret\`.

The **request method, request path,** and **request body** are all blank. The message to sign is therefore just the **timestamp**.

## URL-based Authentication

WebSocket private connections can now authenticate when creating the connection by appending the content of auth request into the subscription URL in the form of query string.

For example:
\`\`\`
wss://ws-private-evm.orderly.org/v2/ws/private/stream/0xd7379678a303b57d7d43eb23c64dd7528ac8cb4efe983a3aedcfe9b4aa4cb984?orderly_key=xxxxxxxx&timestamp=xxxxx&sign=xxxxx
\`\`\`

This will authenticate the user when creating the connection, no need to send auth request again.

## Authentication Request

\`\`\`json
{
  "id": "123r",
  "event": "auth",
  "params": {
    "orderly_key": "ed25519:CUS69ZJOXwSV38xo...",
    "sign": "4180da84117fc9753b...",
    "timestamp": 1621910107900
  }
}
\`\`\`

## Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| orderly_key | string | Yes | Orderly Key |
| sign | string | Yes | Signature |
| timestamp | timestamp | Yes | Timestamp |

## Authentication Response

\`\`\`json
{
  "id": "123r",
  "event": "auth",
  "success": true,
  "ts": 1621910107315
}
\`\`\``
  },

  "ws-ping-pong": {
    title: "PING/PONG",
    content: `# PING/PONG

The server will send a ping command to the client every 10 seconds. If the pong from client is not received within 10 seconds for 10 consecutive times, it will actively disconnect the client.

The client can also send ping every 10s to keep alive.

## Ping Request

\`\`\`json
{
  "event": "ping"
}
\`\`\`

## Pong Response

\`\`\`json
{
  "event": "pong",
  "ts": 1614667590000
}
\`\`\``
  },

  "ws-error-response": {
    title: "Error Response",
    content: `# WebSocket Error Response

When a WebSocket request fails, the server will return an error response.

You can use the \`id\` field in response to map the error response with the request.

## Error Response Format

\`\`\`json
{
  "id": "clientID7",
  "event": "subscribe",
  "success": false,
  "ts": 1614141150601,
  "errorMsg": "invalid symbol SPOT_WOO_USDC.e"
}
\`\`\``
  },

  "ws-orderbook": {
    title: "Orderbook",
    content: `# Orderbook

\`{symbol}@orderbook\` depth 100 push every 1s

## Subscribe Request

\`\`\`json
{
  "id": "clientID2",
  "topic": "PERP_WOO_USDC@orderbook",
  "event": "subscribe"
}
\`\`\`

## Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | id generate by client |
| event | string | Yes | \`subscribe\`/\`unsubscribe\` |
| topic | string | Yes | \`{symbol}@orderbook\` |
| params.symbol | string | Yes | \`{symbol}\` |

## Subscribe Response

\`\`\`json
{
  "id": "clientID2",
  "event": "subscribe",
  "success": true,
  "ts": 1609924478533
}
\`\`\`

## Orderbook Data

\`\`\`json
{
  "topic": "PERP_WOO_USDC@orderbook",
  "ts": 1614152140945,
  "data": {
    "symbol": "PERP_WOO_USDC",
    "asks": [
      [0.31075, 2379.63],
      [0.31076, 4818.76],
      [0.31078, 8496.1]
    ],
    "bids": [
      [0.30891, 2469.98],
      [0.3089, 482.5],
      [0.30877, 20]
    ]
  }
}
\`\`\``
  },

  "ws-order-book-update": {
    title: "Order Book Update",
    content: `# Order Book Update

\`{symbol}@orderbookupdate\` updated orderbook push every 200ms

## Subscribe Request

\`\`\`json
{
  "id": "clientID2",
  "topic": "PERP_NEAR_USDC@orderbookupdate",
  "event": "subscribe"
}
\`\`\`

## Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | id generate by client |
| event | string | Yes | \`subscribe\`/\`unsubscribe\` |
| topic | string | Yes | \`{symbol}@orderbookupdate\` |

## Subscribe Response

\`\`\`json
{
  "id": "clientID2",
  "event": "subscribe",
  "success": true,
  "ts": 1609924478533
}
\`\`\`

## Update Data

\`\`\`json
{
  "topic": "PERP_NEAR_USDC@orderbookupdate",
  "ts": 1618826337580,
  "data": {
    "symbol": "PERP_NEAR_USDC",
    "prevTs": 1618826337380,
    "asks": [
      [15.15, 3.92864],
      [15.8, 0]
    ],
    "bids": [
      [14.2, 1.03895025],
      [13.6, 1.0807]
    ]
  }
}
\`\`\`

Order book updates provide incremental changes. If quantity is 0, it means that price level has been removed.`
  },

  "ws-trade": {
    title: "Trade",
    content: `# Trade

Push interval: Real-time push

## Subscribe Request

\`\`\`json
{
  "id": "clientID3",
  "topic": "PERP_WOO_USDC@trade",
  "event": "subscribe"
}
\`\`\`

## Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | id generate by client |
| event | string | Yes | \`subscribe\`/\`unsubscribe\` |
| topic | string | Yes | \`{symbol}@trade\` |

## Subscribe Response

\`\`\`json
{
  "id": "clientID3",
  "event": "subscribe",
  "success": true,
  "ts": 1609924478533
}
\`\`\`

## Trade Data

\`\`\`json
{
  "topic": "PERP_WOO_USDC@trade",
  "ts": 1618820361552,
  "data": {
    "symbol": "PERP_WOO_USDC",
    "price": 0.37988,
    "size": 300,
    "side": "BUY"
  }
}
\`\`\``
  },

  "ws-bbo": {
    title: "Best Bid Offer (BBO)",
    content: `# Best Bid Offer (BBO)

Push interval: 10ms

## Subscribe Request

\`\`\`json
{
  "id": "clientID5",
  "topic": "PERP_WOO_USDC@bbo",
  "event": "subscribe"
}
\`\`\`

## Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | id generate by client |
| event | string | Yes | \`subscribe\`/\`unsubscribe\` |
| topic | string | Yes | \`{symbol}@bbo\` |

## Subscribe Response

\`\`\`json
{
  "id": "clientID5",
  "event": "subscribe",
  "success": true,
  "ts": 1609924478533
}
\`\`\`

## BBO Data

\`\`\`json
{
  "topic": "PERP_WOO_USDC@bbo",
  "ts": 1614152296945,
  "data": {
    "symbol": "PERP_WOO_USDC",
    "ask": 0.30939,
    "askSize": 4508.53,
    "bid": 0.30776,
    "bidSize": 25246.14
  }
}
\`\`\``
  },

  "ws-bbos": {
    title: "All BBOs",
    content: `# All BBOs

Push interval: 1s

## Subscribe Request

\`\`\`json
{
  "id": "clientID5",
  "topic": "bbos",
  "event": "subscribe"
}
\`\`\`

## Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | id generate by client |
| event | string | Yes | \`subscribe\`/\`unsubscribe\` |
| topic | string | Yes | \`bbos\` |

## Subscribe Response

\`\`\`json
{
  "id": "clientID5",
  "event": "subscribe",
  "success": true,
  "ts": 1609924478533
}
\`\`\`

## BBOs Data

\`\`\`json
{
  "topic": "bbos",
  "ts": 1618822376000,
  "data": [
    {
      "symbol": "PERP_NEAR_USDC",
      "ask": 15.0318,
      "askSize": 370.43,
      "bid": 15.9158,
      "bidSize": 16
    },
    {
      "symbol": "PERP_WOO_USDC",
      "ask": 0.318,
      "askSize": 300.163881,
      "bid": 0.3179,
      "bidSize": 500.941728
    }
  ]
}
\`\`\``
  },

  "ws-request-orderbook": {
    title: "Request Orderbook",
    content: `# Request Orderbook

Request orderbook snapshot for a specific trading pair using the request/response pattern instead of subscription.

## Request

\`\`\`json
{
  "id": "clientID1",
  "event": "request",
  "params": {
    "type": "orderbook",
    "symbol": "PERP_NEAR_USDC"
  }
}
\`\`\`

## Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | id generated by client |
| event | string | Yes | \`request\` |
| params.type | string | Yes | \`orderbook\` |
| params.symbol | string | Yes | Trading pair symbol |

## Response

\`\`\`json
{
  "id": "123r",
  "event": "request",
  "success": true,
  "ts": 1618880432419,
  "data": {
    "symbol": "PERP_NEAR_USDC",
    "ts": 1618880432380,
    "asks": [
      [15, 0.443951],
      [15.02, 0.002566]
    ],
    "bids": [
      [14.99, 2.887466],
      [14.76, 2.034711]
    ]
  }
}
\`\`\``
  },

  "ws-account": {
    title: "Account",
    content: `# Account

Push interval: Real-time push

> **Note**: Requires [Authentication](#ws-authentication)

## Subscribe Request

\`\`\`json
{
  "id": "clientID3",
  "topic": "account",
  "event": "subscribe"
}
\`\`\`

## Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | id generate by client |
| event | string | Yes | \`subscribe\`/\`unsubscribe\` |
| topic | string | Yes | \`account\` |

## Subscribe Response

\`\`\`json
{
  "id": "clientID3",
  "event": "subscribe",
  "success": true,
  "ts": 1609924478533
}
\`\`\`

## Account Data

\`\`\`json
{
  "topic": "account",
  "ts": 1618820361552,
  "data": {
    "accountDetail": {
      "marginMode": "SPOT_FUTURES",
      "futuresLeverage": 10,
      "takerFeeRate": 10,
      "makerFeeRate": 10,
      "futuresTakerFeeRate": 8,
      "futuresMakerFeeRate": 4,
      "rwaFuturesTakerFeeRate": 13.0,
      "rwaFuturesMakerFeeRate": 12.0,
      "maintenanceCancelFlag": false,
      "symbolLeverage": {
        "leverage": 20,
        "symbol": "PERP_BTC_USDC"
      }
    }
  }
}
\`\`\``
  },

  "ws-balance": {
    title: "Balance",
    content: `# Balance

Push interval: Real-time push

> **Note**: Requires [Authentication](#ws-authentication)

## Subscribe Request

\`\`\`json
{
  "id": "clientID3",
  "topic": "balance",
  "event": "subscribe"
}
\`\`\`

## Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | id generate by client |
| event | string | Yes | \`subscribe\`/\`unsubscribe\` |
| topic | string | Yes | \`balance\` |

## Subscribe Response

\`\`\`json
{
  "id": "clientID3",
  "event": "subscribe",
  "success": true,
  "ts": 1609924478533
}
\`\`\`

## Balance Data

\`\`\`json
{
  "topic": "balance",
  "ts": 1651836695254,
  "data": {
    "balances": {
      "USDC": {
        "holding": 5555815.47398272,
        "frozen": 0,
        "interest": 0,
        "pendingShortQty": 0,
        "pendingExposure": 0,
        "pendingLongQty": 0,
        "pendingLongExposure": 0,
        "version": 894,
        "staked": 51370692,
        "unbonding": 0,
        "vault": 0,
        "averageOpenPrice": 0.00000574,
        "pnl24H": 0,
        "fee24H": 0.01914,
        "markPrice": 0.31885
      }
    }
  }
}
\`\`\``
  },

  "ws-position-push": {
    title: "Position Push",
    content: `# Position Push

Push interval: push on update

> **Note**: Requires [Authentication](#ws-authentication)

## Subscribe Request

\`\`\`json
{
  "id": "clientID3",
  "topic": "position",
  "event": "subscribe"
}
\`\`\`

## Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | id generate by client |
| event | string | Yes | \`subscribe\`/\`unsubscribe\` |
| topic | string | Yes | \`position\` |

## Subscribe Response

\`\`\`json
{
  "id": "clientID3",
  "event": "subscribe",
  "success": true,
  "ts": 1682244308139
}
\`\`\`

## Position Data

\`\`\`json
{
  "topic": "position",
  "ts": 1684926050966,
  "data": {
    "positions": [
      {
        "symbol": "PERP_ETH_USDC",
        "positionQty": 3.1408,
        "costPosition": 5706.51952,
        "lastSumUnitaryFunding": 0.804,
        "sumUnitaryFundingVersion": 0,
        "pendingLongQty": 0.0,
        "pendingShortQty": -1.0,
        "settlePrice": 1816.9,
        "averageOpenPrice": 1804.51490427,
        "unsettledPnl": -2.79856,
        "pnl24H": -338.90179488,
        "fee24H": 4.242423,
        "markPrice": 1816.2,
        "estLiqPrice": 0.0,
        "version": 179967,
        "imrwithOrders": 0.1,
        "mmrwithOrders": 0.05,
        "mmr": 0.05,
        "imr": 0.1,
        "seq": 1730181536341943600,
        "timestamp": 1685429350571,
        "updated_time": 1685429350571,
        "leverage": 10
      }
    ]
  }
}
\`\`\``
  },

  "ws-execution-report": {
    title: "Execution Report",
    content: `# Execution Report

Push interval: Real-time push

> **Note**: Requires [Authentication](#ws-authentication)

## Subscribe Request

\`\`\`json
{
  "id": "clientID3",
  "topic": "executionreport",
  "event": "subscribe",
  "params": {
    "symbol": "PERP_BTC_USDC,PERP_ETH_USDC"
  }
}
\`\`\`

## Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | id generate by client |
| event | string | Yes | \`subscribe\`/\`unsubscribe\` |
| topic | string | Yes | \`executionreport\` |
| params | object | No | Defaults to all symbols |
| params.symbol | string | No | Symbols, comma separated |

## Subscribe Response

\`\`\`json
{
  "id": "clientID3",
  "event": "subscribe",
  "success": true,
  "ts": 1609924478533
}
\`\`\`

## Execution Report Data

\`\`\`json
{
  "topic": "executionreport",
  "ts": 1704679472455,
  "data": {
    "symbol": "PERP_MATIC_USDC",
    "clientOrderId": "",
    "orderId": 292820969,
    "type": "LIMIT",
    "side": "BUY",
    "quantity": 7029.0,
    "price": 0.7699,
    "tradeId": 0,
    "executedPrice": 0.0,
    "executedQuantity": 0.0,
    "fee": 0.0,
    "feeAsset": "USDC",
    "totalExecutedQuantity": 0.0,
    "avgExecutedPrice": 0,
    "status": "NEW",
    "reason": "",
    "totalFee": 0.0,
    "visibleQuantity": 7029.0,
    "timestamp": 1704679472448,
    "maker": false,
    "match_id": "1707119522287540609",
    "seq": 1730181536341943600
  }
}
\`\`\``
  }
};
