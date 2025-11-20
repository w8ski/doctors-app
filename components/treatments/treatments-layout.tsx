import { SearchInput } from "@/components/filters/search-input";
import { StatusFilter } from "@/components/filters/status-filter";
import type { TreatmentStatus } from "@/lib/treatments-schema";
import { AddTreatmentDialog } from "./add-treatment-dialog";

interface TreatmentsLayoutProps {
  search: string;
  status: TreatmentStatus | "all";
  onSearchChange: (search: string) => void;
  onStatusChange: (status: TreatmentStatus | "all") => void;
  isSearching?: boolean;
  children: React.ReactNode;
}

export const TreatmentsLayout = ({
  search,
  status,
  onSearchChange,
  onStatusChange,
  isSearching,
  children,
}: TreatmentsLayoutProps) => {
  const handleSearchChange = (value: string) => {
    onSearchChange(value);
  };

  const handleStatusChange = (value: TreatmentStatus | "all") => {
    onStatusChange(value);
  };

  return (
    <div className="container mx-auto flex flex-col gap-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">DentalDesk</h1>
        <p className="text-sm text-muted-foreground">
          Track dental treatments and their status.
        </p>
      </header>

      <section className="flex flex-col gap-4 rounded-lg border bg-card/40 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
            <SearchInput
              value={search}
              onChange={handleSearchChange}
              isSearching={isSearching}
            />
            <StatusFilter value={status} onChange={handleStatusChange} />
          </div>
          <AddTreatmentDialog />
        </div>
      </section>

      {children}
    </div>
  );
};
