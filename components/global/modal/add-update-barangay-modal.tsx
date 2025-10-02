"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Phone, Building2 } from "lucide-react";
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
import { useUpdateAddBarangayModalStore } from "@/hooks/modals/use-update-add-barangay-modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBarangayClient,
  updateBarangayClient,
} from "@/lib/client-request/barangay";
import { RawBarangay, RawEvacuationCenter } from "@/lib/types";

const LocationPickerMap = dynamic(() => import("@/lib/map/location-picker"), {
  ssr: false, // disables server side rendering for this component
});

export const BarangayModal: React.FC = () => {
  const { isOpen, barangay, mode, closeModal } =
    useUpdateAddBarangayModalStore();
  const queryClient = useQueryClient();

  const createBarangayMutation = useMutation({
    mutationFn: createBarangayClient,
    onSuccess: (newBarangay) => {
      queryClient.setQueryData<{
        evacuations: RawEvacuationCenter[];
        barangays: RawBarangay[];
      }>(["evacuations"], (oldData) => {
        if (!oldData) return { evacuations: [], barangays: [newBarangay] };
        return {
          ...oldData,
          barangays: [...oldData.barangays, newBarangay],
        };
      });
    },
    onError: (error) => {
      console.error("Create barangay error:", error);
    },
  });

  const updateBarangayMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RawBarangay> }) =>
      updateBarangayClient(id, data),
    onSuccess: (updatedBarangay) => {
      queryClient.setQueryData<{
        evacuations: RawEvacuationCenter[];
        barangays: RawBarangay[];
      }>(["evacuations"], (oldData) => {
        if (!oldData) return { evacuations: [], barangays: [updatedBarangay] };
        return {
          ...oldData,
          barangays: oldData.barangays.map((b) =>
            b.id === updatedBarangay.id ? updatedBarangay : b
          ),
        };
      });
    },
    onError: (error) => {
      console.error("Update barangay error:", error);
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && barangay) {
        setFormData({
          name: barangay.name,
          address: barangay.address || "",
          latitude: barangay.latitude.toString(),
          longitude: barangay.longitude.toString(),
          phone: barangay.phone || "",
        });
      } else {
        setFormData({
          name: "",
          address: "",
          latitude: "",
          longitude: "",
          phone: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, barangay]);

  const isLoading =
    createBarangayMutation.isPending || updateBarangayMutation.isPending;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Barangay name is required";
    if (!formData.latitude.trim()) newErrors.latitude = "Latitude is required";
    else if (isNaN(Number(formData.latitude)))
      newErrors.latitude = "Must be a valid number";
    if (!formData.longitude.trim())
      newErrors.longitude = "Longitude is required";
    else if (isNaN(Number(formData.longitude)))
      newErrors.longitude = "Must be a valid number";
    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone))
      newErrors.phone = "Please enter a valid phone number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !validateForm()) return;

    const payload = {
      name: formData.name.trim(),
      address: formData.address.trim() || undefined,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      phone: formData.phone.trim() || undefined,
    };

    try {
      if (mode === "add") {
        await createBarangayMutation.mutateAsync(payload);
      } else if (mode === "edit" && barangay && barangay.id) {
        await updateBarangayMutation.mutateAsync({
          id: barangay.id,
          data: payload,
        });
      }
    } catch (error) {
      console.error("Error saving barangay:", error);
      alert(error instanceof Error ? error.message : "Error occurred");
    } finally {
      closeModal(); // Close modal after mutation finishes (success or failure)
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const onClose = () => {
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-auto scroll-thin">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Building2 size={16} className="text-white" />
            </div>
            {mode === "add" ? "Add New Barangay" : "Edit Barangay"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Barangay Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter barangay name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label
                htmlFor="address"
                className="text-sm font-medium flex items-center gap-2"
              >
                <MapPin size={14} />
                Address *
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter full address"
                rows={3}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Phone size={14} />
                Contact Number *
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+63 912 345 6789"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Coordinates */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Location *</Label>
              <LocationPickerMap // Use the updated component
                latitude={formData.latitude ? Number(formData.latitude) : null}
                longitude={
                  formData.longitude ? Number(formData.longitude) : null
                }
                onChange={(
                  lat: { toString: () => string },
                  lng: { toString: () => string }
                ) => {
                  setFormData((prev) => ({
                    ...prev,
                    latitude: lat.toString(),
                    longitude: lng.toString(),
                  }));
                  setErrors((prev) => ({
                    ...prev,
                    latitude: "",
                    longitude: "",
                  }));
                }}
              />
              {(errors.latitude || errors.longitude) && (
                <p className="text-sm text-red-600">
                  {errors.latitude || errors.longitude}
                </p>
              )}

              {/* Display Latitude and Longitude */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="displayLatitude"
                    className="text-sm font-medium"
                  >
                    Latitude
                  </Label>
                  <Input
                    id="displayLatitude"
                    value={formData.latitude}
                    disabled // Make it read-only
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="displayLongitude"
                    className="text-sm font-medium"
                  >
                    Longitude
                  </Label>
                  <Input
                    id="displayLongitude"
                    value={formData.longitude}
                    disabled // Make it read-only
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              className="cursor-pointer"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              {isLoading
                ? "Saving..."
                : mode === "add"
                ? "Add Barangay"
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
