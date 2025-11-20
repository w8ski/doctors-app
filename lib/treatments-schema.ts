import { z } from "zod";

export const TreatmentStatusSchema = z.enum([
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
]);

export const TreatmentSchema = z.object({
  id: z.number(),
  patient: z.string(),
  procedure: z.string(),
  dentist: z.string(),
  date: z.string(),
  status: TreatmentStatusSchema.optional(),
  notes: z.string().optional(),
  cost: z.number().optional(),
});

export const TreatmentsListResponseSchema = z.object({
  data: z.array(TreatmentSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});

export const CreateTreatmentSchema = z.object({
  patient: z.string().min(1, "Patient name is required"),
  procedure: z.string().min(1, "Procedure is required"),
  dentist: z.string().min(1, "Dentist name is required"),
  date: z.string().min(1, "Date is required"),
  status: TreatmentStatusSchema.optional(),
  notes: z.string().optional(),
  cost: z.number().optional(),
});

export const UpdateTreatmentStatusSchema = z.object({
  status: TreatmentStatusSchema,
});

export type TreatmentStatus = z.infer<typeof TreatmentStatusSchema>;
export type Treatment = z.infer<typeof TreatmentSchema>;
export type TreatmentsListResponse = z.infer<
  typeof TreatmentsListResponseSchema
>;
export type CreateTreatmentInput = z.infer<typeof CreateTreatmentSchema>;
export type UpdateTreatmentStatusInput = z.infer<
  typeof UpdateTreatmentStatusSchema
>;
