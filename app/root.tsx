import stylesheet from "@/tw.css";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: stylesheet }];

export default function App() {
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
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <html lang="en">
          <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <Meta />
            <Links />
          </head>
          <body className="bg-background text-foreground">
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </body>
        </html>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
