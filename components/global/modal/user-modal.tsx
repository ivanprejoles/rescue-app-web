"use client";

import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface UserModalProps {
  user: User | null;
  onClose: () => void;
  onUpdated?: () => void; // optional callback after successful update
  getStatusColor?: (status: string) => string; // optional styling helper
}

export const UserModal: React.FC<UserModalProps> = ({
  user,
  onClose,
  onUpdated,
  getStatusColor,
}) => {
  const [open, setOpen] = useState(false);
  const [userType, setUserType] = useState<User["user_type"]>("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUserType(user.user_type);
      setOpen(true);
    } else {
      setOpen(false);
      setError(null);
    }
  }, [user]);

  async function handleSave() {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${user.id}/updateUserType`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_type: userType }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update user type");
      }

      onUpdated?.();
      setOpen(false);
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

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

        <div className="space-y-6">
          {/* Readonly user info */}
          <div>
            <Label>Name</Label>
            <p className="rounded border px-3 py-2 bg-gray-50">{user.name}</p>
          </div>
          <div>
            <Label>Email</Label>
            <p className="rounded border px-3 py-2 bg-gray-50">{user.email}</p>
          </div>
          <div>
            <Label>Phone Number</Label>
            <p className="rounded border px-3 py-2 bg-gray-50">
              {user.phone_number}
            </p>
          </div>
          <div>
            <Label>Barangay Address</Label>
            <p className="rounded border px-3 py-2 bg-gray-50">
              {user.barangays?.address ?? "N/A"}
            </p>
          </div>
          <div>
            <Label>Current User Type</Label>
            <p
              className={`rounded border px-3 py-2 bg-gray-50 capitalize ${
                getStatusColor ? getStatusColor(user.status) : ""
              }`}
            >
              {user.user_type}
            </p>
          </div>

          {/* Select to update user_type */}
          <div>
            <Label htmlFor="userTypeSelect">Change User Type</Label>
            <Select
              id="userTypeSelect"
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

          {error && (
            <p className="text-sm text-red-600 mt-2" role="alert">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              onClose();
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
