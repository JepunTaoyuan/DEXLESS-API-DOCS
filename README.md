# DEXLESS API Documentation

Official API documentation for DEXLESS - A decentralized exchange powered by Orderly Network.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://dexless-api-docs.vercel.app)
[![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red)]()

## ✨ Features

- **🎨 Modern UI/UX Design** - Clean, professional interface with smooth animations
- **🌐 Multi-language Support** - English and Simplified Chinese (简体中文)
- **🌓 Dark Mode** - Automatic theme switching with persistent preference
- **🔍 Real-time Search** - Instant filtering of API endpoints and documentation
- **📱 Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **🎯 Navigation Hierarchy** - Three-tier menu structure with clear visual distinction
- **🎨 Syntax Highlighting** - Beautiful code examples with copy-to-clipboard
- **📑 Smart TOC** - Auto-generated table of contents with scroll tracking
- **⌨️ Keyboard Shortcuts** - Quick navigation with keyboard commands
- **🚀 Zero Dependencies** - Pure static site, no server required
- **🔖 Custom Favicon** - Brand consistency across all platforms

## 🚀 Quick Start

### Method 1: Direct Open (Simplest)

Simply open `index.html` in your browser - no server needed!

### Method 2: Local Development Server (Recommended)

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

## 📁 Project Structure

```
.
├── assets/
│   ├── favicons/              # Favicon files for all platforms
│   │   ├── favicon.ico        # Standard browser favicon
│   │   ├── favicon-16x16.png  # 16x16 PNG
│   │   ├── favicon-32x32.png  # 32x32 PNG
│   │   ├── apple-touch-icon.png         # iOS home screen icon
│   │   ├── android-chrome-192x192.png   # Android icon (small)
│   │   └── android-chrome-512x512.png   # Android icon (large)
│   └── logos/                 # Brand logos
│       ├── DEXLESS logo Black_White bg.png  # Light mode logo
│       └── DEXLESS logo white.png           # Dark mode logo
├── index.html                 # Main HTML entry point
├── app.js                     # Core application logic
├── styles.css                 # Complete stylesheet with theming
├── docs-data-en.js            # English documentation content
├── docs-data-zh-CN.js         # Simplified Chinese documentation content
├── site.webmanifest           # PWA manifest file
├── vercel.json                # Vercel deployment configuration
└── README.md                  # This file
```

## 🌐 API Endpoints

### Mainnet (Production)
- **REST API**: `https://api.orderly.org/`
- **WebSocket**: `wss://ws-evm.orderly.org/ws/stream/{account_id}`

### Testnet (Development)
- **REST API**: `https://testnet-api.orderly.org`
- **WebSocket**: `wss://testnet-ws-evm.orderly.org/ws/stream/{account_id}`

## 📚 Documentation Coverage

### REST API (13 Endpoints)

#### 🔐 Authentication & Errors
- **API Authentication** - Ed25519 signature generation guide with step-by-step examples
- **Error Codes** - Comprehensive error code reference table

#### 📋 Order Management
- **Create Order** - Complete authentication headers and request examples
- **Edit Order** - Full parameter tables with validation rules
- **Cancel Order** - Query string parameters documented
- **Batch Create Order** - Array structure examples and limitations

#### 🤖 Algo Orders
- **Create Algo Order** - STOP, TRAILING_STOP, POSITIONAL_TP_SL examples
- **Cancel Algo Order** - Complete headers documentation
- **Edit Algo Order** - All parameters explained with conditions

#### 💼 Positions & Leverage
- **Get All Positions Info** - Detailed response fields table
- **Get Position History** - Historical position data with timestamps
- **Get Current Holding** - Real-time holding information
- **Get Leverage Setting** - Symbol-specific leverage query
- **Update Leverage Setting** - Validation logic and limits

#### 📊 Market Information
- **Get Available Symbols** - Public endpoint, no authentication required
- **Get Predicted Funding Rates (All Markets)** - Complete response fields
- **Get Predicted Funding Rate (One Market)** - Path parameter documented

### WebSocket API (11 Topics)

#### 📡 Public Market Data
- **Orderbook** - Depth 100 snapshot, 1-second intervals
- **Order Book Update** - 200ms incremental updates with prevTs
- **Trade** - Real-time trade execution feed
- **BBO (Best Bid Offer)** - Ultra-fast 10ms updates
- **BBOs (All Markets)** - Multi-market BBO, 1-second updates
- **Request Orderbook** - Request/response pattern for on-demand data

#### 🔒 Private User Data (Authentication Required)
- **Account** - Account status with RWA fee rates
- **Balance** - 14+ balance fields with detailed documentation
- **Position Push** - Real-time position updates (camelCase fields)
- **Execution Report** - Order execution with symbol filtering

#### 🔌 Connection & Authentication
- **WebSocket Introduction** - Complete topics categorization and overview
- **Authentication** - URL-based and request-based auth methods
- **PING/PONG** - Keep-alive heartbeat mechanism
- **Error Response** - WebSocket-specific error handling

## 🎯 Key Features for Developers

### Complete Authentication Flow
All private endpoints include required authentication headers with practical examples:
- `orderly-timestamp` - Current timestamp in milliseconds
- `orderly-account-id` - Your account identifier
- `orderly-key` - Your Orderly API key
- `orderly-signature` - Ed25519 cryptographic signature

