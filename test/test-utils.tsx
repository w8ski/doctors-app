import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface TestProvidersProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

export const TestProviders = ({
  children,
  queryClient = createTestQueryClient(),
}: TestProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
}

export const renderWithProviders = (
  ui: ReactElement,
  { queryClient, ...options }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <TestProviders queryClient={queryClient}>{children}</TestProviders>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

export * from "@testing-library/react";
