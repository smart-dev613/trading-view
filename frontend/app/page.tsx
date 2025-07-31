"use client";

import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { motion } from "framer-motion";
import {
    FiTrendingUp,
    FiTrendingDown,
    FiDollarSign,
    FiActivity,
    FiDroplet,
} from "react-icons/fi";
import TokenCard from "./components/TokenCard";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ComposedChart, Bar } from "recharts";

// GraphQL Query
const GET_TOKENS = gql`
    query GetTokens {
        tokens {
            id
            name
            symbol
            price
            priceChange24h
            volume30min
            liquidity
            marketCap
        }
    }
`;

interface Token {
    id: string;
    name: string;
    symbol: string;
    price: number;
    priceChange24h: number;
    volume30min: number;
    liquidity: number;
    marketCap: number;
}

export default function Home() {
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);
    const { data: tokensData, loading, error } = useQuery(GET_TOKENS, {
        pollInterval: 3000, // Poll every 3 seconds for real-time updates
        fetchPolicy: 'cache-and-network', // Always fetch fresh data
    });

    // Update selected token when data changes
    useEffect(() => {
        if (selectedToken && tokensData?.tokens) {
            const updatedToken = tokensData.tokens.find((t: Token) => t.id === selectedToken.id);
            if (updatedToken) {
                setSelectedToken(updatedToken);
            }
        }
    }, [tokensData, selectedToken]);

    const formatNumber = (num: number) => {
        if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
        if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
        if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
        return num.toFixed(2);
    };

    const formatPrice = (price: number) => {
        if (price < 0.01) return price.toFixed(8);
        if (price < 1) return price.toFixed(4);
        return price.toFixed(2);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#18181c]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-400">
                        Loading Solana token data...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#18181c]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        Error Loading Data
                    </h2>
                    <p className="text-gray-400">{error.message}</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Make sure the backend server is running on port 4000
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#18181c] flex flex-row items-stretch justify-center py-10 px-2 md:px-10 gap-6">
            {/* Real-time indicator */}
            <div className="absolute top-4 right-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Live</span>
            </div>
            
            {/* Left: Token List */}
            <div className="w-1/2 max-w-md">
                {tokensData.tokens.map((token: Token) => (
                    <div
                        key={token.id}
                        onClick={() => setSelectedToken(token)}
                        className="cursor-pointer"
                    >
                        <TokenCard
                            name={token.name}
                            symbol={token.symbol}
                            price={token.price}
                            priceChange24h={token.priceChange24h}
                            amount={0}
                            // logoUrl={token.logoUrl}
                        />
                    </div>
                ))}
            </div>
            {/* Right: Chart */}
            <div className="w-1/2 flex items-center justify-center">
                {selectedToken ? <TokenChart token={selectedToken} /> : <div className="text-gray-400 text-lg text-center w-full">Select a token to view its chart</div>}
            </div>
        </div>
    );
}

