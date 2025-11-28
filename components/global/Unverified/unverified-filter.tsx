import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface UnverifiedFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export const UnverifiedFilters: FC<UnverifiedFiltersProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 my-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search unverified users..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};
