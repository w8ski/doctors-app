import type { TreatmentStatus } from "./treatments-schema";

export interface TreatmentFilters {
  search: string;
  status: TreatmentStatus | "all";
  page: number;
  pageSize: number;
}

export const DEFAULT_PAGE_SIZE = 9;

export const getFiltersFromSearchParams = (
  searchParams: URLSearchParams
): TreatmentFilters => {
  return {
    search: searchParams.get("search") || "",
    status: (searchParams.get("status") as TreatmentStatus | "all") || "all",
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE,
  };
};

export const buildSearchParams = (
  filters: Partial<TreatmentFilters>
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.status && filters.status !== "all") {
    params.set("status", filters.status);
  }

  if (filters.page && filters.page > 1) {
    params.set("page", filters.page.toString());
  }

  if (filters.pageSize && filters.pageSize !== DEFAULT_PAGE_SIZE) {
    params.set("pageSize", filters.pageSize.toString());
  }

  return params;
};
