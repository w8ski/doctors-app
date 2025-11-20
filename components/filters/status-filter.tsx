import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TreatmentStatus } from "@/lib/treatments-schema";

interface StatusFilterProps {
  value: TreatmentStatus | "all";
  onChange: (value: TreatmentStatus | "all") => void;
}

const STATUS_OPTIONS: Array<{ label: string; value: TreatmentStatus | "all" }> =
  [
    { label: "All", value: "all" },
    { label: "Scheduled", value: "scheduled" },
    { label: "In Progress", value: "in_progress" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

export const StatusFilter = ({ value, onChange }: StatusFilterProps) => {
  const handleValueChange = (newValue: string) => {
    onChange(newValue as TreatmentStatus | "all");
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="md:w-[220px]">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
