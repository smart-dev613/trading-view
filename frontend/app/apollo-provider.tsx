"use client";

import React from "react";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider as Provider,
    createHttpLink,
} from "@apollo/client";

const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql",
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

export function ApolloProvider({ children }: { children: React.ReactNode }) {
    return <Provider client={client}>{children}</Provider>;
}
