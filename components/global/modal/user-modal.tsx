"use client";

import React from "react";
import { User } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Use the default input props type for ReadOnlyInput
type InputProps = React.ComponentProps<"input">;
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRescuerClient } from "@/lib/client-request/rescuer-user";

interface UserModalProps {
  user: User | null;
  onClose: () => void;
  onUpdated?: () => void; // optional callback after successful update
  getStatusColor?: (status: string) => string; // optional styling helper
}

const ReadOnlyInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      className={`cursor-default ring-0 focus-visible:ring-0 placeholder:text-muted-foreground ${className}`}
      readOnly
      ref={ref}
      {...props}
    />
  )
);
ReadOnlyInput.displayName = "ReadOnlyInput";

export const UserModal: React.FC<UserModalProps> = ({
  user,
  onClose,
  onUpdated,
}) => {
  const queryClient = useQueryClient(); // <-- get shared query client

  const [open, setOpen] = React.useState(false);
  const [userType, setUserType] = React.useState<User["user_type"]>("user");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      setUserType(user.user_type);
      setOpen(true);
      setError(null);
    } else {
      setOpen(false);
      setError(null);
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: () =>
      updateUserRescuerClient(user!.id, { user_type: userType }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["rescuers-users"] });

      const previousData = queryClient.getQueryData<{
        users: User[];
        rescuers: User[];
      }>(["rescuers-users"]);

      if (previousData) {
        queryClient.setQueryData(["rescuers-users"], {
          users: previousData.users.map((u) =>
            u.id === user!.id ? { ...u, user_type: userType } : u
          ),
          rescuers: previousData.rescuers.map((r) =>
            r.id === user!.id ? { ...r, user_type: userType } : r
          ),
        });
      }

      return { previousData };
    },
    onError: (err, _, context: any) => {
      setError(
        err instanceof Error ? err.message : "Failed to update user type"
      );
      if (context?.previousData) {
        queryClient.setQueryData(["rescuers-users"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["rescuers-users"] });
    },
    onSuccess: () => {
      onUpdated?.();
      setOpen(false);
      onClose();
    },
  });

  const handleSave = () => {
    setError(null);
    mutation.mutate();
  };

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update User Type</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Readonly user info with inputs for layout consistency */}
          <div>
            <Label htmlFor="name">Name</Label>
            <ReadOnlyInput id="name" value={user.name} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <ReadOnlyInput id="email" value={user.email} />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <ReadOnlyInput id="phone" value={user.phone_number} />
          </div>
          <div>
            <Label htmlFor="address">Barangay Address</Label>
            <ReadOnlyInput
              id="address"
              value={user.barangays?.address ?? "N/A"}
            />
          </div>
          <div>
            <Label htmlFor="currentUserType">Current User Type</Label>
            <ReadOnlyInput
              id="currentUserType"
              value={user.user_type}
              className={user.barangays?.address ?? "N/A"}
            />
          </div>

          {/* Select to update user_type */}
          <div>
            <Label htmlFor="userTypeSelect">Change User Type</Label>
            <Select
              value={userType}
              onValueChange={(value) => setUserType(value as User["user_type"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="rescuer">Rescuer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-600 mt-2" role="alert">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
              setOpen(false);
              onClose();
            }}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            onClick={handleSave}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
