"use client";

import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { motion } from "framer-motion";
import {
    FiPlus,
    FiMinus,
    FiDollarSign,
    FiTrendingUp,
    FiTrendingDown,
} from "react-icons/fi";
import toast from "react-hot-toast";

const ADD_TO_PORTFOLIO = gql`
    mutation AddToPortfolio($tokenId: ID!, $amount: Float!) {
        addToPortfolio(tokenId: $tokenId, amount: $amount) {
            id
            username
            portfolio {
                tokenId
                symbol
                amount
                value
            }
        }
    }
`;

const REMOVE_FROM_PORTFOLIO = gql`
    mutation RemoveFromPortfolio($tokenId: ID!) {
        removeFromPortfolio(tokenId: $tokenId) {
            id
            username
            portfolio {
                tokenId
                symbol
                amount
                value
            }
        }
    }
`;

interface PortfolioItem {
    tokenId: string;
    symbol: string;
    amount: number;
    value: number;
}

interface PortfolioProps {
    portfolio: PortfolioItem[];
    onPortfolioUpdate: (portfolio: PortfolioItem[]) => void;
    availableTokens: any[];
}

export default function Portfolio({
    portfolio,
    onPortfolioUpdate,
    availableTokens,
}: PortfolioProps) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedToken, setSelectedToken] = useState("");
    const [amount, setAmount] = useState("");

    const [addToPortfolio] = useMutation(ADD_TO_PORTFOLIO);
    const [removeFromPortfolio] = useMutation(REMOVE_FROM_PORTFOLIO);

    const handleAddToPortfolio = async () => {
        if (!selectedToken || !amount || parseFloat(amount) <= 0) {
            toast.error("Please select a token and enter a valid amount");
            return;
        }

        try {
            const { data } = await addToPortfolio({
                variables: {
                    tokenId: selectedToken,
                    amount: parseFloat(amount),
                },
            });

            onPortfolioUpdate(data.addToPortfolio.portfolio);
            setShowAddForm(false);
            setSelectedToken("");
            setAmount("");
            toast.success("Added to portfolio!");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleRemoveFromPortfolio = async (tokenId: string) => {
        try {
            const { data } = await removeFromPortfolio({
                variables: { tokenId },
            });

            onPortfolioUpdate(data.removeFromPortfolio.portfolio);
            toast.success("Removed from portfolio!");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const totalValue = portfolio.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="card">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Portfolio</h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="btn-primary flex items-center">
                    <FiPlus className="mr-2" />
                    Add Token
                </button>
            </div>

            {/* Portfolio Summary */}
            <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-600">Total Value</p>
                        <p className="text-2xl font-bold text-primary-600">
                            ${totalValue.toLocaleString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Holdings</p>
                        <p className="text-lg font-semibold">
                            {portfolio.length} tokens
                        </p>
                    </div>
                </div>
            </div>

            {/* Add Token Form */}
            {showAddForm && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold mb-4">
                        Add Token to Portfolio
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Token
                            </label>
                            <select
                                value={selectedToken}
                                onChange={(e) =>
                                    setSelectedToken(e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                <option value="">Choose a token</option>
                                {availableTokens.map((token) => (
                                    <option key={token.id} value={token.id}>
                                        {token.name} ({token.symbol})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Amount
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleAddToPortfolio}
                                className="btn-primary w-full">
                                Add
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Portfolio Items */}
            <div className="space-y-4">
                {portfolio.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-4">📊</div>
                        <h3 className="text-lg font-semibold mb-2">
                            Empty Portfolio
                        </h3>
                        <p className="text-gray-600">
                            Add some tokens to start tracking your investments!
                        </p>
                    </div>
                ) : (
                    portfolio.map((item) => (
                        <motion.div
                            key={item.tokenId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                        <FiDollarSign className="text-primary-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">
                                            {item.symbol}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {item.amount.toFixed(4)} tokens
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">
                                        ${item.value.toLocaleString()}
                                    </p>
                                    <div className="flex items-center justify-end space-x-2">
                                        <FiTrendingUp className="text-success-600" />
                                        <span className="text-sm text-success-600">
                                            +2.5%
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() =>
                                        handleRemoveFromPortfolio(item.tokenId)
                                    }
                                    className="text-red-600 hover:text-red-700 p-2">
                                    <FiMinus />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
