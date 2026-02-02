import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { defaultOptions } from "../config/queryConfig";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        ...defaultOptions
      }
    }
  })
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}