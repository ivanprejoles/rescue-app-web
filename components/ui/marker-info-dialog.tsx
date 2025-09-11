import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MarkerInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  marker: any; // your marker type here
  onSave: (updatedMarker: any) => void;
}

const urgencyOptions = ["Low", "Medium", "High", "Critical"];

export function MarkerInfoDialog({
  open,
  onOpenChange,
  marker,
  onSave,
}: MarkerInfoDialogProps) {
  const [formData, setFormData] = useState(marker);

  useEffect(() => {
    setFormData(marker);
  }, [marker]);

  function handleChange(field: string, value: any) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleAdditionalInfoChange(field: string, value: any) {
    setFormData((prev) => ({
      ...prev,
      additional_info: {
        ...prev.additional_info,
        [field]: value,
      },
    }));
  }

  function handleSubmit() {
    onSave(formData);
    onOpenChange(false);
  }

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Marker Info</DialogTitle>
          <DialogDescription>
            Update the details for{" "}
            <strong>{formData.name || "Unnamed Marker"}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Marker name"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Marker description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Input
              id="status"
              value={formData.status || ""}
              onChange={(e) => handleChange("status", e.target.value)}
              placeholder="Status"
            />
          </div>

          <div>
            <Label htmlFor="urgency">Urgency</Label>
            <Select
              value={formData.additional_info?.urgency || ""}
              onValueChange={(val) =>
                handleAdditionalInfoChange("urgency", val)
              }
            >
              <SelectTrigger id="urgency" className="w-full">
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                {urgencyOptions.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
