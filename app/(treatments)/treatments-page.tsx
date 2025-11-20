"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TreatmentEmptyState } from "@/components/treatments/treatment-empty-state";
import { TreatmentErrorState } from "@/components/treatments/treatment-error-state";
import { TreatmentPagination } from "@/components/treatments/treatment-pagination";
import { TreatmentsGrid } from "@/components/treatments/treatments-grid";
import { TreatmentsLayout } from "@/components/treatments/treatments-layout";
import { useDebounce } from "@/hooks/use-debounce";
import { useTreatmentsQuery } from "@/hooks/use-treatments-query";
import { buildSearchParams, getFiltersFromSearchParams } from "@/lib/url-state";
import type { TreatmentStatus } from "@/lib/treatments-schema";

export const TreatmentsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = getFiltersFromSearchParams(searchParams);
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(localSearch, 400);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useTreatmentsQuery({
      search: debouncedSearch,
      status: filters.status,
      page: filters.page,
      pageSize: filters.pageSize,
    });

  const updateUrl = useCallback(
    (newFilters: Partial<typeof filters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      const params = buildSearchParams(updatedFilters);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [filters, router]
  );

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      const params = buildSearchParams({
        ...filters,
        search: debouncedSearch,
        page: 1,
      });
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [debouncedSearch, filters, router]);

  const handleSearchChange = useCallback((search: string) => {
    setLocalSearch(search);
  }, []);

  const handleStatusChange = useCallback(
    (status: TreatmentStatus | "all") => {
      updateUrl({ status, page: 1 });
    },
    [updateUrl]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateUrl({ page });
    },
    [updateUrl]
  );

  const handleClearFilters = useCallback(() => {
    updateUrl({ search: "", status: "all", page: 1 });
  }, [updateUrl]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const hasFilters = filters.search !== "" || filters.status !== "all";
  const hasData = data && data.data.length > 0;

  return (
    <TreatmentsLayout
      search={localSearch}
      status={filters.status}
      onSearchChange={handleSearchChange}
      onStatusChange={handleStatusChange}
      isSearching={isFetching && !isLoading}
    >
      <div className="flex flex-col gap-4">
        {data && (
          <div className="text-sm text-muted-foreground">
            Showing {data.data.length} of {data.total} treatments
          </div>
        )}

        {isError && error ? (
          <TreatmentErrorState error={error} onRetry={handleRetry} />
        ) : !hasData && !isLoading ? (
          <TreatmentEmptyState
            hasFilters={hasFilters}
            onClearFilters={handleClearFilters}
          />
        ) : (
          <TreatmentsGrid treatments={data?.data || []} isLoading={isLoading} />
        )}

        {data && data.totalPages > 1 && (
          <TreatmentPagination
            currentPage={data.page}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </TreatmentsLayout>
  );
};
