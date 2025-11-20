import { Button } from "@/components/ui/button";

interface TreatmentErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export const TreatmentErrorState = ({
  error,
  onRetry,
}: TreatmentErrorStateProps) => {
  return (
    <div className="rounded-md border border-destructive/50 bg-destructive/10 p-12 text-center">
      <p className="text-sm text-destructive mb-4">
        {error.message || "Failed to load treatments"}
      </p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
};
