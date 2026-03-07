# DEXLESS API Documentation

Official API documentation for DEXLESS - A decentralized exchange powered by Orderly Network.

## Features

- ✨ Modern and professional UI/UX design
- 🌐 Multi-language support (English, 简体中文)
- 🌓 Dark mode support with smooth transitions
- 🔍 Real-time search functionality
- 📱 Fully responsive design with mobile-optimized navigation
- 📱 Hamburger menu for mobile devices (tablets & phones)
- 🎨 Syntax highlighting for code examples
- 📑 Auto-generated table of contents
- ⌨️ Keyboard shortcuts support
- 🚀 Static site - no server required

## Quick Start

### Method 1: Direct Open (Simplest)

Simply open `index.html` in your browser.

### Method 2: Local Server (Recommended)

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve
```

Then open browser to `http://localhost:8000`

## Language Support

The documentation is available in two languages:
- **English** - Default language
- **简体中文** - Simplified Chinese

Switch languages using the language switcher in the top navigation bar.

## File Structure

```
.
├── index.html                      # Main HTML file
├── styles.css                      # CSS styles with dark mode support
├── app.js                          # Application logic and navigation
├── docs-data-en.js                 # English documentation content
├── docs-data-zh-CN.js              # Simplified Chinese documentation content
├── DEXLESS logo Black_White bg.png # Logo for light mode
├── DEXLESS logo white.png          # Logo for dark mode
├── vercel.json                     # Vercel deployment config
└── README.md                       # This file
```

## API Endpoints

### Mainnet
- REST API: `https://api.orderly.org/`
- WebSocket: `wss://ws-evm.orderly.org/ws/stream/{account_id}`

### Testnet
- REST API: `https://testnet-api.orderly.org`
- WebSocket: `wss://testnet-ws-evm.orderly.org/ws/stream/{account_id}`

## Documentation Coverage

### REST API (11 endpoints)

**Order Management**
- Create Order - with complete authentication headers and request examples
- Edit Order - full parameter tables and examples
- Cancel Order - query string parameters documented
- Batch Create Order - array structure examples

**Algo Orders**
- Create Algo Order - STOP, TRAILING_STOP, TP/SL examples
- Cancel Algo Order - complete headers documentation
- Edit Algo Order - all parameters explained

**Positions & Leverage**
- Get All Positions Info - detailed response fields table
- Get Position History - simplified parameters
- Get Leverage Setting - symbol-specific query
- Update Leverage Setting - validation logic included

**Market Information**
- Get Available Symbols - public endpoint, no auth required
- Get Predicted Funding Rates (All Markets) - complete response fields
- Get Predicted Funding Rate (One Market) - path parameter documented

**Authentication & Errors**
- API Authentication - Ed25519 signature generation guide
- Error Codes - comprehensive error code table

### WebSocket API (11 topics)

**Public Market Data**
- Orderbook - depth 100, 1s interval
- Order Book Update - 200ms updates with prevTs
- Trade - real-time trade feed
- BBO (Best Bid Offer) - 10ms updates
- BBOs (All markets) - 1s updates
- Request Orderbook - request/response pattern

**Private User Data**
- Account - with RWA fee rates
- Balance - 14+ balance fields documented
- Position Push - camelCase fields, real-time updates
- Execution Report - symbol filtering support

**Connection & Auth**
- WebSocket Introduction - complete topics categorization
- Authentication - URL-based and request-based auth
- PING/PONG - keep-alive mechanism
- Error Response - WebSocket error handling

## Key Features for API Integration

✅ **Complete Authentication Documentation**
- All private endpoints include required authentication headers:
  - `orderly-timestamp` - Millisecond timestamp
  - `orderly-account-id` - Account ID
  - `orderly-key` - API Key
  - `orderly-signature` - Ed25519 signature

✅ **Practical Request Examples**
- Real JSON examples that can be copied and used directly
- Both simple and complex scenarios covered

✅ **Clear Parameter Documentation**
- Parameter source clearly labeled (Query String / Request Body / Headers)
- Required vs optional parameters distinguished
- Type information and descriptions provided

✅ **Complete Response Structures**
- Detailed response field tables for complex endpoints
- Example responses for all endpoints

## Keyboard Shortcuts

- `Ctrl/Cmd + K` - Focus search box
- `Enter` (in search box) - Jump to first result
- `Esc` - Clear search and unfocus

## Technology Stack

- HTML5
- CSS3 (Custom styles, no framework)
- Vanilla JavaScript (ES6+)
- [Marked.js](https://marked.js.org/) - Markdown parser
- [Highlight.js](https://highlightjs.org/) - Code syntax highlighting

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Deployment

To deploy online, upload these files:
1. index.html
2. styles.css
3. app.js
4. docs-data-en.js
5. docs-data-zh-CN.js
6. DEXLESS logo Black_White bg.png (logo for light mode)
7. DEXLESS logo white.png (logo for dark mode)

Recommended free hosting platforms:
- **GitHub Pages**
- **Netlify**
- **Vercel**

## Customization

### Changing Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #10b981;
    /* ... */
}
```

### Adding New Documentation

1. Add new entry to appropriate `docs-data-*.js` file
2. Update navigation in `app.js` (generateNavigation method)
3. Test in both languages (English and 简体中文)

## License

© 2026 DEXLESS. All rights reserved.

## Support

For questions or suggestions, please contact the DEXLESS technical team.
