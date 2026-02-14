# DEXLESS API Documentation

Official API documentation for DEXLESS - A decentralized exchange powered by Orderly Network.

## Features

- ✨ Modern and professional UI/UX design
- 🌐 Multi-language support (English, 简体中文, 繁體中文)
- 🔍 Real-time search functionality
- 📱 Responsive design for all devices
- 🎨 Syntax highlighting for code examples
- 📑 Auto-generated table of contents
- ⌨️ Keyboard shortcuts support
- 🚀 Static site - no server required

## Quick Start

### Method 1: Direct Open (Simplest)

Simply double-click `index.html` to view in your browser.

### Method 2: Local Server (Recommended)

1. Double-click `start-server.bat` (Windows)
2. Or run: `python -m http.server 8000`
3. Open browser to `http://localhost:8000`

## Language Support

The documentation is available in two languages:
- **English** - Default language
- **简体中文** - Simplified Chinese

Switch languages using the language switcher in the top navigation bar.

## File Structure

```
.
├── index.html                # Main HTML file
├── styles.css               # CSS styles
├── app.js                   # Application logic
├── docs-data-en.js          # English documentation data
├── docs-data-zh-CN.js       # Simplified Chinese documentation data
├── README.md               # This file
└── 使用說明.txt            # Chinese instructions
```

## API Endpoints

### Mainnet
- REST API: `https://api.orderly.org/`
- WebSocket: `wss://ws-evm.orderly.org/ws/stream/{account_id}`

### Testnet
- REST API: `https://testnet-api.orderly.org`
- WebSocket: `wss://testnet-ws-evm.orderly.org/ws/stream/{account_id}`

## Documentation Coverage

### REST API (17 endpoints)
- Introduction & Authentication
- Order Management (Create, Cancel, Edit, Batch)
- Algo Orders (Stop Loss, Take Profit, etc.)
- Position & Leverage Management
- Market Info & Funding Rates

### WebSocket API (14 topics)
- Connection & Authentication
- Public Market Data (Orderbook, Trades, BBO)
- Private User Data (Account, Balance, Position, Execution Report)

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
6. DEXLESS logo Black_White bg.png (logo file)

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

© 2024 DEXLESS. All rights reserved.

## Support

For questions or suggestions, please contact the DEXLESS technical team.
