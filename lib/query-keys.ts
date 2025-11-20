import type { TreatmentStatus } from "./treatments-schema";

export const queryKeys = {
  treatments: {
    all: ["treatments"] as const,
    lists: () => [...queryKeys.treatments.all, "list"] as const,
    list: (filters: {
      search?: string;
      status?: TreatmentStatus | "all";
      page?: number;
      pageSize?: number;
    }) => [...queryKeys.treatments.lists(), filters] as const,
    detail: (id: number) =>
      [...queryKeys.treatments.all, "detail", id] as const,
  },
};
