const express = require("express");
// const { ApolloServer } = require("apollo-server-express");
// import { gql } from '@apollo/client';
const { ApolloServer, gql } = require("apollo-server-express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const bip39 = require("bip39");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

app.use(cors());
app.use(express.json());

// Mock token data
const mockTokens = [
    {
        id: "1",
        name: "Solana",
        symbol: "SOL",
        price: 98.45,
        priceChange24h: 5.23,
        volume30min: 1250000,
        liquidity: 45000000,
        marketCap: 45000000000,
    },
    {
        id: "2",
        name: "Raydium",
        symbol: "RAY",
        price: 0.85,
        priceChange24h: -2.15,
        volume30min: 850000,
        liquidity: 12000000,
        marketCap: 8500000000,
    },
    {
        id: "3",
        name: "Serum",
        symbol: "SRM",
        price: 0.12,
        priceChange24h: 8.45,
        volume30min: 320000,
        liquidity: 8000000,
        marketCap: 3200000000,
    },
    {
        id: "4",
        name: "Bonk",
        symbol: "BONK",
        price: 0.0000234,
        priceChange24h: 12.34,
        volume30min: 450000,
        liquidity: 1500000,
        marketCap: 2340000000,
    },
    {
        id: "5",
        name: "Jupiter",
        symbol: "JUP",
        price: 0.67,
        priceChange24h: -1.23,
        volume30min: 680000,
        liquidity: 9500000,
        marketCap: 6700000000,
    },
];

// Mock users storage
const users = new Map();

// GraphQL Schema
const typeDefs = gql`
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

    type AuthPayload {
        token: String!
        user: User!
    }

    type Query {
        tokens: [Token!]!
        token(id: ID!): Token
        me: User
    }

    type Mutation {
        register(username: String!, password: String!): AuthPayload!
        login(username: String!, password: String!): AuthPayload!
        addToPortfolio(tokenId: ID!, amount: Float!): User!
        removeFromPortfolio(tokenId: ID!): User!
    }
`;

// Resolvers
const resolvers = {
    Query: {
        tokens: () => mockTokens,
        token: (_, { id }) => mockTokens.find((token) => token.id === id),
        me: (_, __, { user }) => {
            if (!user) return null;
            return users.get(user.id);
        },
    },
    Mutation: {
        register: async (_, { username, password }) => {
            if (users.has(username)) {
                throw new Error("Username already exists");
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const recoveryPhrase = bip39.generateMnemonic(24);
            const userId = uuidv4();

            const user = {
                id: userId,
                username,
                password: hashedPassword,
                recoveryPhrase,
                portfolio: [],
            };

            users.set(username, user);

            const token = jwt.sign({ userId, username }, JWT_SECRET, {
                expiresIn: "7d",
            });

            return {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    recoveryPhrase: user.recoveryPhrase,
                    portfolio: user.portfolio,
                },
            };
        },
        login: async (_, { username, password }) => {
            const user = users.get(username);
            if (!user) {
                throw new Error("User not found");
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                throw new Error("Invalid password");
            }

            const token = jwt.sign({ userId: user.id, username }, JWT_SECRET, {
                expiresIn: "7d",
            });

            return {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    recoveryPhrase: user.recoveryPhrase,
                    portfolio: user.portfolio,
                },
            };
        },
        addToPortfolio: (_, { tokenId, amount }, { user }) => {
            if (!user) throw new Error("Not authenticated");

            const currentUser = users.get(user.username);
            const token = mockTokens.find((t) => t.id === tokenId);

            if (!token) throw new Error("Token not found");

            const existingItem = currentUser.portfolio.find(
                (item) => item.tokenId === tokenId
            );

            if (existingItem) {
                existingItem.amount += amount;
                existingItem.value = existingItem.amount * token.price;
            } else {
                currentUser.portfolio.push({
                    tokenId,
                    symbol: token.symbol,
                    amount,
                    value: amount * token.price,
                });
            }

            return {
                id: currentUser.id,
                username: currentUser.username,
                recoveryPhrase: currentUser.recoveryPhrase,
                portfolio: currentUser.portfolio,
            };
        },
        removeFromPortfolio: (_, { tokenId }, { user }) => {
            if (!user) throw new Error("Not authenticated");

            const currentUser = users.get(user.username);
            currentUser.portfolio = currentUser.portfolio.filter(
                (item) => item.tokenId !== tokenId
            );

            return {
                id: currentUser.id,
                username: currentUser.username,
                recoveryPhrase: currentUser.recoveryPhrase,
                portfolio: currentUser.portfolio,
            };
        },
    },
};

// Authentication middleware
const authenticateUser = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    try {
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, JWT_SECRET);
        return users.get(decoded.username);
    } catch (error) {
        return null;
    }
};

// Create Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
        user: authenticateUser(req),
    }),
});

async function startServer() {
    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });

    // Only listen in development
    app.listen(PORT, () => {
        console.log(
            `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
        );
        console.log(`📊 Token aggregator API running on port ${PORT}`);
    });
}

// Export the app for Vercel serverless functions
module.exports = app;

// Start server in development
startServer();
