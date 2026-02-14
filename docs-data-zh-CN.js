// DEXLESS API Documentation Data - Simplified Chinese

const docsDataZhCN = {
  "introduction": {
    title: "介绍",
    content: `# DEXLESS API 文档

欢迎使用 DEXLESS API 文档。我们提供两种接口与 DEXLESS 进行通讯。

## RESTful API 接口

提供发送事件的功能，例如创建订单、取消订单、获取余额等。

## WebSocket 接口

提供实时订单簿数据推送和订单更新推送。

## 基础端点

**主网**: \`https://api.orderly.org/\`

**测试网**: \`https://testnet-api.orderly.org\`

## REST 端点的一般信息

- 对于 \`GET\` 和 \`DELETE\` 端点，参数必须作为 \`query string\` 发送。
- 对于 \`POST\` 和 \`PUT\` 端点，参数必须在 \`request body\` 中发送，内容类型为 \`application/json\`。
- 参数可以按任何顺序发送。

## 授权

所有私有接口都需要通过加密安全密钥进行签名认证，也称为 Orderly key。请在您的请求中设置相应的标头。详情请参考 [API 认证](#rest-api-authentication)。

## 交易对格式

DEXLESS 使用 \`PERP_<SYMBOL>_USDC\` 的格式来表示交易对名称，例如：\`PERP_ETH_USDC\`。

## 速率限制

速率限制使用 Orderly key 计算。如果您的应用程序达到某个端点的速率限制，服务器将返回 HTTP 代码 \`429\` 的错误结果。您可能需要等待到下一个时间范围。

## 错误消息

> **错误由三部分组成：错误代码、详细消息和成功标志。**

\`\`\`json
{
  "success": false,
  "code": -1005,
  "message": "order_price must be a positive number"
}
\`\`\`

所有 API 在失败时都会返回上述 JSON 格式，"message" 将包含详细的错误消息，可能是因为某些数据格式错误或其他原因。具体的错误代码和消息定义在 [错误代码](#rest-error-codes) 中。`
  },

  "rest-api-authentication": {
    title: "API 认证",
    content: `# API 认证

所有请求都需要使用 orderly-key 和 orderly-secret 进行签名。

## 生成请求签名

DEXLESS 使用 ed25519 椭圆曲线标准通过签名验证进行请求认证。以下是向 DEXLESS 发送有效请求的必要步骤。

### 1. Orderly 账户 ID

在能够认证之前，您必须先注册您的账户并获取账户 ID。您需要将您的账户 ID 作为 \`orderly-account-id\` 添加到请求标头中。

### 2. 访问密钥 (Orderly key)

您的 Orderly 公钥需要作为 \`orderly-key\` 添加到请求标头中。

### 3. 时间戳

获取请求的时间戳（以毫秒为单位）并将其作为 \`orderly-timestamp\` 添加到请求标头中。

### 4. 标准化请求内容

您需要使用 Orderly 私钥签名的消息需要通过以下方法标准化为字符串：

1. 获取当前时间戳（毫秒），例如 \`1649920583000\`
2. 附加大写的 HTTP 方法，例如 \`POST\`
3. 附加请求路径（包括查询参数，不含基础 URL），例如 \`/v1/orders?symbol=PERP_BTC_USDC\`
4. （可选）如果请求有方法体，将其 JSON 字符串化并附加

结果字符串可能如下所示：

\`\`\`
1649920583000POST/v1/order{"symbol": "PERP_ETH_USDC", "order_type": "LIMIT", "order_price": 1521.03, "order_quantity": 2.11, "side": "BUY"}
\`\`\`

### 5. 生成签名

使用标准化的请求内容，通过 ed25519 算法生成签名，并将签名编码为 base64 url-safe 格式。将结果作为 \`orderly-signature\` 添加到请求标头中。

### 6. Content Type

添加 Content-Type 标头。所有 GET 和 DELETE 请求使用 \`application/x-www-form-urlencoded\`。任何其他方法类型使用 \`application/json\`。

### 7. 发送请求

最终请求应具有以下标头：

\`\`\`
Content-Type, orderly-account-id, orderly-key, orderly-signature, orderly-timestamp
\`\`\`

> **注意**: Orderly key 在代码示例中使用时应该去掉 \`ed25519:\` 前缀。

## 安全性

有三层检查来验证请求是否有效。DEXLESS 服务器只接受通过所有检查的请求。

### 请求时间戳

如果 \`orderly-timestamp\` 标头中的时间戳与 API 服务器时间相差超过 300 秒，则该请求将被视为过期并被拒绝。

### HMAC 参数签名

请求必须具有从请求参数生成并使用您的 Orderly 私钥签名的 \`orderly-signature\` 标头。

### Orderly Key 有效性检查

请求必须具有 \`orderly-key\` 标头，并且 orderly-key 必须已通过添加密钥功能添加到网络中，与账户匹配且仍然有效（尚未过期）。`
  },

  "rest-error-codes": {
    title: "错误代码",
    content: `# 错误代码

| 错误代码 | 状态码 | 描述 |
|---------|--------|------|
| -1000 | 500 | 处理请求时发生未知错误。 |
| -1001 | 401 | API 密钥或密钥格式错误。 |
| -1002 | 401 | API 密钥或密钥无效，可能是因为密钥权限不足或密钥已过期/撤销。 |
| -1003 | 429 | 超过速率限制。 |
| -1004 | 400 | 发送了未知参数。 |
| -1005 | 400 | 某些参数的 API 格式错误。 |
| -1006 | 400 | 在服务器中找不到数据。例如，当客户端尝试取消已取消的订单时，将引发此错误。 |
| -1007 | 409 | 数据已存在或您的请求重复。 |
| -1008 | 400 | 结算数量太高，超出您可以请求的范围。 |
| -1009 | 400 | 无法请求提款结算，您需要先存入其他欠款。 |
| -1011 | 400 | 无法下单/取消订单，可能是因为内部网络错误。请在几秒钟后重试。 |
| -1012 | 400 | 下单/取消订单请求被内部模块拒绝，可能是因为账户正在清算或其他内部错误。请在几秒钟后重试。 |
| -1101 | 400 | 客户的风险敞口太高，可能是由于发送的订单太大或杠杆太低造成的。请参考客户信息检查当前敞口。 |
| -1102 | 400 | 订单价值（价格 * 大小）太小。 |
| -1103 | 400 | 订单价格低于最低允许价格或超过最大允许价格或不符合报价单位。 |
| -1104 | 400 | 订单数量低于最低允许数量或超过最大允许数量或不符合步长。 |
| -1105 | 400 | 价格与中间价相比过高或过低 X%。 |
| -1201 | 400 | 清算相关错误。 |
| -1202 | 400 | 不需要清算，因为用户保证金足够或找不到给定的清算 ID。 |`
  },

  "rest-create-order": {
    title: "创建订单",
    content: `# 创建订单

> **限制: 每秒 10 个请求**

<div class="api-endpoint">
  <span class="badge badge-post method">POST</span>
  <span class="path">/v1/order</span>
</div>

下达 maker/taker 订单，订单执行信息将从 websocket 流更新。将立即响应订单创建消息。

## 订单类型行为

### MARKET 订单
匹配直到完全执行。如果大小太大（大于整个订单簿）或匹配价格超过价格限制（参考 \`price_range\`），则剩余数量将被取消。

### IOC 订单
以 order_price 尽可能多地匹配。如果未完全执行，则剩余数量将被取消。

### FOK 订单
如果订单可以在 order_price 完全执行，则订单被完全执行，否则将在没有任何执行的情况下被取消。

### POST_ONLY 订单
如果订单在下单时将与任何 maker 交易执行，则它将在没有任何执行的情况下被取消。

### ASK 订单
订单价格保证是订单簿在接受时的最佳卖价。

### BID 订单
订单价格保证是订单簿在接受时的最佳买价。

## 参数说明

### visible_quantity
设置在订单簿上显示的最大数量。默认情况下，它等于 order_quantity，不允许负数和大于 \`order_quantity\` 的数字。如果设置为 0，订单将从订单簿中隐藏。它不适用于 \`MARKET\`/\`IOC\`/\`FOK\` 订单，因为这些类型的订单会立即执行和取消，不会显示在订单簿上。

### order_quantity
提供的订单数量。数字的精度应在 8 位数字以内。

### client_order_id
自定义 order_id，在未结订单中唯一的 ID。具有相同 \`client_order_id\` 的订单只有在前一个订单完成时才能被接受，否则订单将被拒绝。

> **注意**: 此端点需要 Orderly Key 中的 \`trading\` 范围。

## 请求参数

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| symbol | string | 是 | 交易对，例如 PERP_ETH_USDC |
| client_order_id | string | 否 | 长度 36，接受连字符但不能作为第一个字符，默认: null |
| order_type | string | 是 | \`LIMIT\`/\`MARKET\`/\`IOC\`/\`FOK\`/\`POST_ONLY\`/\`ASK\`/\`BID\` |
| order_price | number | 条件 | 如果 order_type 是 MARKET/ASK/BID，则不需要，否则此参数为必填 |
| order_quantity | number | 条件 | 订单数量 |
| order_amount | number | 条件 | 对于 MARKET/ASK/BID 订单，以报价货币表示的订单大小 |
| visible_quantity | number | 否 | 在订单簿上显示的订单数量（默认：等于 order_quantity） |
| side | string | 是 | \`SELL\`/\`BUY\` |
| reduce_only | boolean | 否 | 默认 false |
| slippage | number | 否 | \`MARKET\` 订单超过此滑点将不会被执行 |
| order_tag | string | 否 | 订单标签 |
| level | number | 否 | 0-4 的整数值，控制是否呈现 bid0-bid4 或 ask0-ask4 的价格。仅当 \`order_type\` 为 \`BID\` 或 \`ASK\` 时允许 |
| post_only_adjust | boolean | 否 | 如果设置为 true，则价格将调整为接近当前最佳价格的 1 个价格单位。仅支持 \`POST_ONLY\` 类型订单 |

## 响应示例

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
    title: "取消订单",
    content: `# 取消订单

> **限制: 每秒 10 个请求**

<div class="api-endpoint">
  <span class="badge badge-delete method">DELETE</span>
  <span class="path">/v1/order?order_id={order_id}&symbol={symbol}</span>
</div>

通过 \`order_id\` 取消单个订单。

> **注意**: 此端点需要 Orderly Key 中的 \`trading\` 范围。

## 请求参数

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| symbol | string | 是 | 交易对 |
| order_id | number | 是 | 订单 ID |

## 响应示例

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
    title: "编辑订单",
    content: `# 编辑订单

> **限制: 每秒 10 个请求**

<div class="api-endpoint">
  <span class="badge badge-put method">PUT</span>
  <span class="path">/v1/order</span>
</div>

通过 \`order_id\` 编辑待处理订单。只能修改 \`order_price\` 或 \`order_quantity\`。

> **注意**: 此端点需要 Orderly Key 中的 \`trading\` 范围。

## 请求参数

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| order_id | string | 是 | 订单 ID |
| symbol | string | 是 | 交易对 |
| client_order_id | string | 否 | 客户端订单 ID |
| order_type | string | 是 | 订单类型 |
| order_price | number | 否 | 订单价格 |
| order_quantity | number | 否 | 订单数量 |
| order_amount | number | 否 | 订单金额 |
| side | string | 是 | \`SELL\`/\`BUY\` |

## 响应示例

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
    title: "批量创建订单",
    content: `# 批量创建订单

> **限制: 每秒 5 个请求**

<div class="api-endpoint">
  <span class="badge badge-post method">POST</span>
  <span class="path">/v1/batch-order</span>
</div>

批量下达多个订单。最多可以在一个请求中下达 10 个订单。

> **注意**: 此端点需要 Orderly Key 中的 \`trading\` 范围。

## 请求参数

请求体应该是一个订单对象数组，每个订单对象包含与创建订单相同的参数。

## 响应示例

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
      },
      {
        "order_id": 14,
        "client_order_id": "testclientid2",
        "order_type": "LIMIT",
        "order_price": 100.50,
        "order_quantity": 1.5
      }
    ]
  }
}
\`\`\``
  },

  "rest-create-algo-order": {
    title: "创建算法订单",
    content: `# 创建算法订单

> **限制: 每秒 5 个请求**

<div class="api-endpoint">
  <span class="badge badge-post method">POST</span>
  <span class="path">/v1/algo/order</span>
</div>

创建算法订单（如止损、止盈等）。

> **注意**: 此端点需要 Orderly Key 中的 \`trading\` 范围。

## 支持的算法订单类型

- **STOP_LOSS**: 止损订单
- **TAKE_PROFIT**: 止盈订单
- **STOP_LOSS_LIMIT**: 止损限价订单
- **TAKE_PROFIT_LIMIT**: 止盈限价订单
- **TRAILING_STOP**: 追踪止损订单
- **POSITIONAL_TP_SL**: 仓位止盈止损订单

## 请求参数

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| symbol | string | 是 | 交易对 |
| algo_type | string | 是 | 算法订单类型 |
| side | string | 是 | \`SELL\`/\`BUY\` |
| quantity | number | 是 | 订单数量 |
| trigger_price | number | 是 | 触发价格 |
| price | number | 条件 | 限价单价格（对于限价类型订单必填） |
| reduce_only | boolean | 否 | 是否仅减仓，默认 false |

## 响应示例

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
    title: "取消算法订单",
    content: `# 取消算法订单

> **限制: 每秒 10 个请求**

<div class="api-endpoint">
  <span class="badge badge-delete method">DELETE</span>
  <span class="path">/v1/algo/order?algo_order_id={algo_order_id}&symbol={symbol}</span>
</div>

通过 \`algo_order_id\` 取消算法订单。

> **注意**: 此端点需要 Orderly Key 中的 \`trading\` 范围。

## 请求参数

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| symbol | string | 是 | 交易对 |
| algo_order_id | number | 是 | 算法订单 ID |

## 响应示例

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
    title: "编辑算法订单",
    content: `# 编辑算法订单

> **限制: 每秒 10 个请求**

<div class="api-endpoint">
  <span class="badge badge-put method">PUT</span>
  <span class="path">/v1/algo/order</span>
</div>

编辑现有的算法订单。

> **注意**: 此端点需要 Orderly Key 中的 \`trading\` 范围。

## 请求参数

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| algo_order_id | number | 是 | 算法订单 ID |
| symbol | string | 是 | 交易对 |
| quantity | number | 否 | 新的订单数量 |
| trigger_price | number | 否 | 新的触发价格 |
| price | number | 否 | 新的限价单价格 |

## 响应示例

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
    title: "获取所有仓位信息",
    content: `# 获取所有仓位信息

> **限制: 每秒 10 个请求**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/positions</span>
</div>

获取当前所有仓位的详细信息。

> **注意**: 此端点需要 Orderly Key 中的 \`read\` 范围。

## 请求参数

无需参数。

## 响应示例

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
        "settled_pnl": 0,
        "mark_price": 1505.00,
        "est_liq_price": 1200.00,
        "timestamp": 1702989203989
      }
    ]
  }
}
\`\`\``
  },

  "rest-get-position-history": {
    title: "获取仓位历史",
    content: `# 获取仓位历史

> **限制: 每秒 10 个请求**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/position/:symbol/history</span>
</div>

获取特定交易对的仓位历史记录。

> **注意**: 此端点需要 Orderly Key 中的 \`read\` 范围。

## 请求参数

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| symbol | string | 是 | 交易对（在路径中） |
| start_t | number | 否 | 开始时间戳（毫秒） |
| end_t | number | 否 | 结束时间戳（毫秒） |
| page | number | 否 | 页码，默认 1 |
| size | number | 否 | 每页大小，默认 25，最大 500 |

## 响应示例

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
        "pnl": 500.00,
        "fee": 5.00,
        "open_timestamp": 1702900000000,
        "close_timestamp": 1702989203989
      }
    ],
    "meta": {
      "total": 100,
      "records_per_page": 25,
      "current_page": 1
    }
  }
}
\`\`\``
  },

  "rest-get-leverage-setting": {
    title: "获取杠杆设定",
    content: `# 获取杠杆设定

> **限制: 每秒 10 个请求**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/client/leverage_setting</span>
</div>

获取当前的杠杆设定。

> **注意**: 此端点需要 Orderly Key 中的 \`read\` 范围。

## 请求参数

无需参数。

## 响应示例

\`\`\`json
{
  "success": true,
  "data": {
    "account_leverage": 10,
    "symbol_leverage": [
      {
        "symbol": "PERP_BTC_USDC",
        "leverage": 20
      },
      {
        "symbol": "PERP_ETH_USDC",
        "leverage": 15
      }
    ]
  }
}
\`\`\``
  },

  "rest-update-leverage-setting": {
    title: "更新杠杆设定",
    content: `# 更新杠杆设定

> **限制: 每秒 5 个请求**

<div class="api-endpoint">
  <span class="badge badge-post method">POST</span>
  <span class="path">/v1/client/leverage_setting</span>
</div>

更新账户或特定交易对的杠杆设定。

> **注意**: 此端点需要 Orderly Key 中的 \`trading\` 范围。

## 请求参数

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| leverage | number | 是 | 杠杆倍数（1-20） |
| symbol | string | 否 | 特定交易对，如果不提供则更新账户级别杠杆 |

## 响应示例

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
    title: "获取可用交易对",
    content: `# 获取可用交易对

> **限制: 每秒 10 个请求 (每个 IP 地址)**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/public/info</span>
</div>

获取 DEXLESS 支持的可用交易对，以及每个交易对的订单规则。

## 请求参数

无需参数（公开端点）。

## 响应示例

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
        "interest_rate": 0.0001,
        "base_mmr": 0.05,
        "base_imr": 0.1,
        "created_time": 1684140107326,
        "updated_time": 1685345968053
      },
      {
        "symbol": "PERP_ETH_USDC",
        "quote_min": 0,
        "quote_max": 50000,
        "quote_tick": 0.01,
        "base_min": 0.0001,
        "base_max": 100,
        "base_tick": 0.0001,
        "min_notional": 1,
        "price_range": 0.02,
        "price_scope": 0.4,
        "std_liquidation_fee": 0.03,
        "liquidator_fee": 0.015,
        "claim_insurance_fund_discount": 0.0075,
        "funding_period": 8,
        "cap_funding": 0.000375,
        "floor_funding": -0.000375,
        "interest_rate": 0.0001,
        "base_mmr": 0.05,
        "base_imr": 0.1,
        "created_time": 1684140107326,
        "updated_time": 1685345968053
      }
    ]
  }
}
\`\`\``
  },

  "rest-get-predicted-funding-rates-for-all-markets": {
    title: "获取所有市场预测资金费率",
    content: `# 获取所有市场预测资金费率

> **限制: 每秒 10 个请求 (每个 IP 地址)**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/public/funding_rates</span>
</div>

获取所有市场的预测资金费率。

## 请求参数

无需参数（公开端点）。

## 响应示例

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
      },
      {
        "symbol": "PERP_ETH_USDC",
        "est_funding_rate": 0.00012,
        "last_funding_rate": 0.0001,
        "next_funding_time": 1703001600000
      }
    ]
  }
}
\`\`\``
  },

  "rest-get-predicted-funding-rate-for-one-market": {
    title: "获取单一市场预测资金费率",
    content: `# 获取单一市场预测资金费率

> **限制: 每秒 10 个请求 (每个 IP 地址)**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/public/funding_rate/:symbol</span>
</div>

获取特定市场的预测资金费率。

## 请求参数

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| symbol | string | 是 | 交易对（在路径中） |

## 响应示例

\`\`\`json
{
  "success": true,
  "data": {
    "symbol": "PERP_BTC_USDC",
    "est_funding_rate": 0.0001,
    "last_funding_rate": 0.00008,
    "next_funding_time": 1703001600000,
    "funding_rate_history": [
      {
        "funding_rate": 0.00008,
        "funding_time": 1702972800000
      },
      {
        "funding_rate": 0.00009,
        "funding_time": 1702944000000
      }
    ]
  }
}
\`\`\``
  },

  "ws-introduction": {
    title: "WebSocket API 介绍",
    content: `# WebSocket API

## 市场数据基础端点

**主网**: \`wss://ws-evm.orderly.org/ws/stream/{account_id}\`

**测试网**: \`wss://testnet-ws-evm.orderly.org/ws/stream/{account_id}\`

\`{account_id}\` 是您的账户 ID。

用户可以订阅/取消订阅以下主题：
- \`orderbook\` - 订单簿
- \`orderbookupdate\` - 订单簿更新
- \`trade\` - 交易记录
- \`ticker\` - 单一行情
- \`tickers\` - 所有行情
- \`bbo\` - 单一最佳买卖价
- \`bbos\` - 所有最佳买卖价
- \`estfundingrate\` - 预估资金费率
- \`indexprice\` - 指数价格
- \`indexprices\` - 所有指数价格
- \`liquidation\` - 清算
- \`markprice\` - 标记价格
- \`markprices\` - 所有标记价格
- \`openinterest\` - 未平仓合约
- \`kline_1m\`, \`kline_5m\`, \`kline_15m\`, \`kline_30m\`, \`kline_1h\`, \`kline_1d\`, \`kline_1w\`, \`kline_1M\` - K线数据

## 私有用户数据流基础端点

**主网**: \`wss://ws-private-evm.orderly.org/v2/ws/private/stream/{account_id}\`

**测试网**: \`wss://testnet-ws-private-evm.orderly.org/v2/ws/private/stream/{account_id}\`

\`{account_id}\` 是您的账户 ID。

用户在订阅任何主题之前需要进行认证。如果认证失败，他们将被断开连接。详情请参考 [认证](#ws-authentication) 部分。

用户可以订阅/取消订阅以下主题：
- \`account\` - 账户信息
- \`balance\` - 余额
- \`executionreport\` - 执行报告
- \`liquidationsaccount\` - 账户清算
- \`liquidatorliquidations\` - 清算人清算
- \`notifications\` - 通知
- \`settle\` - 结算
- \`position\` - 仓位
- \`wallet\` - 钱包`
  },

  "ws-authentication": {
    title: "WebSocket 认证",
    content: `# WebSocket 认证

在订阅私有数据流之前，用户需要进行认证。请参考 [API 认证](#rest-api-authentication) 了解如何使用 \`orderly-key\` 和 \`orderly-secret\` 签名请求。

**请求方法、请求路径和请求体**都是空白的。因此，要签名的消息只是**时间戳**。

WebSocket 私有连接现在可以在创建连接时通过将认证请求的内容以查询字符串的形式附加到订阅 URL 中进行认证。

例如：
\`\`\`
wss://ws-private-evm.orderly.org/v2/ws/private/stream/0xd7379678a303b57d7d43eb23c64dd7528ac8cb4efe983a3aedcfe9b4aa4cb984?orderly_key=xxxxxxxx&timestamp=xxxxx&sign=xxxxx
\`\`\`

这将在创建连接时认证用户，无需再次发送认证请求。

## 认证请求

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

## 参数

| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| orderly_key | string | 是 | Orderly Key |
| sign | string | 是 | 签名 |
| timestamp | timestamp | 是 | 时间戳 |

## 认证响应

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

WebSocket 连接需要定期发送 ping 来保持连接活跃。

## Ping 请求

\`\`\`json
{
  "event": "ping"
}
\`\`\`

## Pong 响应

\`\`\`json
{
  "event": "pong",
  "ts": 1621910107315
}
\`\`\`

建议每 10-30 秒发送一次 ping 以保持连接。如果服务器在 60 秒内没有收到任何消息，连接将被关闭。`
  },

  "ws-error-response": {
    title: "错误响应",
    content: `# WebSocket 错误响应

当 WebSocket 请求失败时，服务器将返回错误响应。

## 错误响应格式

\`\`\`json
{
  "id": "clientID123",
  "event": "subscribe",
  "success": false,
  "ts": 1621910107315,
  "message": "Invalid topic"
}
\`\`\`

## 常见错误

| 错误消息 | 描述 |
|---------|------|
| Invalid topic | 无效的订阅主题 |
| Authentication failed | 认证失败 |
| Topic not found | 找不到主题 |
| Rate limit exceeded | 超过速率限制 |
| Invalid parameters | 无效的参数 |`
  },

  "ws-orderbook": {
    title: "订单簿",
    content: `# 订单簿

推送间隔: 实时推送（订单簿快照）

## 订阅请求

\`\`\`json
{
  "id": "clientID1",
  "topic": "PERP_BTC_USDC@orderbook",
  "event": "subscribe"
}
\`\`\`

## 参数

| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | string | 是 | 客户端生成的 ID |
| event | string | 是 | \`subscribe\`/\`unsubscribe\` |
| topic | string | 是 | \`{symbol}@orderbook\` |

## 订阅响应

\`\`\`json
{
  "id": "clientID1",
  "event": "subscribe",
  "success": true,
  "ts": 1609924478533
}
\`\`\`

## 订单簿数据

\`\`\`json
{
  "topic": "PERP_BTC_USDC@orderbook",
  "ts": 1618820361552,
  "data": {
    "symbol": "PERP_BTC_USDC",
    "bids": [
      [45000.5, 1.5],
      [45000.0, 2.0],
      [44999.5, 3.5]
    ],
    "asks": [
      [45001.0, 1.2],
      [45001.5, 2.3],
      [45002.0, 1.8]
    ]
  }
}
\`\`\`

订单簿数据包含当前的买单（bids）和卖单（asks）。每个价格级别表示为 \`[price, quantity]\`。`
  },

  "ws-order-book-update": {
    title: "订单簿更新",
    content: `# 订单簿更新

推送间隔: 实时推送（增量更新）

## 订阅请求

\`\`\`json
{
  "id": "clientID2",
  "topic": "PERP_BTC_USDC@orderbookupdate",
  "event": "subscribe"
}
\`\`\`

## 参数

| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | string | 是 | 客户端生成的 ID |
| event | string | 是 | \`subscribe\`/\`unsubscribe\` |
| topic | string | 是 | \`{symbol}@orderbookupdate\` |

## 订阅响应

\`\`\`json
{
  "id": "clientID2",
  "event": "subscribe",
  "success": true,
  "ts": 1609924478533
}
\`\`\`

## 更新数据

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

订单簿更新提供增量变化。如果数量为 0，表示该价格级别已被移除。`
  },

  "ws-trade": {
    title: "交易记录",
    content: `# 交易记录

推送间隔: 实时推送

## 订阅请求

\`\`\`json
{
  "id": "clientID3",
  "topic": "PERP_BTC_USDC@trade",
  "event": "subscribe"
}
\`\`\`

## 参数

| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | string | 是 | 客户端生成的 ID |
| event | string | 是 | \`subscribe\`/\`unsubscribe\` |
| topic | string | 是 | \`{symbol}@trade\` |

## 订阅响应

\`\`\`json
{
  "id": "clientID3",
  "event": "subscribe",
  "success": true,
  "ts": 1609924478533
}
\`\`\`

## 交易数据

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
\`\`\`

交易数据包含最新的成交记录，包括价格、数量和方向。`
  },

  "ws-bbo": {
    title: "最佳买卖价 (BBO)",
    content: `# 最佳买卖价 (BBO)

推送间隔: 实时推送

## 订阅请求

\`\`\`json
{
  "id": "clientID4",
  "topic": "PERP_BTC_USDC@bbo",
  "event": "subscribe"
}
\`\`\`

## 参数

| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | string | 是 | 客户端生成的 ID |
| event | string | 是 | \`subscribe\`/\`unsubscribe\` |
| topic | string | 是 | \`{symbol}@bbo\` |

## 订阅响应

\`\`\`json
{
  "id": "clientID4",
  "event": "subscribe",
  "success": true,
  "ts": 1609924478533
}
\`\`\`

## BBO 数据

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
\`\`\`

BBO 提供最佳买价和最佳卖价的实时更新。`
  },

  "ws-bbos": {
    title: "所有 BBO",
    content: `# 所有 BBO

推送间隔: 实时推送

## 订阅请求

\`\`\`json
{
  "id": "clientID5",
  "topic": "bbos",
  "event": "subscribe"
}
\`\`\`

## 参数

| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | string | 是 | 客户端生成的 ID |
| event | string | 是 | \`subscribe\`/\`unsubscribe\` |
| topic | string | 是 | \`bbos\` |

## 订阅响应

\`\`\`json
{
  "id": "clientID5",
  "event": "subscribe",
  "success": true,
  "ts": 1609924478533
}
\`\`\`

## BBOs 数据

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
\`\`\`

BBOs 提供所有交易对的最佳买卖价。`
  },

  "ws-request-orderbook": {
    title: "请求订单簿",
    content: `# 请求订单簿

请求特定交易对的订单簿快照。

## 请求

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

## 参数

| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | string | 是 | 客户端生成的 ID |
| event | string | 是 | \`request\` |
| type | string | 是 | \`orderbook\` |
| symbol | string | 是 | 交易对 |

## 响应

\`\`\`json
{
  "id": "clientID6",
  "event": "request",
  "success": true,
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
\`\`\`

这个端点允许您按需请求订单簿快照，而不是订阅持续更新。`
  },

  "ws-account": {
    title: "账户信息",
    content: `# 账户信息

推送间隔: 实时推送

> **注意**: 需要先进行 [认证](#ws-authentication)

## 订阅请求

\`\`\`json
{
  "id": "clientID7",
  "topic": "account",
  "event": "subscribe"
}
\`\`\`

## 参数

| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | string | 是 | 客户端生成的 ID |
| event | string | 是 | \`subscribe\`/\`unsubscribe\` |
| topic | string | 是 | \`account\` |

## 订阅响应

\`\`\`json
{
  "id": "clientID7",
  "event": "subscribe",
  "success": true,
  "ts": 1609924478533
}
\`\`\`

## 账户数据

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
      "maintenanceCancelFlag": false,
      "symbolLeverage": {
        "leverage": 20,
        "symbol": "PERP_BTC_USDC"
      }
    }
  }
}
\`\`\`

账户信息包含保证金模式、杠杆设定、手续费率等。`
  },

  "ws-balance": {
    title: "余额",
    content: `# 余额

推送间隔: 实时推送

> **注意**: 需要先进行 [认证](#ws-authentication)

## 订阅请求

\`\`\`json
{
  "id": "clientID8",
  "topic": "balance",
  "event": "subscribe"
}
\`\`\`

## 参数

| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | string | 是 | 客户端生成的 ID |
| event | string | 是 | \`subscribe\`/\`unsubscribe\` |
| topic | string | 是 | \`balance\` |

## 订阅响应

\`\`\`json
{
  "id": "clientID8",
  "event": "subscribe",
  "success": true,
  "ts": 1609924478533
}
\`\`\`

## 余额数据

\`\`\`json
{
  "topic": "balance",
  "ts": 1618820361552,
  "data": {
    "balances": {
      "USDC": {
        "holding": 10000.50,
        "frozen": 500.00,
        "pending_short": 0,
        "pending_long": 0
      }
    }
  }
}
\`\`\`

余额数据包含各资产的持有量、冻结量等信息。`
  },

  "ws-position-push": {
    title: "仓位推送",
    content: `# 仓位推送

推送间隔: 实时推送

> **注意**: 需要先进行 [认证](#ws-authentication)

## 订阅请求

\`\`\`json
{
  "id": "clientID9",
  "topic": "position",
  "event": "subscribe"
}
\`\`\`

## 参数

| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | string | 是 | 客户端生成的 ID |
| event | string | 是 | \`subscribe\`/\`unsubscribe\` |
| topic | string | 是 | \`position\` |

## 订阅响应

\`\`\`json
{
  "id": "clientID9",
  "event": "subscribe",
  "success": true,
  "ts": 1609924478533
}
\`\`\`

## 仓位数据

\`\`\`json
{
  "topic": "position",
  "ts": 1618820361552,
  "data": {
    "positions": [
      {
        "symbol": "PERP_BTC_USDC",
        "position_qty": 1.5,
        "cost_position": 67500.00,
        "average_open_price": 45000.00,
        "unsettled_pnl": 75.00,
        "settled_pnl": 0,
        "mark_price": 45050.00,
        "est_liq_price": 30000.00,
        "timestamp": 1618820361552
      }
    ]
  }
}
\`\`\`

仓位推送包含当前所有仓位的实时信息，包括持仓量、平均开仓价格、未实现盈亏等。`
  },

  "ws-execution-report": {
    title: "执行报告",
    content: `# 执行报告

推送间隔: 实时推送

> **注意**: 需要先进行 [认证](#ws-authentication)

## 订阅请求

\`\`\`json
{
  "id": "clientID10",
  "topic": "executionreport",
  "event": "subscribe"
}
\`\`\`

## 参数

| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | string | 是 | 客户端生成的 ID |
| event | string | 是 | \`subscribe\`/\`unsubscribe\` |
| topic | string | 是 | \`executionreport\` |

## 订阅响应

\`\`\`json
{
  "id": "clientID10",
  "event": "subscribe",
  "success": true,
  "ts": 1609924478533
}
\`\`\`

## 执行报告数据

\`\`\`json
{
  "topic": "executionreport",
  "ts": 1618820361552,
  "data": {
    "symbol": "PERP_BTC_USDC",
    "order_id": 123456,
    "client_order_id": "my_order_001",
    "order_type": "LIMIT",
    "order_price": 45000.00,
    "order_quantity": 1.5,
    "executed_price": 45000.00,
    "executed_quantity": 1.5,
    "fee": 6.75,
    "fee_asset": "USDC",
    "side": "BUY",
    "status": "FILLED",
    "timestamp": 1618820361552
  }
}
\`\`\`

执行报告提供订单状态变化和成交信息的实时更新，包括新建、部分成交、完全成交、取消等状态。`
  }
};
