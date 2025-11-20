import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchJson } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import {
  TreatmentSchema,
  type Treatment,
  type CreateTreatmentInput,
  type UpdateTreatmentStatusInput,
  type TreatmentsListResponse,
} from "@/lib/treatments-schema";

export const useCreateTreatmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTreatmentInput) => {
      return fetchJson<Treatment>("/api/treatments", {
        method: "POST",
        body: JSON.stringify(data),
        schema: TreatmentSchema,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.treatments.lists(),
      });
      toast.success("Treatment created");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create treatment"
      );
    },
  });
};

export const useUpdateTreatmentStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: UpdateTreatmentStatusInput["status"];
    }) => {
      return fetchJson<Treatment>(`/api/treatments/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
        schema: TreatmentSchema,
      });
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.treatments.lists(),
      });

      const previousData = queryClient.getQueriesData<TreatmentsListResponse>({
        queryKey: queryKeys.treatments.lists(),
      });

      queryClient.setQueriesData<TreatmentsListResponse>(
        { queryKey: queryKeys.treatments.lists() },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            data: old.data.map((treatment) =>
              treatment.id === id ? { ...treatment, status } : treatment
            ),
          };
        }
      );

      return { previousData };
    },
    onError: (error, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(
        error instanceof Error
          ? error.message
          : "Couldn't update status, please try again."
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.treatments.lists(),
      });
    },
  });
};

export const useDeleteTreatmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return fetchJson<{ success: boolean }>(`/api/treatments/${id}`, {
        method: "DELETE",
      });
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.treatments.lists(),
      });

      const previousData = queryClient.getQueriesData<TreatmentsListResponse>({
        queryKey: queryKeys.treatments.lists(),
      });

      queryClient.setQueriesData<TreatmentsListResponse>(
        { queryKey: queryKeys.treatments.lists() },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            data: old.data.filter((treatment) => treatment.id !== id),
            total: old.total - 1,
          };
        }
      );

      return { previousData };
    },
    onSuccess: () => {
      toast.success("Treatment deleted");
    },
    onError: (error, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(
        error instanceof Error ? error.message : "Failed to delete treatment"
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.treatments.lists(),
      });
    },
  });
};
