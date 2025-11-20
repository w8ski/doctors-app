import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTreatmentMutation } from "@/hooks/use-treatment-mutations";
import {
  CreateTreatmentSchema,
  type CreateTreatmentInput,
} from "@/lib/treatments-schema";
import { TreatmentStatusSelect } from "./treatment-status-select";

export const AddTreatmentDialog = () => {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateTreatmentMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateTreatmentInput>({
    resolver: zodResolver(CreateTreatmentSchema),
    defaultValues: {
      status: "scheduled",
    },
  });

  const onSubmit = (data: CreateTreatmentInput) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Add treatment</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add treatment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="patient">
              Patient <span className="text-destructive">*</span>
            </Label>
            <Input
              id="patient"
              placeholder="Jane Doe"
              {...register("patient")}
              aria-invalid={!!errors.patient}
            />
            {errors.patient && (
              <p className="text-sm text-destructive">
                {errors.patient.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="procedure">
              Procedure <span className="text-destructive">*</span>
            </Label>
            <Input
              id="procedure"
              placeholder="Filling"
              {...register("procedure")}
              aria-invalid={!!errors.procedure}
            />
            {errors.procedure && (
              <p className="text-sm text-destructive">
                {errors.procedure.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dentist">
              Dentist <span className="text-destructive">*</span>
            </Label>
            <Input
              id="dentist"
              placeholder="Dr. Smith"
              {...register("dentist")}
              aria-invalid={!!errors.dentist}
            />
            {errors.dentist && (
              <p className="text-sm text-destructive">
                {errors.dentist.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">
              Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="date"
              type="date"
              {...register("date")}
              aria-invalid={!!errors.date}
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TreatmentStatusSelect
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cost">Cost</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("cost", { valueAsNumber: true })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any treatment notes"
              {...register("notes")}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Saving..." : "Save treatment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
