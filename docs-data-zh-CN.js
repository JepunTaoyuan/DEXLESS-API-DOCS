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
| -1000 | 500 | 数据不存在。 |
| -1001 | 401 | API 密钥或密钥格式错误。 |
| -1002 | 401 | API 密钥或密钥无效，可能是因为密钥权限不足或密钥已过期/撤销。 |
| -1003 | 429 | 超过速率限制。 |
| -1004 | 400 | 发送了未知参数。 |
| -1005 | 400 | 某些参数的 API 格式错误。 |
| -1005 | 400 | ratio_qty_request 应该在 0-1 范围内。 |
| -1005 | 400 | extra_liquidation_ratio 应该在 0-1 范围内。 |
| -1005 | 400 | 如果设置 extra_liquidation_ratio > 0，ratio_qty_request 必须为 1。 |
| -1006 | 400 | 在服务器中找不到数据。例如，当客户端尝试取消已取消的订单时，将引发此错误。 |
| -1007 | 409 | 数据已存在或您的请求重复。 |
| -1008 | 400 | 结算数量太高，超出您可以请求的范围。 |
| -1009 | 400 | 无法请求提款结算，您需要先存入其他欠款。 |
| -1011 | 400 | 无法下单/取消订单，可能是因为内部网络错误。请在几秒钟后重试。 |
| -1012 | 400 | 下单/取消订单请求被内部模块拒绝，可能是因为账户正在清算或其他内部错误。请在几秒钟后重试。 |
| -1012 | 400 | 另一个清算正在进行中。 |
| -1101 | 400 | 客户的风险敞口太高，可能是由于发送的订单太大或杠杆太低造成的。请参考客户信息检查当前敞口。 |
| -1101 | 400 | 之后保证金将不足。 |
| -1102 | 400 | 订单价值（价格 * 大小）太小。 |
| -1103 | 400 | 订单价格低于最低允许价格 {quote_min}。 |
| -1103 | 400 | 订单价格超过最大允许价格 {quote_max}。 |
| -1103 | 400 | 订单价格不符合报价单位。 |
| -1104 | 400 | 订单数量低于最低允许数量 {base_min}。 |
| -1104 | 400 | 订单数量超过最大允许数量 {base_max}。 |
| -1104 | 400 | 订单数量不符合步长。 |
| -1104 | 400 | 可见数量不符合步长。 |
| -1105 | 400 | 价格与中间价相比过高或过低 X%。 |
| -1201 | 400 | 总名义价值 < 10000，最小请求比率应 = 1 |
| -1201 | 400 | 最小请求比率应 = xxxx |
| -1202 | 400 | 不需要清算，因为用户保证金足够。 |
| -1202 | 400 | 找不到给定的清算 ID。 |`
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

## 请求 Headers（认证必需）

| Header | 类型 | 必需 | 描述 |
|--------|------|------|------|
| orderly-timestamp | string | 是 | 毫秒时间戳 |
| orderly-account-id | string | 是 | 账户 ID |
| orderly-key | string | 是 | Orderly API 密钥 |
| orderly-signature | string | 是 | Ed25519 签名（Base64 编码） |

## 请求 Headers（可选）

| Header | 类型 | 必需 | 描述 |
|--------|------|------|------|
| x-recv-window | number | 否 | 控制下单的超时阈值，单位为毫秒（例如：20） |

## 请求参数（请求主体）

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

## 请求主体示例

\`\`\`json
{
  "symbol": "PERP_ETH_USDC",
  "order_type": "LIMIT",
  "order_price": 1521.03,
  "order_quantity": 2.11,
  "side": "BUY"
}
\`\`\`

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

## 请求 Headers（认证必需）

| Header | 类型 | 必需 | 描述 |
|--------|------|------|------|
| orderly-timestamp | string | 是 | 毫秒时间戳 |
| orderly-account-id | string | 是 | 账户 ID |
| orderly-key | string | 是 | Orderly API 密钥 |
| orderly-signature | string | 是 | Ed25519 签名（Base64 编码） |

## 请求参数（查询字符串）

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

## 请求 Headers（认证必需）

| Header | 类型 | 必需 | 描述 |
|--------|------|------|------|
| orderly-timestamp | string | 是 | 毫秒时间戳 |
| orderly-account-id | string | 是 | 账户 ID |
| orderly-key | string | 是 | Orderly API 密钥 |
| orderly-signature | string | 是 | Ed25519 签名（Base64 编码） |

## 请求参数（请求主体）

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| order_id | string | 是 | 订单 ID |
| symbol | string | 是 | 交易对 |
| client_order_id | string | 否 | 客户端订单 ID |
| order_type | string | 是 | 订单类型 |
| order_price | number | 否 | 新的订单价格 |
| order_quantity | number | 否 | 新的订单数量 |
| order_amount | number | 否 | 订单金额 |
| side | string | 是 | \`SELL\`/\`BUY\` |
| reduce_only | boolean | 否 | 默认 false |
| visible_quantity | number | 否 | 可见数量 |
| order_tag | string | 否 | 订单标签 |

## 请求主体示例

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

> **限制: 每秒 1 个请求**

<div class="api-endpoint">
  <span class="badge badge-post method">POST</span>
  <span class="path">/v1/batch-order</span>
</div>

根据与单个创建订单相同的规则，以列表形式创建一批订单。

批次中每个订单的参数与创建单个订单相同。订单批次应作为包含所有订单的 JSON 数组发送。一个批量订单请求中最多可以发送 10 个订单。批量订单请求中的每个订单都计入总体创建订单速率限制的 1 个订单。

> **注意**: 此端点需要 Orderly Key 中的 \`trading\` 范围。

## 请求 Headers（认证必需）

| Header | 类型 | 必需 | 描述 |
|--------|------|------|------|
| orderly-timestamp | string | 是 | 毫秒时间戳 |
| orderly-account-id | string | 是 | 账户 ID |
| orderly-key | string | 是 | Orderly API 密钥 |
| orderly-signature | string | 是 | Ed25519 签名（Base64 编码） |

## 请求 Headers（可选）

| Header | 类型 | 必需 | 描述 |
|--------|------|------|------|
| x-recv-window | number | 否 | 控制下单的超时阈值，单位为毫秒 |

## 请求主体结构

请求主体应该是一个包含 \`orders\` 数组的 JSON 对象。每个订单对象包含与创建订单端点相同的参数。

## 请求主体示例

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
        "order_quantity": 0.987654,
        "error_message": "none"
      }
    ]
  }
}
\`\`\``
  },

  "rest-create-algo-order": {
    title: "创建算法订单",
    content: `# 创建算法订单

> **限制: 每秒 1 个请求**

<div class="api-endpoint">
  <span class="badge badge-post method">POST</span>
  <span class="path">/v1/algo/order</span>
</div>

下达需要额外触发条件才能执行的 maker/taker 订单，例如止损订单。

## 算法订单类型

\`STOP\` 类型订单行为：一旦资产交易达到或超过指定价格（"止损价格"），就以市价/限价买入或卖出的订单。如果资产达到止损价格，订单将成为市价订单并以下一个可用市场价格成交。

要下达 \`Positional TP/SL\` 订单，输入字段为 2 层，包括名为 childOrder 的对象数组。止盈或止损订单应该是数组中的对象。对于 childOrder 中的子订单，请输入 \`CLOSE_POSITION\` 作为类型，在 algoType 字段中输入 \`TAKE_PROFIT\` 或 \`STOP_LOSS\`。

要下达 \`Trailing Stop\` 订单，请使用 \`TRAILING_STOP\` 作为 algoType，\`MARKET\` 作为类型。还请在 callbackRate 字段中输入您的追踪率设置。

> **注意**: 此端点需要 Orderly Key 中的 \`trading\` 范围。

## 请求 Headers（认证必需）

| Header | 类型 | 必需 | 描述 |
|--------|------|------|------|
| orderly-timestamp | string | 是 | 毫秒时间戳 |
| orderly-account-id | string | 是 | 账户 ID |
| orderly-key | string | 是 | Orderly API 密钥 |
| orderly-signature | string | 是 | Ed25519 签名（Base64 编码） |

## 请求参数（请求主体）

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| symbol | string | 是 | 交易对 |
| algo_type | string | 是 | \`STOP\`/\`TP_SL\`/\`POSITIONAL_TP_SL\`/\`BRACKET\`/\`BRACKET + TP_SL\`/\`TRAILING_STOP\` |
| client_order_id | string | 否 | 长度 36，接受连字符但不能作为第一个字符，默认: null |
| type | string | 条件 | \`LIMIT\` / \`MARKET\`，如果 \`algo_type\` = \`STOP\` 则必填 |
| price | number | 否 | 对于 \`TP_SL\` 和 \`POSTIONAL_TP_SL\` 可选 |
| quantity | number | 条件 | 对于 \`MARKET\`/\`ASK\`/\`BID\` 订单，如果给定 order_amount 则不需要。如果类型是 \`POSITIONAL_TP_SL\` 则不需要 |
| trigger_price_type | string | 否 | 目前只有 \`MARK_PRICE\` 可用 |
| trigger_price | number | 否 | 触发价格 |
| reduce_only | boolean | 否 | 默认 false |
| visible_quantity | number | 否 | 默认 false |
| side | string | 条件 | \`SELL\`/\`BUY\`，如果是 \`STOP\` 类型则必填 |
| order_tag | string | 否 | 订单标签 |
| child_orders | array | 否 | 复杂止盈止损订单的子订单对象数组 |
| activatedPrice | string | 否 | 激活价格，用于 algoType=\`TRAILING_STOP\` |
| callbackRate | string | 否 | 回调率，仅用于 algoType=\`TRAILING_STOP\`，例如值 = 0.1 表示 10% |
| callbackValue | string | 否 | 回调值，仅用于 algoType=\`TRAILING_STOP\`，例如值 = 100 |

## 请求主体示例

### STOP 订单

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

### TRAILING_STOP 订单

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

## 响应示例

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
    title: "取消算法订单",
    content: `# 取消算法订单

> **限制: 每秒 5 个请求**

<div class="api-endpoint">
  <span class="badge badge-delete method">DELETE</span>
  <span class="path">/v1/algo/order?order_id={order_id}&symbol={symbol}</span>
</div>

通过 \`order_id\` 取消单个算法订单。

> **注意**: 此端点需要 Orderly Key 中的 \`trading\` 范围。

## 请求 Headers（认证必需）

| Header | 类型 | 必需 | 描述 |
|--------|------|------|------|
| orderly-timestamp | string | 是 | 毫秒时间戳 |
| orderly-account-id | string | 是 | 账户 ID |
| orderly-key | string | 是 | Orderly API 密钥 |
| orderly-signature | string | 是 | Ed25519 签名（Base64 编码） |

## 请求参数（查询字符串）

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| symbol | string | 是 | 交易对 |
| order_id | number | 是 | 算法订单 ID |

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

  "rest-edit-algo-order": {
    title: "编辑算法订单",
    content: `# 编辑算法订单

> **限制: 每秒 5 个请求**

<div class="api-endpoint">
  <span class="badge badge-put method">PUT</span>
  <span class="path">/v1/algo/order</span>
</div>

通过 \`order_id\` 编辑待处理的算法订单。只能修改价格或数量。

> **注意**: 此端点需要 Orderly Key 中的 \`trading\` 范围。

## 请求 Headers（认证必需）

| Header | 类型 | 必需 | 描述 |
|--------|------|------|------|
| orderly-timestamp | string | 是 | 毫秒时间戳 |
| orderly-account-id | string | 是 | 账户 ID |
| orderly-key | string | 是 | Orderly API 密钥 |
| orderly-signature | string | 是 | Ed25519 签名（Base64 编码） |

## 请求参数（请求主体）

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| order_id | string | 是 | 算法订单 ID |
| price | number | 否 | 新的价格 |
| quantity | number | 否 | 新的订单数量 |
| trigger_price | number | 否 | 新的触发价格 |
| trigger_price_type | string | 否 | 触发价格类型 |
| child_orders | array | 否 | 子订单对象数组 |

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

  "rest-get-all-positions-info": {
    title: "获取所有仓位信息",
    content: `# 获取所有仓位信息

> **限制: 每 10 秒 30 个请求（每个用户）**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/positions</span>
</div>

获取当前所有仓位的详细信息，包括保证金比率、抵押品价值和各个仓位详情。

> **注意**: 此端点需要 Orderly Key 中的 \`read\` 范围。

## 请求参数

此端点不需要任何查询参数或请求体。仅需要认证 headers。

### 必需的 Headers

| Header | 类型 | 必填 | 描述 | 示例 |
|--------|------|------|------|------|
| orderly-timestamp | string | 是 | 毫秒时间戳 | \`1649920583000\` |
| orderly-account-id | string | 是 | 账户 ID | \`0x...\` |
| orderly-key | string | 是 | Orderly API Key | \`ed25519:...\` |
| orderly-signature | string | 是 | Ed25519 签名 | Base64 编码 |

## 响应字段说明

### 账户级别字段

| 字段 | 类型 | 描述 |
|------|------|------|
| current_margin_ratio_with_orders | number | 包含未成交订单的当前保证金比率 |
| free_collateral | number | 可用于新仓位的抵押品 |
| initial_margin_ratio | number | 现有仓位的初始保证金比率 |
| initial_margin_ratio_with_orders | number | 包含未成交订单的初始保证金比率 |
| maintenance_margin_ratio | number | 现有仓位的维持保证金比率 |
| maintenance_margin_ratio_with_orders | number | 包含未成交订单的维持保证金比率 |
| margin_ratio | number | 当前保证金比率 |
| open_margin_ratio | number | 持仓的保证金比率 |
| total_collateral_value | number | USDC 计价的总抵押品价值 |
| total_pnl_24_h | number | 过去 24 小时的总盈亏 |

### 仓位级别字段 (rows 数组)

| 字段 | 类型 | 描述 |
|------|------|------|
| symbol | string | 交易对符号 |
| position_qty | number | 当前仓位数量（负数表示空头） |
| cost_position | number | 仓位的总成本 |
| average_open_price | number | 平均入场价格 |
| unsettled_pnl | number | 未实现盈亏 |
| settle_price | number | 结算价格 |
| mark_price | number | 当前标记价格 |
| est_liq_price | number | 预估清算价格 |
| last_sum_unitary_funding | number | 累积资金费用支付 |
| pending_long_qty | number | 来自未成交订单的待处理多头数量 |
| pending_short_qty | number | 来自未成交订单的待处理空头数量 |
| fee_24_h | number | 过去 24 小时的交易手续费 |
| pnl_24_h | number | 过去 24 小时的盈亏 |
| imr | number | 初始保证金比率 |
| mmr | number | 维持保证金比率 |
| IMR_withdraw_orders | number | 包含待处理订单的 IMR |
| MMR_with_orders | number | 包含待处理订单的 MMR |
| leverage | number | 当前杠杆设置 |
| seq | number | 排序用的序列号 |
| timestamp | number | 仓位创建时间戳 |
| updated_time | number | 最后更新时间戳 |

## 响应示例

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
    title: "获取仓位历史",
    content: `# 获取仓位历史

> **限制: 每秒 10 个请求（每个用户）**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/position_history</span>
</div>

获取仓位历史记录。

> **注意**: 此端点需要 Orderly Key 中的 \`read\` 范围。

## 请求 Headers（认证必需）

| Header | 类型 | 必需 | 描述 |
|--------|------|------|------|
| orderly-timestamp | string | 是 | 毫秒时间戳 |
| orderly-account-id | string | 是 | 账户 ID |
| orderly-key | string | 是 | Orderly API 密钥 |
| orderly-signature | string | 是 | Ed25519 签名（Base64 编码） |

## 请求参数（查询字符串）

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| symbol | string | 否 | 交易对 |
| limit | number | 否 | 返回的记录数 |

## 响应示例

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



  "rest-get-current-holding": {
    title: "获取当前持仓",
    content: `# 获取当前持仓

> **限制: 每秒 10 个请求**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/client/holding</span>
</div>

获取用户代币持仓的当前摘要。

> **注意**: 此端点需要 Orderly Key 中的 \`read\` 范围。

## 请求 Headers（认证必需）

| Header | 类型 | 必需 | 描述 |
|--------|------|------|------|
| orderly-timestamp | string | 是 | 毫秒时间戳 |
| orderly-account-id | string | 是 | 账户 ID |
| orderly-key | string | 是 | Orderly API 密钥 |
| orderly-signature | string | 是 | Ed25519 签名（Base64 编码） |

## 请求参数（查询字符串）

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| all | boolean | 否 | 如果为 true，将返回所有代币，即使余额为空。默认: false |

## 响应字段

| 字段 | 类型 | 描述 |
|------|------|------|
| updated_time | number | Unix 时间戳（毫秒） |
| token | string | 代币符号（例如 USDC、USDT） |
| holding | number | 当前持有数量 |
| frozen | number | 冻结数量（锁定在订单中） |
| pending_short | number | 待处理空头数量 |

## 响应示例

\`\`\`json
{
  "success": true,
  "data": {
    "holding": [
      {
        "updated_time": 1580794149000,
        "token": "USDC",
        "holding": 282485.071904,
        "frozen": 0,
        "pending_short": -2000
      },
      {
        "updated_time": 1580794149000,
        "token": "USDT",
        "holding": 150000.50,
        "frozen": 5000,
        "pending_short": 0
      }
    ]
  }
}
\`\`\`
\`
  },

  "rest-get-leverage-setting": {
    title: "获取杠杆设定",
    content: \`# 获取杠杆设定

> **限制: 每秒 1 个请求（每个 IP 地址）**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/client/leverage</span>
</div>

获取账户针对特定交易对的杠杆设定。

> **注意**: 此端点需要 Orderly Key 中的 \`read\` 范围。

## 请求 Headers（认证必需）

| Header | 类型 | 必需 | 描述 |
|--------|------|------|------|
| orderly-timestamp | string | 是 | 毫秒时间戳 |
| orderly-account-id | string | 是 | 账户 ID |
| orderly-key | string | 是 | Orderly API 密钥 |
| orderly-signature | string | 是 | Ed25519 签名（Base64 编码） |

## 请求参数（查询字符串）

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| symbol | string | 是 | 交易对，例如 PERP_BTC_USDC |

## 响应示例

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
    title: "更新杠杆设定",
    content: `# 更新杠杆设定

> **限制: 每 60 秒 5 个请求（每个用户）**

<div class="api-endpoint">
  <span class="badge badge-post method">POST</span>
  <span class="path">/v1/client/leverage</span>
</div>

允许用户为每个交易对自定义杠杆或为账户的期货模式选择最大杠杆。

## 验证逻辑

1. 检查杠杆范围是否符合要求

2. 检查更新杠杆下的仓位名义价值是否可接受
   - \`max_notional = (1 / (symbol_leverage * imr_factor)) ^ (1/0.8)\`
   - \`symbol_leverage_max = 向下取整 → min(1 / (imr_factor * notional ^ 0.8), 1/base_imr)\`

3. 检查保证金是否足够

> **注意**: 此端点需要 Orderly Key 中的 \`trading\` 范围。

## 请求 Headers（认证必需）

| Header | 类型 | 必需 | 描述 |
|--------|------|------|------|
| orderly-timestamp | string | 是 | 毫秒时间戳 |
| orderly-account-id | string | 是 | 账户 ID |
| orderly-key | string | 是 | Orderly API 密钥 |
| orderly-signature | string | 是 | Ed25519 签名（Base64 编码） |

## 请求参数（请求主体）

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| leverage | number | 是 | 1 到 50 之间的整数 |
| symbol | string | 否 | 特定交易对，如果不提供则更新账户级别杠杆 |

## 响应示例

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
    title: "获取可用交易对",
    content: `# 获取可用交易对

> **限制: 每秒 10 个请求 (每个 IP 地址)**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/public/info</span>
</div>

获取 DEXLESS 支持的可用交易对，以及每个交易对的订单规则。

## 请求参数

此端点为公开端点，不需要任何请求参数或认证。

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
    title: "获取所有市场预测资金费率",
    content: `# 获取所有市场预测资金费率

> **限制: 每秒 10 个请求 (每个 IP 地址)**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/public/funding_rates</span>
</div>

获取所有期货交易对的预测资金费率。

获取：
- \`last_funding_rate\`: 所有市场最近资金周期（dt = 8h）的最新每小时资金费率
- \`est_funding_rate\`: 过去 8 小时所有资金费率的滚动平均值

## 请求参数

此端点为公开端点，不需要任何请求参数或认证。

## 响应示例

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
    title: "获取单一市场预测资金费率",
    content: `# 获取单一市场预测资金费率

> **限制: 每秒 30 个请求 (每个 IP 地址)**

<div class="api-endpoint">
  <span class="badge badge-get method">GET</span>
  <span class="path">/v1/public/funding_rate/{symbol}</span>
</div>

获取单一市场的最新资金费率。

## 请求参数

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| symbol | string | 是 | 交易对（在路径中），例如 PERP_ETH_USDC |

## 响应示例

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

服务器每 10 秒向客户端发送一次 ping 命令。如果连续 10 次在 10 秒内未收到客户端的 pong，它将主动断开客户端连接。

客户端也可以每 10 秒发送一次 ping 来保持连接活跃。

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
  "ts": 1614667590000
}
\`\`\``
  },

  "ws-error-response": {
    title: "错误响应",
    content: `# WebSocket 错误响应

当 WebSocket 请求失败时，服务器将返回错误响应。

您可以使用响应中的 \`id\` 字段将错误响应与请求对应。

## 错误响应格式

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
    title: "订单簿",
    content: `# 订单簿

\`{symbol}@orderbook\` 深度 100，每秒推送

## 订阅请求

\`\`\`json
{
  "id": "clientID2",
  "topic": "PERP_WOO_USDC@orderbook",
  "event": "subscribe"
}
\`\`\`

## 参数

| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | string | 是 | 客户端生成的 ID |
| event | string | 是 | \`subscribe\`/\`unsubscribe\` |
| topic | string | 是 | \`{symbol}@orderbook\` |
| params.symbol | string | 是 | \`{symbol}\` |

## 订阅响应

\`\`\`json
{
  "id": "clientID2",
  "event": "subscribe",
  "success": true,
  "ts": 1609924478533
}
\`\`\`

## 订单簿数据

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
    title: "订单簿更新",
    content: `# 订单簿更新

\`{symbol}@orderbookupdate\` 更新的订单簿每 200 毫秒推送

## 订阅请求

\`\`\`json
{
  "id": "clientID2",
  "topic": "PERP_NEAR_USDC@orderbookupdate",
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

推送间隔: 10 毫秒

## 订阅请求

\`\`\`json
{
  "id": "clientID5",
  "topic": "PERP_WOO_USDC@bbo",
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
  "id": "clientID5",
  "event": "subscribe",
  "success": true,
  "ts": 1609924478533
}
\`\`\`

## BBO 数据

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
    title: "所有 BBO",
    content: `# 所有 BBO

推送间隔: 1 秒

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
    title: "请求订单簿",
    content: `# 请求订单簿

使用请求/响应模式而非订阅方式请求特定交易对的订单簿快照。

## 请求

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

## 参数

| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | string | 是 | 客户端生成的 ID |
| event | string | 是 | \`request\` |
| params.type | string | 是 | \`orderbook\` |
| params.symbol | string | 是 | 交易对符号 |

## 响应

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
  "id": "clientID3",
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
  "id": "clientID3",
  "event": "subscribe",
  "success": true,
  "ts": 1609924478533
}
\`\`\`

## 余额数据

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
    title: "仓位推送",
    content: `# 仓位推送

推送间隔: 有更新时推送

> **注意**: 需要先进行 [认证](#ws-authentication)

## 订阅请求

\`\`\`json
{
  "id": "clientID3",
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
  "id": "clientID3",
  "event": "subscribe",
  "success": true,
  "ts": 1682244308139
}
\`\`\`

## 仓位数据

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
    title: "执行报告",
    content: `# 执行报告

推送间隔: 实时推送

> **注意**: 需要先进行 [认证](#ws-authentication)

## 订阅请求

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

## 参数

| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | string | 是 | 客户端生成的 ID |
| event | string | 是 | \`subscribe\`/\`unsubscribe\` |
| topic | string | 是 | \`executionreport\` |
| params | object | 否 | 默认为所有交易对 |
| params.symbol | string | 否 | 交易对，逗号分隔 |

## 订阅响应

\`\`\`json
{
  "id": "clientID3",
  "event": "subscribe",
  "success": true,
  "ts": 1609924478533
}
\`\`\`

## 执行报告数据

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