// Token Chart Component
function TokenChart({ token }: { token: Token }) {
    const [chartData, setChartData] = useState<any[]>([]);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    // Generate mock candlestick data
    const generateCandlestickData = () => {
        const data = [];
        let currentPrice = token.price;
        const baseTime = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago

        for (let i = 0; i < 144; i++) { // 144 candlesticks (10-minute intervals for 24 hours)
            const time = new Date(baseTime + i * 10 * 60 * 1000);
            const volatility = 0.02; // 2% volatility
            
            // Generate OHLC data
            const open = currentPrice;
            const high = open * (1 + Math.random() * volatility);
            const low = open * (1 - Math.random() * volatility);
            const close = low + Math.random() * (high - low);
            
            // Update current price for next iteration
            currentPrice = close;
            
            data.push({
                time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: time.getTime(),
                open: open,
                high: high,
                low: low,
                close: close,
                volume: Math.random() * 1000000 + 500000, // Random volume
            });
        }
        return data;
    };

    // Initialize chart data
    useEffect(() => {
        setChartData(generateCandlestickData());
    }, [token]);

    // Real-time chart updates
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdate(new Date());
            
            // Update the latest candlestick with new price data
            setChartData(prevData => {
                if (prevData.length === 0) return prevData;
                
                const newData = [...prevData];
                const lastCandle = newData[newData.length - 1];
                
                // Simulate price movement
                const volatility = 0.005; // 0.5% volatility for real-time updates
                const priceChange = (Math.random() - 0.5) * volatility;
                const newClose = lastCandle.close * (1 + priceChange);
                const newHigh = Math.max(lastCandle.high, newClose);
                const newLow = Math.min(lastCandle.low, newClose);
                
                // Update the last candlestick
                newData[newData.length - 1] = {
                    ...lastCandle,
                    close: newClose,
                    high: newHigh,
                    low: newLow,
                    volume: lastCandle.volume + Math.random() * 10000,
                };
                
                return newData;
            });
        }, 2000); // Update every 2 seconds

        return () => clearInterval(interval);
    }, []);

    const latestCandle = chartData[chartData.length - 1];
    const priceChange = latestCandle ? latestCandle.close - latestCandle.open : 0;
    const priceChangePercent = latestCandle ? (priceChange / latestCandle.open) * 100 : 0;

    return (
        <div className="w-full h-full bg-gray-900 rounded-lg border border-gray-700">
            {/* Chart Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <div className="flex items-center space-x-4">
                    <div>
                        <h3 className="text-white font-bold text-lg">{token.symbol}USD.P</h3>
                        <p className="text-gray-400 text-sm">10 - DELTAIN</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-white font-bold text-lg">
                        ${latestCandle?.close.toFixed(4) || token.price.toFixed(4)}
                    </div>
                    <div className={`text-sm font-semibold ${priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(4)} ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
                    </div>
                    <div className="text-xs text-gray-400">
                        Last update: {lastUpdate.toLocaleTimeString()}
                    </div>
                </div>
            </div>

            {/* OHLC Info */}
            <div className="flex justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 text-xs">
                <div className="flex space-x-6">
                    <div>
                        <span className="text-gray-400">O</span>
                        <span className="text-white ml-1">{latestCandle?.open.toFixed(4) || '0.0000'}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">H</span>
                        <span className="text-white ml-1">{latestCandle?.high.toFixed(4) || '0.0000'}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">L</span>
                        <span className="text-white ml-1">{latestCandle?.low.toFixed(4) || '0.0000'}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">C</span>
                        <span className="text-white ml-1">{latestCandle?.close.toFixed(4) || '0.0000'}</span>
                    </div>
                </div>
                <div className="text-gray-400">
                    Vol: {latestCandle?.volume.toLocaleString() || '0'}
                </div>
            </div>

            {/* Chart Area */}
            <div className="p-4 h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <XAxis 
                            dataKey="time" 
                            minTickGap={30} 
                            tick={{ fontSize: 10, fill: '#9CA3AF' }}
                            axisLine={{ stroke: '#374151' }}
                            tickLine={{ stroke: '#374151' }}
                        />
                        <YAxis 
                            domain={['auto', 'auto']} 
                            tick={{ fontSize: 12, fill: '#9CA3AF' }}
                            axisLine={{ stroke: '#374151' }}
                            tickLine={{ stroke: '#374151' }}
                            orientation="right"
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#1F2937', 
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#F9FAFB'
                            }}
                            formatter={(value: number, name: string) => [
                                `$${value.toFixed(4)}`,
                                name === 'close' ? 'Close' : name === 'volume' ? 'Volume' : name
                            ]}
                        />
                        
                        {/* Candlestick-like visualization using bars */}
                        <Bar 
                            dataKey="close" 
                            fill="#10B981" 
                            stroke="#10B981"
                            strokeWidth={1}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Chart Footer */}
            <div className="flex justify-between items-center p-4 border-t border-gray-700">
                <div className="text-gray-400 text-sm">
                    BE-IA-V0.0 {latestCandle?.volume.toLocaleString() || '0'} {latestCandle?.close.toFixed(4) || '0.0000'}
                </div>
                <div className="text-gray-400 text-xs">
                    TradingView
                </div>
            </div>
        </div>
    );
}
