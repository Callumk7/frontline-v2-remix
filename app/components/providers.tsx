import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { PlaylistDialogOpenProvider, TooltipProvider } from ".";

export function Providers({ children }: { children: React.ReactNode }) {
  // It is important to create the queryClient instance inside of our app, within react state.
  // We do not want to accidently share data between users.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <PlaylistDialogOpenProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </PlaylistDialogOpenProvider>
    </QueryClientProvider>
  );
}
