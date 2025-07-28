"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Phone, Building2 } from "lucide-react";
import { RawEvacuationCenter } from "@/lib/types";
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
import dynamic from "next/dynamic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LocationPickerMap = dynamic(() => import("@/lib/map/location-picker"), {
  ssr: false,
});

interface EvacuationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    center: Omit<RawEvacuationCenter, "id" | "createdAt" | "barangays">
  ) => void;
  evacuationCenter?: RawEvacuationCenter;
  mode: "add" | "edit";
}

export const EvacuationCenterModal: React.FC<EvacuationCenterModalProps> = ({
  isOpen,
  onClose,
  onSave,
  evacuationCenter,
  mode,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    phone: "",
    status: "active" as string,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && evacuationCenter) {
        setFormData({
          name: evacuationCenter.name || "",
          address: evacuationCenter.address || "",
          latitude:
            evacuationCenter.latitude !== undefined
              ? evacuationCenter.latitude.toString()
              : "",
          longitude:
            evacuationCenter.longitude !== undefined
              ? evacuationCenter.longitude.toString()
              : "",
          phone: evacuationCenter.phone || "",
          status: evacuationCenter.status || "active",
        });
        setErrors({});
      } else {
        setFormData({
          name: "",
          address: "",
          latitude: "",
          longitude: "",
          phone: "",
          status: "active",
        });
        setErrors({});
      }
    }
  }, [isOpen, mode, evacuationCenter]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Center name is required";

    if (!formData.address.trim()) newErrors.address = "Address is required";

    if (!formData.latitude.trim()) newErrors.latitude = "Latitude is required";
    else if (isNaN(Number(formData.latitude)))
      newErrors.latitude = "Latitude must be a valid number";

    if (!formData.longitude.trim())
      newErrors.longitude = "Longitude is required";
    else if (isNaN(Number(formData.longitude)))
      newErrors.longitude = "Longitude must be a valid number";

    if (
      formData.phone.trim() &&
      !/^[\d\s\-\+\(\)]+$/.test(formData.phone.trim())
    )
      newErrors.phone = "Please enter a valid phone number";

    if (!formData.status) newErrors.status = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSave({
      name: formData.name.trim(),
      address: formData.address.trim(),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      phone: formData.phone.trim() || undefined,
      status: formData.status as "active" | "inactive" | "maintenance" | "full",
    });

    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-auto scroll-thin">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Building2 size={16} className="text-white" />
            </div>
            {mode === "add"
              ? "Add Evacuation Center"
              : "Edit Evacuation Center"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Center Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter center name"
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
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter address"
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-sm text-red-600">{errors.address}</p>
            )}
          </div>

          {/* Map picker + Lat/Lon */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Location *</Label>
            <LocationPickerMap
              latitude={formData.latitude ? Number(formData.latitude) : null}
              longitude={formData.longitude ? Number(formData.longitude) : null}
              onChange={(lat: number, lng: number) => {
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

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="latitude" className="text-sm font-medium">
                  Latitude
                </Label>
                <Input
                  id="latitude"
                  value={formData.latitude}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude" className="text-sm font-medium">
                  Longitude
                </Label>
                <Input
                  id="longitude"
                  value={formData.longitude}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Phone size={14} />
              Contact Number
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+63 XXX XXX XXXX"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Status *
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger
                className={`w-full ${
                  errors.status ? "border-red-500" : "border-gray-300"
                }`}
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="full">Full</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-600">{errors.status}</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              {mode === "add" ? "Add Center" : "Update Center"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
