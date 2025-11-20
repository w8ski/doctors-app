import { Button } from "@/components/ui/button";

interface TreatmentEmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export const TreatmentEmptyState = ({
  hasFilters,
  onClearFilters,
}: TreatmentEmptyStateProps) => {
  return (
    <div className="rounded-md border border-dashed p-12 text-center">
      <p className="text-sm text-muted-foreground mb-4">
        {hasFilters
          ? "No treatments found matching your filters"
          : "No treatments found"}
      </p>
      {hasFilters && (
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          Clear filters
        </Button>
      )}
    </div>
  );
};
