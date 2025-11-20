import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TreatmentStatus } from "@/lib/treatments-schema";

interface TreatmentStatusSelectProps {
  value?: TreatmentStatus;
  onChange: (status: TreatmentStatus) => void;
  disabled?: boolean;
}

const STATUS_OPTIONS: Array<{ label: string; value: TreatmentStatus }> = [
  { label: "Scheduled", value: "scheduled" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export const TreatmentStatusSelect = ({
  value,
  onChange,
  disabled,
}: TreatmentStatusSelectProps) => {
  const handleValueChange = (newValue: string) => {
    onChange(newValue as TreatmentStatus);
  };

  return (
    <Select value={value} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select status" />
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
