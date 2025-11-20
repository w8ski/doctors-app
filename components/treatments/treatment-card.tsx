import { useCallback, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useDeleteTreatmentMutation,
  useUpdateTreatmentStatusMutation,
} from "@/hooks/use-treatment-mutations";
import type { Treatment } from "@/lib/treatments-schema";
import { TreatmentStatusBadge } from "./treatment-status-badge";
import { TreatmentStatusSelect } from "./treatment-status-select";

interface TreatmentCardProps {
  treatment: Treatment;
}

export const TreatmentCard = ({ treatment }: TreatmentCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const updateStatusMutation = useUpdateTreatmentStatusMutation();
  const deleteMutation = useDeleteTreatmentMutation();

  const handleStatusChange = useCallback(
    (status: Treatment["status"]) => {
      if (!status) return;

      updateStatusMutation.mutate(
        { id: treatment.id, status },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
          },
        }
      );
    },
    [treatment.id, updateStatusMutation]
  );

  const handleOpenChange = useCallback((open: boolean) => {
    setIsDialogOpen(open);
  }, []);

  const handleDeleteClick = useCallback(() => {
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    deleteMutation.mutate(treatment.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  }, [deleteMutation, treatment.id]);

  const handleDeleteDialogChange = useCallback((open: boolean) => {
    setIsDeleteDialogOpen(open);
  }, []);

  return (
    <>
      <Card className="shadow-sm relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
          onClick={handleDeleteClick}
          aria-label="Delete treatment"
        >
          <X className="h-4 w-4" />
        </Button>
        <CardHeader>
          <CardTitle>{treatment.patient}</CardTitle>
          <CardDescription>{treatment.procedure}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-xs text-muted-foreground">Dentist</div>
            <div className="text-sm font-medium">{treatment.dentist}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Date</div>
            <div className="text-sm font-medium">{treatment.date}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Status</div>
            <div className="mt-1">
              <TreatmentStatusBadge status={treatment.status} />
            </div>
          </div>
          {treatment.notes && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {treatment.notes}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
          >
            Update status
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Treatment Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {treatment.patient} - {treatment.procedure}
              </p>
              <TreatmentStatusSelect
                value={treatment.status}
                onChange={handleStatusChange}
                disabled={updateStatusMutation.isPending}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Treatment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">
              Are you sure you want to delete this treatment for{" "}
              <span className="font-semibold">{treatment.patient}</span>?
            </p>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
