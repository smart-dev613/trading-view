# Solana Token Aggregator DApp

A comprehensive mini token aggregator DApp that provides real-time Solana token data through a GraphQL API, features beautiful charts, DID-style authentication, and portfolio tracking.

## 🚀 Features

### ✅ Core Features

-   **GraphQL API** with live Solana token data
-   **Real-time token information** with price, 24h change, volume, and liquidity
-   **DID-style authentication** with recovery phrases (no email/phone required)
-   **Mock portfolio tracker** for managing token holdings
-   **Beautiful, responsive UI** built with Next.js and Tailwind CSS
-   **TradingView chart integration** (mock implementation)

### 📊 Token Data Display

-   **Name & Symbol** for each token
-   **Current Price** with proper formatting
-   **24h Change (%)** with color coding (green for positive, red for negative)
-   **30-minute Volume** tracking
-   **Liquidity** information
-   **Market Cap** data

### 🔐 Authentication System

-   **Username + Password** authentication
-   **24-word recovery phrase** generation using BIP39
-   **Secure JWT tokens** for session management
-   **Recovery phrase confirmation** during registration

### 💼 Portfolio Management

-   **Add/Remove tokens** from portfolio
-   **Track holdings** and current values
-   **Portfolio summary** with total value
-   **Real-time updates** via GraphQL mutations

## 🛠️ Tech Stack

### Backend

-   **Node.js** with Express
-   **Apollo Server** for GraphQL API
-   **bcryptjs** for password hashing
-   **jsonwebtoken** for authentication
-   **bip39** for recovery phrase generation

### Frontend

-   **Next.js 14** with App Router
-   **React 18** with TypeScript
-   **Apollo Client** for GraphQL queries
-   **Tailwind CSS** for styling
-   **Framer Motion** for animations
-   **React Icons** for beautiful icons
-   **React Hot Toast** for notifications

## 📦 Installation

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Quick Start

1. **Clone and install dependencies:**

```bash
git clone <repository-url>
cd solana-token-aggregator
npm run install:all
```

2. **Start the development servers:**

```bash
npm run dev
```

This will start both the backend (port 4000) and frontend (port 3000) simultaneously.

### Manual Installation

If you prefer to install dependencies separately:

#### Backend Setup

```bash
cd backend
npm install
npm run dev
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🚀 Usage

### 1. Access the Application

-   Frontend: http://localhost:3000
-   GraphQL Playground: http://localhost:4000/graphql

### 2. Authentication Flow

1. **Register** with username and password
2. **Save the recovery phrase** (24 words) - this is crucial for account recovery
3. **Login** with your credentials
4. **Logout** when done

### 3. Token Data

-   View real-time token information in the grid layout
-   Click on any token to see detailed charts
-   Color-coded price changes (green = positive, red = negative)

### 4. Portfolio Management

-   Add tokens to your portfolio with specific amounts
-   Track your holdings and total portfolio value
-   Remove tokens from your portfolio
-   View portfolio performance

## 📊 GraphQL Schema

### Token Type

```graphql
type Token {
    id: ID!
    name: String!
    symbol: String!
    price: Float!
    priceChange24h: Float!
    volume30min: Float!
    liquidity: Float!
    marketCap: Float!
}
```

### User & Portfolio

```graphql
type User {
    id: ID!
    username: String!
    recoveryPhrase: String!
    portfolio: [PortfolioItem!]!
}

type PortfolioItem {
    tokenId: ID!
    symbol: String!
    amount: Float!
    value: Float!
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=4000
JWT_SECRET=your-secret-key-here
```

### GraphQL Endpoint

The GraphQL API is available at:

-   **Development**: http://localhost:4000/graphql
-   **Playground**: http://localhost:4000/graphql (Apollo Studio)

## 📁 Project Structure

```
solana-token-aggregator/
├── backend/
│   ├── src/
│   │   └── index.js          # GraphQL server
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   │   └── Portfolio.tsx # Portfolio component
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Main page
│   │   └── apollo-provider.tsx # Apollo Client setup
│   ├── tailwind.config.js
│   └── package.json
├── package.json
└── README.md
```

## 🎨 UI Features

### Design System

-   **Modern, clean interface** with Tailwind CSS
-   **Responsive design** for all screen sizes
-   **Smooth animations** with Framer Motion
-   **Color-coded indicators** for price changes
-   **Beautiful gradients** and shadows

### Components

-   **Token Cards** with hover effects
-   **Authentication Modals** with smooth transitions
-   **Portfolio Dashboard** with real-time updates
-   **Chart Placeholder** for TradingView integration
-   **Toast Notifications** for user feedback

## 🔮 Future Enhancements

### TradingView Integration

-   Replace mock chart with real TradingView widget
-   Add technical indicators
-   Implement real-time price feeds

### Solana Wallet Support

-   Integrate with Solana wallet adapters
-   Add wallet connection functionality
-   Support for real token transactions

### Real Data Integration

-   Connect to Solana RPC endpoints
-   Integrate with DEX APIs (Raydium, Orca)
-   Add real-time price feeds

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**

    ```bash
    # Kill processes on ports 3000 and 4000
    npx kill-port 3000 4000
    ```

2. **GraphQL connection errors**

    - Ensure backend is running on port 4000
    - Check CORS configuration
    - Verify Apollo Client setup

3. **Authentication issues**
    - Clear localStorage: `localStorage.clear()`
    - Check JWT token expiration
    - Verify bcrypt and JWT dependencies

### Development Tips

-   Use the GraphQL Playground for testing queries
-   Check browser console for Apollo Client errors
-   Monitor network tab for API requests
-   Use React DevTools for component debugging

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ for the Solana ecosystem**
