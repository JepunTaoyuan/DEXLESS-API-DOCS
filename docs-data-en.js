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
| -1001 | 401 | The api key or secret is in wrong format. |
| -1002 | 401 | API key or secret is invalid, it may be because key have insufficient permission or the key is expired/revoked. |
| -1003 | 429 | Rate limit exceed. |
| -1004 | 400 | An unknown parameter was sent. |
| -1005 | 400 | Some parameters are in wrong format for api. |
| -1006 | 400 | The data is not found in server. |
| -1007 | 409 | The data is already exists or your request is duplicated. |
| -1008 | 400 | The quantity of settlement is too high than you can request. |
| -1009 | 400 | Can not request withdrawal settlement, you need to deposit other arrears first. |
| -1011 | 400 | Can not place/cancel orders, it may be because internal network error. |
| -1012 | 400 | The place/cancel order request is rejected by internal module. |
| -1101 | 400 | The risk exposure for client is too high. |
| -1102 | 400 | The order value (price * size) is too small. |
| -1103 | 400 | Order price is below minimum or exceeds maximum allowed price or does not match tick size. |
| -1104 | 400 | Order quantity is below minimum or exceeds maximum allowed amount or does not match step size. |
| -1105 | 400 | Price is X% too high or X% too low from the mid price. |
| -1201 | 400 | Liquidation related error. |
| -1202 | 400 | No need to liquidation or can not find given liquidation ID. |`
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
Matches until the full size is executed. If the size is too large or the matching price exceeds the price limit, then the remaining quantity will be cancelled.

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

> **Note**: This endpoint requires \`trading\` scope in Orderly Key.

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair, e.g. PERP_ETH_USDC |
| client_order_id | string | No | Custom order ID, 36 length, default: null |
| order_type | string | Yes | \`LIMIT\`/\`MARKET\`/\`IOC\`/\`FOK\`/\`POST_ONLY\`/\`ASK\`/\`BID\` |
| order_price | number | Conditional | Required unless order_type is MARKET/ASK/BID |
| order_quantity | number | Conditional | Order quantity |
| order_amount | number | Conditional | For MARKET/ASK/BID order, the order size in terms of quote currency |
| visible_quantity | number | No | Order quantity shown on orderbook (default: equal to order_quantity) |
| side | string | Yes | \`SELL\`/\`BUY\` |
| reduce_only | boolean | No | Default false |
| slippage | number | No | MARKET orders beyond this slippage will not be executed |
| order_tag | string | No | Order tag |

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
    "order_quantity": 0.987654
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

## Request Parameters

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

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| order_id | string | Yes | Order ID |
| symbol | string | Yes | Trading pair |
| order_price | number | No | New order price |
| order_quantity | number | No | New order quantity |
| side | string | Yes | \`SELL\`/\`BUY\` |

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

> **Limit: 5 requests per 1 second**

<div class="api-endpoint">
  <span class="badge badge-post method">POST</span>
  <span class="path">/v1/batch-order</span>
</div>

Place multiple orders in one request. Maximum 10 orders per request.

> **Note**: This endpoint requires \`trading\` scope in Orderly Key.

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
        "order_quantity": 0.987654
      }
    ]
  }
}
\`\`\``
  },

  "rest-create-algo-order": {
    title: "Create Algo Order",
    content: `# Create Algo Order

> **Limit: 5 requests per 1 second**

<div class="api-endpoint">
  <span class="badge badge-post method">POST</span>
  <span class="path">/v1/algo/order</span>
</div>

Create algorithmic orders (stop loss, take profit, etc.).

> **Note**: This endpoint requires \`trading\` scope in Orderly Key.

## Supported Algo Order Types

- **STOP_LOSS**: Stop loss order
- **TAKE_PROFIT**: Take profit order
- **TRAILING_STOP**: Trailing stop order
- **POSITIONAL_TP_SL**: Positional TP/SL order

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair |
| algo_type | string | Yes | Algorithm order type |
| side | string | Yes | \`SELL\`/\`BUY\` |
| quantity | number | Yes | Order quantity |
| trigger_price | number | Yes | Trigger price |
| price | number | Conditional | Limit price (required for limit type orders) |

## Response Example

\`\`\`json
{
  "success": true,
  "timestamp": 1702989203989,
  "data": {
    "algo_order_id": 123456,
    "symbol": "PERP_ETH_USDC",
    "algo_type": "STOP_LOSS",
    "status": "NEW"
  }
}
\`\`\``
  },

  "rest-cancel-algo-order": {
    title: "Cancel Algo Order",
    content: `# Cancel Algo Order

> **Limit: 10 requests per 1 second**

<div class="api-endpoint">
  <span class="badge badge-delete method">DELETE</span>
  <span class="path">/v1/algo/order?algo_order_id={algo_order_id}&symbol={symbol}</span>
</div>

Cancel an algorithmic order by \`algo_order_id\`.

> **Note**: This endpoint requires \`trading\` scope in Orderly Key.

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair |
| algo_order_id | number | Yes | Algo order ID |

## Response Example

\`\`\`json
{
  "success": true,
  "timestamp": 1702989203989,
  "data": {
    "status": "CANCELLED"
  }
}
\`\`\``
  },

  "rest-edit-algo-order": {
    title: "Edit Algo Order",
    content: `# Edit Algo Order

> **Limit: 10 requests per 1 second**

<div class="api-endpoint">
  <span class="badge badge-put method">PUT</span>
  <span class="path">/v1/algo/order</span>
</div>

Edit an existing algorithmic order.

> **Note**: This endpoint requires \`trading\` scope in Orderly Key.

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| algo_order_id | number | Yes | Algo order ID |
| symbol | string | Yes | Trading pair |
| quantity | number | No | New order quantity |
| trigger_price | number | No | New trigger price |

## Response Example

\`\`\`json
{
  "success": true,
  "timestamp": 1702989203989,
  "data": {
    "algo_order_id": 123456,
    "status": "REPLACED"
  }
}
\`\`\``
  },

  "rest-get-all-positions-info": {
    title: "Get All Positions Info",
    content: `# Get All Positions Info

> **Limit: 10 requests per 1 second**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/positions</span>
</div>

Get detailed information of all current positions.

> **Note**: This endpoint requires \`read\` scope in Orderly Key.

## Response Example

\`\`\`json
{
  "success": true,
  "timestamp": 1702989203989,
  "data": {
    "rows": [
      {
        "symbol": "PERP_ETH_USDC",
        "position_qty": 10.5,
        "cost_position": 15750.00,
        "average_open_price": 1500.00,
        "unsettled_pnl": 52.50,
        "mark_price": 1505.00,
        "est_liq_price": 1200.00
      }
    ]
  }
}
\`\`\``
  },

  "rest-get-position-history": {
    title: "Get Position History",
    content: `# Get Position History

> **Limit: 10 requests per 1 second**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/position/:symbol/history</span>
</div>

Get position history for a specific trading pair.

> **Note**: This endpoint requires \`read\` scope in Orderly Key.

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair (in path) |
| start_t | number | No | Start timestamp (milliseconds) |
| end_t | number | No | End timestamp (milliseconds) |
| page | number | No | Page number, default 1 |
| size | number | No | Page size, default 25, max 500 |

## Response Example

\`\`\`json
{
  "success": true,
  "data": {
    "rows": [
      {
        "id": 12345,
        "symbol": "PERP_ETH_USDC",
        "average_open_price": 1500.00,
        "average_close_price": 1550.00,
        "quantity": 10,
        "pnl": 500.00
      }
    ]
  }
}
\`\`\``
  },

  "rest-get-leverage-setting": {
    title: "Get Leverage Setting",
    content: `# Get Leverage Setting

> **Limit: 10 requests per 1 second**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/client/leverage_setting</span>
</div>

Get current leverage settings.

> **Note**: This endpoint requires \`read\` scope in Orderly Key.

## Response Example

\`\`\`json
{
  "success": true,
  "data": {
    "account_leverage": 10,
    "symbol_leverage": [
      {
        "symbol": "PERP_BTC_USDC",
        "leverage": 20
      }
    ]
  }
}
\`\`\``
  },

  "rest-update-leverage-setting": {
    title: "Update Leverage Setting",
    content: `# Update Leverage Setting

> **Limit: 5 requests per 1 second**

<div class="api-endpoint">
  <span class="badge badge-post method">POST</span>
  <span class="path">/v1/client/leverage_setting</span>
</div>

Update leverage setting for account or specific trading pair.

> **Note**: This endpoint requires \`trading\` scope in Orderly Key.

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| leverage | number | Yes | Leverage multiplier (1-20) |
| symbol | string | No | Specific trading pair, if not provided updates account-level leverage |

## Response Example

\`\`\`json
{
  "success": true,
  "timestamp": 1702989203989,
  "data": {
    "leverage": 15,
    "symbol": "PERP_ETH_USDC"
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
        "base_mmr": 0.05,
        "base_imr": 0.1
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

Get predicted funding rates for all markets.

## Response Example

\`\`\`json
{
  "success": true,
  "data": {
    "rows": [
      {
        "symbol": "PERP_BTC_USDC",
        "est_funding_rate": 0.0001,
        "last_funding_rate": 0.00008,
        "next_funding_time": 1703001600000
      }
    ]
  }
}
\`\`\``
  },

  "rest-get-predicted-funding-rate-for-one-market": {
    title: "Get Predicted Funding Rate for One Market",
    content: `# Get Predicted Funding Rate for One Market

> **Limit: 10 requests per 1 second per IP address**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/public/funding_rate/:symbol</span>
</div>

Get predicted funding rate for a specific market.

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Trading pair (in path) |

## Response Example

\`\`\`json
{
  "success": true,
  "data": {
    "symbol": "PERP_BTC_USDC",
    "est_funding_rate": 0.0001,
    "last_funding_rate": 0.00008,
    "next_funding_time": 1703001600000
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

Users can subscribe/unsubscribe to the following topics: \`orderbook\`, \`orderbookupdate\`, \`trade\`, \`ticker\`, \`tickers\`, \`bbo\`, \`bbos\`, \`kline_1m\`, etc.

## Private User Data Stream Base Endpoints

**Mainnet**: \`wss://ws-private-evm.orderly.org/v2/ws/private/stream/{account_id}\`

**Testnet**: \`wss://testnet-ws-private-evm.orderly.org/v2/ws/private/stream/{account_id}\`

Users need to be authenticated before subscribing to any topic. For more information, refer to the [Authentication](#ws-authentication) section.

Users can subscribe/unsubscribe to the following topics: \`account\`, \`balance\`, \`executionreport\`, \`position\`, etc.`
  },

  "ws-authentication": {
    title: "WebSocket Authentication",
    content: `# WebSocket Authentication

Before subscribing to private data streams, users need to be authenticated. Refer to [API Authentication](#rest-api-authentication) for details about how to sign the request with \`orderly-key\` and \`orderly-secret\`.

The **request method, request path,** and **request body** are all blank. The message to sign is therefore just the **timestamp**.

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

WebSocket connections need to send ping periodically to keep the connection alive.

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
  "ts": 1621910107315
}
\`\`\`

It is recommended to send a ping every 10-30 seconds to maintain the connection. If the server does not receive any messages within 60 seconds, the connection will be closed.`
  },

  "ws-error-response": {
    title: "Error Response",
    content: `# WebSocket Error Response

When a WebSocket request fails, the server will return an error response.

## Error Response Format

\`\`\`json
{
  "id": "clientID123",
  "event": "subscribe",
  "success": false,
  "ts": 1621910107315,
  "message": "Invalid topic"
}
\`\`\`

## Common Errors

| Error Message | Description |
|--------------|-------------|
| Invalid topic | Invalid subscription topic |
| Authentication failed | Authentication failed |
| Topic not found | Topic not found |
| Rate limit exceeded | Rate limit exceeded |`
  },

  "ws-orderbook": {
    title: "Orderbook",
    content: `# Orderbook

Push interval: Real-time push (orderbook snapshot)

## Subscribe Request

\`\`\`json
{
  "id": "clientID1",
  "topic": "PERP_BTC_USDC@orderbook",
  "event": "subscribe"
}
\`\`\`

## Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | Client generated ID |
| event | string | Yes | \`subscribe\`/\`unsubscribe\` |
| topic | string | Yes | \`{symbol}@orderbook\` |

## Subscribe Response

\`\`\`json
{
  "id": "clientID1",
  "event": "subscribe",
  "success": true,
  "ts": 1609924478533
}
\`\`\`

## Orderbook Data

\`\`\`json
{
  "topic": "PERP_BTC_USDC@orderbook",
  "ts": 1618820361552,
  "data": {
    "symbol": "PERP_BTC_USDC",
    "bids": [
      [45000.5, 1.5],
      [45000.0, 2.0]
    ],
    "asks": [
      [45001.0, 1.2],
      [45001.5, 2.3]
    ]
  }
}
\`\`\``
  },

  "ws-order-book-update": {
    title: "Order Book Update",
    content: `# Order Book Update

Push interval: Real-time push (incremental updates)

## Subscribe Request

\`\`\`json
{
  "id": "clientID2",
  "topic": "PERP_BTC_USDC@orderbookupdate",
  "event": "subscribe"
}
\`\`\`

## Update Data

\`\`\`json
{
  "topic": "PERP_BTC_USDC@orderbookupdate",
  "ts": 1618820361552,
  "data": {
    "symbol": "PERP_BTC_USDC",
    "prevId": 123456,
    "id": 123457,
    "bids": [
      [45000.5, 2.5],
      [44999.0, 0]
    ],
    "asks": [
      [45001.5, 1.5]
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
  "topic": "PERP_BTC_USDC@trade",
  "event": "subscribe"
}
\`\`\`

## Trade Data

\`\`\`json
{
  "topic": "PERP_BTC_USDC@trade",
  "ts": 1618820361552,
  "data": {
    "symbol": "PERP_BTC_USDC",
    "price": 45000.5,
    "size": 1.5,
    "side": "BUY"
  }
}
\`\`\``
  },

  "ws-bbo": {
    title: "Best Bid Offer (BBO)",
    content: `# Best Bid Offer (BBO)

Push interval: Real-time push

## Subscribe Request

\`\`\`json
{
  "id": "clientID4",
  "topic": "PERP_BTC_USDC@bbo",
  "event": "subscribe"
}
\`\`\`

## BBO Data

\`\`\`json
{
  "topic": "PERP_BTC_USDC@bbo",
  "ts": 1618820361552,
  "data": {
    "symbol": "PERP_BTC_USDC",
    "bid": 45000.0,
    "bid_size": 2.5,
    "ask": 45001.0,
    "ask_size": 1.8
  }
}
\`\`\``
  },

  "ws-bbos": {
    title: "All BBOs",
    content: `# All BBOs

Push interval: Real-time push

## Subscribe Request

\`\`\`json
{
  "id": "clientID5",
  "topic": "bbos",
  "event": "subscribe"
}
\`\`\`

## BBOs Data

\`\`\`json
{
  "topic": "bbos",
  "ts": 1618820361552,
  "data": [
    {
      "symbol": "PERP_BTC_USDC",
      "bid": 45000.0,
      "bid_size": 2.5,
      "ask": 45001.0,
      "ask_size": 1.8
    },
    {
      "symbol": "PERP_ETH_USDC",
      "bid": 3000.0,
      "bid_size": 10.0,
      "ask": 3001.0,
      "ask_size": 8.5
    }
  ]
}
\`\`\``
  },

  "ws-request-orderbook": {
    title: "Request Orderbook",
    content: `# Request Orderbook

Request orderbook snapshot for a specific trading pair.

## Request

\`\`\`json
{
  "id": "clientID6",
  "event": "request",
  "params": {
    "type": "orderbook",
    "symbol": "PERP_BTC_USDC"
  }
}
\`\`\`

## Response

\`\`\`json
{
  "id": "clientID6",
  "event": "request",
  "success": true,
  "ts": 1618820361552,
  "data": {
    "symbol": "PERP_BTC_USDC",
    "bids": [[45000.5, 1.5]],
    "asks": [[45001.0, 1.2]]
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
  "id": "clientID7",
  "topic": "account",
  "event": "subscribe"
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
      "makerFeeRate": 10
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
  "id": "clientID8",
  "topic": "balance",
  "event": "subscribe"
}
\`\`\`

## Balance Data

\`\`\`json
{
  "topic": "balance",
  "ts": 1618820361552,
  "data": {
    "balances": {
      "USDC": {
        "holding": 10000.50,
        "frozen": 500.00
      }
    }
  }
}
\`\`\``
  },

  "ws-position-push": {
    title: "Position Push",
    content: `# Position Push

Push interval: Real-time push

> **Note**: Requires [Authentication](#ws-authentication)

## Subscribe Request

\`\`\`json
{
  "id": "clientID9",
  "topic": "position",
  "event": "subscribe"
}
\`\`\`

## Position Data

\`\`\`json
{
  "topic": "position",
  "ts": 1618820361552,
  "data": {
    "positions": [
      {
        "symbol": "PERP_BTC_USDC",
        "position_qty": 1.5,
        "average_open_price": 45000.00,
        "unsettled_pnl": 75.00,
        "mark_price": 45050.00
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
  "id": "clientID10",
  "topic": "executionreport",
  "event": "subscribe"
}
\`\`\`

## Execution Report Data

\`\`\`json
{
  "topic": "executionreport",
  "ts": 1618820361552,
  "data": {
    "symbol": "PERP_BTC_USDC",
    "order_id": 123456,
    "order_type": "LIMIT",
    "order_price": 45000.00,
    "executed_quantity": 1.5,
    "side": "BUY",
    "status": "FILLED"
  }
}
\`\`\``
  }
};
