import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTreatmentsQuery } from "./use-treatments-query";
import { TestProviders, createTestQueryClient } from "@/test/test-utils";
import * as apiClient from "@/lib/api-client";

vi.mock("@/lib/api-client");

const mockTreatmentsResponse = {
  data: [
    {
      id: 1,
      patient: "John Doe",
      procedure: "Cleaning",
      dentist: "Dr. Smith",
      date: "2025-01-15",
      status: "scheduled" as const,
      cost: 100,
    },
    {
      id: 2,
      patient: "Jane Smith",
      procedure: "Filling",
      dentist: "Dr. Jones",
      date: "2025-01-20",
      status: "completed" as const,
      cost: 200,
    },
  ],
  total: 2,
  page: 1,
  pageSize: 9,
  totalPages: 1,
};

describe("useTreatmentsQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches treatments successfully", async () => {
    vi.mocked(apiClient.fetchJson).mockResolvedValue(mockTreatmentsResponse);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useTreatmentsQuery(), {
      wrapper: ({ children }) => (
        <TestProviders queryClient={queryClient}>{children}</TestProviders>
      ),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockTreatmentsResponse);
    expect(apiClient.fetchJson).toHaveBeenCalledWith(
      expect.stringContaining("/api/treatments"),
      expect.objectContaining({
        schema: expect.anything(),
        signal: expect.anything(),
      })
    );
  });

  it("builds correct URL with search parameter", async () => {
    vi.mocked(apiClient.fetchJson).mockResolvedValue(mockTreatmentsResponse);

    const queryClient = createTestQueryClient();
    renderHook(() => useTreatmentsQuery({ search: "John" }), {
      wrapper: ({ children }) => (
        <TestProviders queryClient={queryClient}>{children}</TestProviders>
      ),
    });

    await waitFor(() => {
      expect(apiClient.fetchJson).toHaveBeenCalledWith(
        expect.stringContaining("search=John"),
        expect.anything()
      );
    });
  });

  it("builds correct URL with status filter", async () => {
    vi.mocked(apiClient.fetchJson).mockResolvedValue(mockTreatmentsResponse);

    const queryClient = createTestQueryClient();
    renderHook(() => useTreatmentsQuery({ status: "completed" }), {
      wrapper: ({ children }) => (
        <TestProviders queryClient={queryClient}>{children}</TestProviders>
      ),
    });

    await waitFor(() => {
      expect(apiClient.fetchJson).toHaveBeenCalledWith(
        expect.stringContaining("status=completed"),
        expect.anything()
      );
    });
  });

  it("builds correct URL with pagination parameters", async () => {
    vi.mocked(apiClient.fetchJson).mockResolvedValue(mockTreatmentsResponse);

    const queryClient = createTestQueryClient();
    renderHook(() => useTreatmentsQuery({ page: 2, pageSize: 10 }), {
      wrapper: ({ children }) => (
        <TestProviders queryClient={queryClient}>{children}</TestProviders>
      ),
    });

    await waitFor(() => {
      expect(apiClient.fetchJson).toHaveBeenCalledWith(
        expect.stringContaining("page=2"),
        expect.anything()
      );
      expect(apiClient.fetchJson).toHaveBeenCalledWith(
        expect.stringContaining("pageSize=10"),
        expect.anything()
      );
    });
  });

  it("does not include status in URL when status is 'all'", async () => {
    vi.mocked(apiClient.fetchJson).mockResolvedValue(mockTreatmentsResponse);

    const queryClient = createTestQueryClient();
    renderHook(() => useTreatmentsQuery({ status: "all" }), {
      wrapper: ({ children }) => (
        <TestProviders queryClient={queryClient}>{children}</TestProviders>
      ),
    });

    await waitFor(() => {
      const callUrl = vi.mocked(apiClient.fetchJson).mock.calls[0][0] as string;
      expect(callUrl).not.toContain("status=");
    });
  });

  it("calls API with correct parameters", async () => {
    vi.mocked(apiClient.fetchJson).mockResolvedValue(mockTreatmentsResponse);

    const queryClient = createTestQueryClient();
    renderHook(
      () =>
        useTreatmentsQuery({ search: "test", status: "scheduled", page: 2 }),
      {
        wrapper: ({ children }) => (
          <TestProviders queryClient={queryClient}>{children}</TestProviders>
        ),
      }
    );

    await waitFor(() => {
      expect(apiClient.fetchJson).toHaveBeenCalledWith(
        expect.stringContaining("search=test"),
        expect.objectContaining({
          schema: expect.anything(),
          signal: expect.anything(),
        })
      );
    });
  });
});