### Copy-Paste Ready Examples
- Real JSON request/response examples
- Complete curl command examples
- Python and JavaScript code snippets
- All examples are tested and production-ready

### Clear Parameter Documentation
- **Source Labeling**: Query String / Request Body / Path Parameter / Headers
- **Requirement Status**: Required / Optional / Conditional
- **Type Information**: string / number / boolean / array / object
- **Validation Rules**: Min/max values, length limits, regex patterns

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Focus search box |
| `Enter` | Jump to first search result |
| `Esc` | Clear search and blur |

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic markup structure |
| **CSS3** | Custom styling with CSS variables for theming |
| **Vanilla JavaScript** | No framework dependencies, pure ES6+ |
| **Marked.js** | Markdown to HTML parser |
| **Highlight.js** | Syntax highlighting for code blocks |

### Why No Framework?

- ⚡ **Lightning Fast** - No framework overhead, instant load times
- 📦 **Zero Build Step** - Direct deployment, no compilation needed
- 🔧 **Easy Maintenance** - Simple codebase, easy to understand and modify
- 🌐 **Maximum Compatibility** - Works everywhere, including local file systems

## 🌍 Browser Support

| Browser | Version |
|---------|---------|
| Chrome / Edge | Latest (recommended) |
| Firefox | Latest |
| Safari | Latest |
| Mobile Safari (iOS) | iOS 13+ |
| Chrome Mobile (Android) | Latest |

## 🚀 Deployment

### Automated Deployment (Vercel)

This repository is configured for automatic deployment on Vercel. Every push to `main` triggers a new deployment.

### Manual Deployment

Upload the entire directory to any static hosting service:

#### GitHub Pages
```bash
# Enable GitHub Pages in repository settings
# Select branch: main
# Select folder: / (root)
```

#### Netlify
```bash
# Drag and drop the folder to Netlify
# Or connect your GitHub repository for auto-deploy
```

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Required Files for Deployment
Make sure to include all files in the root directory and the `assets/` folder.

## 🎨 Customization Guide

### Changing Theme Colors

Edit CSS variables in `styles.css`:

```css
/* Light mode */
:root {
    --primary-color: #2563eb;      /* Main brand color */
    --secondary-color: #10b981;    /* Accent color */
    --background: #ffffff;         /* Page background */
    --surface: #f8fafc;           /* Card background */
}

/* Dark mode */
[data-theme="dark"] {
    --primary-color: #3b82f6;
    --secondary-color: #10b981;
    --background: #0f172a;
    --surface: #1e293b;
}
```

### Adding New API Documentation

1. **Edit Documentation Data**
   - Add new entry to `docs-data-en.js` for English
   - Add corresponding entry to `docs-data-zh-CN.js` for Chinese

2. **Update Navigation**
   - Open `app.js`
   - Find `generateNavigation()` method
   - Add new navigation link with appropriate `href="#your-page-id"`

3. **Test Both Languages**
   - Switch between English and Chinese
   - Verify content displays correctly
   - Check search functionality includes new content

### Updating Version (Cache Busting)

When you update files, increment version numbers in `index.html`:

```html
<link rel="stylesheet" href="styles.css?v=1.2.0">
<script src="app.js?v=1.2.0"></script>
<script src="docs-data-en.js?v=1.2.0"></script>
<script src="docs-data-zh-CN.js?v=1.2.0"></script>
```

Change `1.2.0` to `1.2.1` (or any new version) to force browsers to reload.

## 📱 Progressive Web App (PWA) Support

The site includes a `site.webmanifest` file for PWA capabilities:

- **Add to Home Screen** on mobile devices
- **Standalone App Mode** when launched from home screen
- **Custom Icons** for all platforms (iOS, Android, Desktop)

## 🔧 Troubleshooting

### Search Not Working
- Clear browser cache (Ctrl+Shift+Del)
- Verify `app.js` is loaded correctly
- Check browser console for JavaScript errors

### Favicon Not Showing
- Hard refresh the page (Ctrl+Shift+R / Cmd+Shift+R)
- Clear browser cache
- Wait 5-10 minutes for browser to update icon

### Styles Not Updating
- Hard refresh (Ctrl+Shift+R)
- Clear all browser data for the site
- Increment version number in `index.html` (see Customization Guide)

### Mobile Menu Not Working
- Ensure JavaScript is enabled
- Check if screen width is below 1024px
- Try in different browser

## 📊 Statistics

- **Total API Endpoints**: 24 (13 REST + 11 WebSocket)
- **Languages**: 2 (English, Simplified Chinese)
- **Total Lines of Documentation**: ~3,500 lines
- **Code Examples**: 50+ practical examples
- **Response Fields Documented**: 100+ fields with descriptions

## 🤝 Contributing

This is a documentation site for DEXLESS API. For API feature requests or bug reports, please contact the DEXLESS technical team.

For documentation improvements:
1. Update content in `docs-data-en.js` and `docs-data-zh-CN.js`
2. Test locally
3. Submit changes

## 📄 License

© 2026 DEXLESS. All rights reserved.

## 📞 Support

For questions, suggestions, or technical support:
- Visit [DEXLESS Official Website](https://dexless.io)
- Contact the DEXLESS technical team

---

**Built with** ❤️ **by the DEXLESS Team**

*Last updated: March 2026*
