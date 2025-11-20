import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import {
  TreatmentsListResponseSchema,
  type TreatmentsListResponse,
  type TreatmentStatus,
} from "@/lib/treatments-schema";

interface UseTreatmentsQueryParams {
  search?: string;
  status?: TreatmentStatus | "all";
  page?: number;
  pageSize?: number;
}

export const useTreatmentsQuery = (params: UseTreatmentsQueryParams = {}) => {
  const { search = "", status = "all", page = 1, pageSize = 9 } = params;

  const buildUrl = () => {
    const url = new URL("/api/treatments", window.location.origin);

    if (search) {
      url.searchParams.set("search", search);
    }

    if (status && status !== "all") {
      url.searchParams.set("status", status);
    }

    url.searchParams.set("page", page.toString());
    url.searchParams.set("pageSize", pageSize.toString());

    return url.toString();
  };

  return useQuery<TreatmentsListResponse>({
    queryKey: queryKeys.treatments.list({ search, status, page, pageSize }),
    queryFn: async () => {
      return fetchJson<TreatmentsListResponse>(buildUrl(), {
        schema: TreatmentsListResponseSchema,
      });
    },
    staleTime: 30000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
