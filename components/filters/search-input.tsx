import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  isSearching?: boolean;
}

export const SearchInput = ({
  value,
  onChange,
  isSearching,
}: SearchInputProps) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  return (
    <div className="relative flex-1">
      <Input
        placeholder="Search patients, procedures, dentists..."
        value={value}
        onChange={handleChange}
      />
      {isSearching && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
};
