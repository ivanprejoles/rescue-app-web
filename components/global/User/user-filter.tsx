import { FC } from "react";
import { Input } from "@/components/ui/input";

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export const UserFilters: FC<UserFiltersProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 my-4">
      <Input
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1"
      />
    </div>
  );
};
