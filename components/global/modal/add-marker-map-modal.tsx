"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";
import { useQueryClient } from "@tanstack/react-query";
import { MapData } from "@/lib/types";
const LocationPickerMap = dynamic(() => import("@/lib/map/location-picker"), {
  ssr: false, // disables server side rendering for this component
});

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  initialData = {},
  mode,
}) => {
  const [formData, setFormData] = React.useState<any>({
    type: mode === "marker" ? "" : undefined,
    description: mode === "marker" ? "" : undefined,
    name: mode === "evacuation" ? "" : undefined,
    address: mode === "evacuation" ? "" : undefined,
    phone: mode === "evacuation" ? "" : undefined,
    latitude: "",
    longitude: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(false);

  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!isOpen) return;
    if (mode === "marker" && initialData) {
      setFormData({
        type: initialData.type || "",
        description: initialData.description || "",
        latitude: String(initialData.latitude || ""),
        longitude: String(initialData.longitude || ""),
      });
    } else if (mode === "evacuation" && initialData) {
      setFormData({
        name: initialData.name || "",
        address: initialData.address || "",
        phone: initialData.phone || "",
        latitude: String(initialData.latitude || ""),
        longitude: String(initialData.longitude || ""),
      });
    } else {
      // Reset to empty
      setFormData((prev) => ({
        type: mode === "marker" ? "" : undefined,
        description: mode === "marker" ? "" : undefined,
        name: mode === "evacuation" ? "" : undefined,
        address: mode === "evacuation" ? "" : undefined,
        phone: mode === "evacuation" ? "" : undefined,
        latitude: "",
        longitude: "",
      }));
    }
    setErrors({});
  }, [isOpen, mode, initialData]);

  // Validation per mode
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (mode === "marker") {
      if (!formData.type) newErrors.type = "Type is required";
    }
    if (mode === "evacuation") {
      if (!formData.name) newErrors.name = "Name is required";
    }

    if (!formData.latitude || isNaN(Number(formData.latitude)))
      newErrors.latitude = "Valid latitude required";
    if (!formData.longitude || isNaN(Number(formData.longitude)))
      newErrors.longitude = "Valid longitude required";

    if (
      mode === "evacuation" &&
      formData.phone &&
      !/^[\d\s\-\+\(\)]+$/.test(formData.phone)
    ) {
      newErrors.phone = "Invalid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    const queryKey = ["markers"];
    const previousData = queryClient.getQueryData<MapData>(queryKey);

    try {
      if (mode === "marker") {
        const payload = {
          type: formData.type,
          description: formData.description,
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
          status: "active",
        };

        // Optimistic update
        queryClient.setQueryData<MapData>(queryKey, (old) =>
          old
            ? {
                ...old,
                markers: [
                  ...old.markers,
                  {
                    id: `temp-id-${Date.now()}`,
                    type: payload.type,
                    description: payload.description,
                    latitude: payload.latitude,
                    longitude: payload.longitude,
                    status: payload.status,
                    created_at: new Date().toISOString(),
                    rescuer: null,
                    user: null,
                    barangay: null,
                  },
                ],
              }
            : old
        );

        // API request
        const res = await fetch("/api/admin/markers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to save marker");
      } else if (mode === "evacuation") {
        const payload = {
          name: formData.name,
          address: formData.address || null,
          phone: formData.phone || null,
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
          status: "active",
        };

        // Optimistic update
        queryClient.setQueryData<MapData>(queryKey, (old) =>
          old
            ? {
                ...old,
                evacuationCenters: [
                  ...old.evacuationCenters,
                  {
                    id: `temp-id-${Date.now()}`,
                    ...payload,
                    created_at: new Date().toISOString(),
                  },
                ],
              }
            : old
        );

        // API request
        const res = await fetch("/api/admin/evacuations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to save evacuation center");
      }

      await queryClient.invalidateQueries({ queryKey });
      onClose();
    } catch (error) {
      console.error("Save failed", error);
      if (previousData) {
        queryClient.setQueryData(queryKey, previousData); // rollback cache on error
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-auto scroll-thin">
        <DialogHeader>
          <DialogTitle>
            {mode === "marker" ? "Add New Marker" : "Add Evacuation Center"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "marker" && (
            <>
              <Label>Type *</Label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, type: e.target.value }))
                }
                className={`w-full border p-2 rounded ${
                  errors.type ? "border-red-500" : ""
                }`}
              >
                <option value="">Select Type</option>
                {/* Replace with your filtered marker keys */}
                <option value="flood">Flood</option>
                <option value="landslide">Landslide</option>
                <option value="stormsurge">Stormsurge</option>
              </select>
              {errors.type && <p className="text-red-600">{errors.type}</p>}

              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, description: e.target.value }))
                }
              />
            </>
          )}

          {mode === "evacuation" && (
            <>
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, name: e.target.value }))
                }
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-600">{errors.name}</p>}

              <Label>Address</Label>
              <Textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, address: e.target.value }))
                }
              />
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, phone: e.target.value }))
                }
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-red-600">{errors.phone}</p>}
            </>
          )}

          <Label>Select Location *</Label>
          <LocationPickerMap
            latitude={formData.latitude ? Number(formData.latitude) : null}
            longitude={formData.longitude ? Number(formData.longitude) : null}
            onChange={(lat: number, lng: number) => {
              setFormData((f) => ({
                ...f,
                latitude: lat.toString(),
                longitude: lng.toString(),
              }));
              setErrors({ ...errors, latitude: "", longitude: "" });
            }}
          />
          {(errors.latitude || errors.longitude) && (
            <p className="text-red-600">
              {errors.latitude || errors.longitude}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <Label>Latitude</Label>
              <Input
                value={formData.latitude}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input
                value={formData.longitude}
                disabled
                className="bg-gray-100"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
