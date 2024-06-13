"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";

export const QueryProvider = ({ children }: PropsWithChildren) => {
  const [queryclient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryclient}>{children}</QueryClientProvider>
  );
};
