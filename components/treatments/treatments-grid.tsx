import type { Treatment } from "@/lib/treatments-schema";
import { TreatmentCard } from "./treatment-card";
import { TreatmentSkeleton } from "./treatment-skeleton";

interface TreatmentsGridProps {
  treatments: Treatment[];
  isLoading?: boolean;
}

export const TreatmentsGrid = ({
  treatments,
  isLoading,
}: TreatmentsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <TreatmentSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {treatments.map((treatment) => (
        <TreatmentCard key={treatment.id} treatment={treatment} />
      ))}
    </div>
  );
};
