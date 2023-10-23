"use client";

import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

type Props = {
  children: React.ReactNode;
};

function ReactQuery({ children }: Props) {
  const [client] = React.useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: false,
        },
      },
    }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export default ReactQuery;
