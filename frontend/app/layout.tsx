import React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { ApolloProvider } from "./apollo-provider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Solana Token Aggregator",
    description:
        "Real-time Solana token data with charts and portfolio tracking",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ApolloProvider>
                    {children}
                    <Toaster position="top-right" />
                </ApolloProvider>
            </body>
        </html>
    );
}
