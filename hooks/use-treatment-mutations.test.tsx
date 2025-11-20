import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  useCreateTreatmentMutation,
  useUpdateTreatmentStatusMutation,
  useDeleteTreatmentMutation,
} from "./use-treatment-mutations";
import { TestProviders, createTestQueryClient } from "@/test/test-utils";
import * as apiClient from "@/lib/api-client";
import { toast } from "sonner";

vi.mock("@/lib/api-client");
vi.mock("sonner");

const mockTreatment = {
  id: 1,
  patient: "John Doe",
  procedure: "Cleaning",
  dentist: "Dr. Smith",
  date: "2025-01-15",
  status: "scheduled" as const,
  cost: 100,
};

describe("useCreateTreatmentMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates treatment successfully", async () => {
    vi.mocked(apiClient.fetchJson).mockResolvedValue(mockTreatment);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useCreateTreatmentMutation(), {
      wrapper: ({ children }) => (
        <TestProviders queryClient={queryClient}>{children}</TestProviders>
      ),
    });

    const createData = {
      patient: "John Doe",
      procedure: "Cleaning",
      dentist: "Dr. Smith",
      date: "2025-01-15",
      status: "scheduled" as const,
    };

    result.current.mutate(createData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiClient.fetchJson).toHaveBeenCalledWith("/api/treatments", {
      method: "POST",
      body: JSON.stringify(createData),
      schema: expect.anything(),
    });
    expect(toast.success).toHaveBeenCalledWith("Treatment created");
  });

  it("handles creation error", async () => {
    const error = new Error("Failed to create");
    vi.mocked(apiClient.fetchJson).mockRejectedValue(error);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useCreateTreatmentMutation(), {
      wrapper: ({ children }) => (
        <TestProviders queryClient={queryClient}>{children}</TestProviders>
      ),
    });

    result.current.mutate({
      patient: "John Doe",
      procedure: "Cleaning",
      dentist: "Dr. Smith",
      date: "2025-01-15",
      status: "scheduled",
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Failed to create");
  });
});

describe("useUpdateTreatmentStatusMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates treatment status successfully", async () => {
    const updatedTreatment = { ...mockTreatment, status: "completed" as const };
    vi.mocked(apiClient.fetchJson).mockResolvedValue(updatedTreatment);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useUpdateTreatmentStatusMutation(), {
      wrapper: ({ children }) => (
        <TestProviders queryClient={queryClient}>{children}</TestProviders>
      ),
    });

    result.current.mutate({ id: 1, status: "completed" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiClient.fetchJson).toHaveBeenCalledWith("/api/treatments/1", {
      method: "PATCH",
      body: JSON.stringify({ status: "completed" }),
      schema: expect.anything(),
    });
  });

  it("invalidates queries on success", async () => {
    const updatedTreatment = { ...mockTreatment, status: "completed" as const };
    vi.mocked(apiClient.fetchJson).mockResolvedValue(updatedTreatment);

    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateTreatmentStatusMutation(), {
      wrapper: ({ children }) => (
        <TestProviders queryClient={queryClient}>{children}</TestProviders>
      ),
    });

    result.current.mutate({ id: 1, status: "completed" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["treatments", "list"],
    });
  });

  it("rolls back on error", async () => {
    const error = new Error("Update failed");
    vi.mocked(apiClient.fetchJson).mockRejectedValue(error);

    const queryClient = createTestQueryClient();
    const originalData = {
      data: [mockTreatment],
      total: 1,
      page: 1,
      pageSize: 9,
      totalPages: 1,
    };
    queryClient.setQueryData(["treatments", "list"], originalData);

    const { result } = renderHook(() => useUpdateTreatmentStatusMutation(), {
      wrapper: ({ children }) => (
        <TestProviders queryClient={queryClient}>{children}</TestProviders>
      ),
    });

    result.current.mutate({ id: 1, status: "completed" });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalled();
  });
});

describe("useDeleteTreatmentMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes treatment successfully", async () => {
    vi.mocked(apiClient.fetchJson).mockResolvedValue({ success: true });

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useDeleteTreatmentMutation(), {
      wrapper: ({ children }) => (
        <TestProviders queryClient={queryClient}>{children}</TestProviders>
      ),
    });

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiClient.fetchJson).toHaveBeenCalledWith("/api/treatments/1", {
      method: "DELETE",
    });
    expect(toast.success).toHaveBeenCalledWith("Treatment deleted");
  });

  it("invalidates queries after delete", async () => {
    vi.mocked(apiClient.fetchJson).mockResolvedValue({ success: true });

    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteTreatmentMutation(), {
      wrapper: ({ children }) => (
        <TestProviders queryClient={queryClient}>{children}</TestProviders>
      ),
    });

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["treatments", "list"],
    });
    expect(toast.success).toHaveBeenCalledWith("Treatment deleted");
  });

  it("handles delete error", async () => {
    const error = new Error("Delete failed");
    vi.mocked(apiClient.fetchJson).mockRejectedValue(error);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useDeleteTreatmentMutation(), {
      wrapper: ({ children }) => (
        <TestProviders queryClient={queryClient}>{children}</TestProviders>
      ),
    });

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Delete failed");
  });
});
