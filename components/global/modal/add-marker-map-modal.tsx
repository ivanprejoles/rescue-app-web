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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Building, Phone, MapIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapData } from "@/lib/types";
import { useUpdateAddMapModal } from "@/hooks/modals/use-update-add-map-modal";
import { fetchMarkers } from "../Map/client-side-map";

const LocationPickerMap = dynamic(() => import("@/lib/map/location-picker"), {
  ssr: false,
});

const formSchema = z.object({
  type: z.string().min(1, "Type is required").optional(),
  brgyId: z.string().min(1, "Barangay is required").optional(),
  description: z.string().optional(),
  name: z.string().min(1, "Name is required").optional(),
  address: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[\d\s\-\+\(\)]+$/.test(val), {
      message: "Invalid phone number",
    }),
  latitude: z.string().min(1, "Latitude required"),
  longitude: z.string().min(1, "Longitude required"),
});

type FormData = z.infer<typeof formSchema>;

const HAZARD_TYPES = [
  { value: "flood", label: "Flood", icon: "💧" },
  { value: "landslide", label: "Landslide", icon: "🏔️" },
  { value: "stormsurge", label: "Storm Surge", icon: "🌊" },
];

export const UpdateAddMapModal: React.FC = () => {
  const { isOpen, mode, initialData, closeModal } = useUpdateAddMapModal();
  const { data, isLoading: mapLoading } = useQuery<MapData>({
    queryKey: ["markers"],
    queryFn: fetchMarkers,
    staleTime: 1000 * 60 * 5,
  });

  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      brgyId: "",
      description: "",
      name: "",
      address: "",
      phone: "",
      latitude: "",
      longitude: "",
    },
  });

  // Reset form when modal opens or data changes
  React.useEffect(() => {
    if (!isOpen) return;

    // Clear form first
    form.reset();

    // Then set values based on mode and data
    if (mode === "marker" && initialData) {
      form.reset({
        type: initialData?.type || "",
        brgyId: initialData.barangay?.id || "",
        description: initialData.description || "",
        latitude: String(initialData.latitude || ""),
        longitude: String(initialData.longitude || ""),
        name: undefined,
        address: undefined,
        phone: undefined,
      });
    } else if (mode === "evacuation" && initialData) {
      form.reset({
        name: initialData.name || "",
        address: initialData.address || "",
        phone: initialData.phone || "",
        latitude: String(initialData.latitude || ""),
        longitude: String(initialData.longitude || ""),
        type: undefined,
        brgyId: undefined,
        description: undefined,
      });
    } else {
      // New entry
      form.reset({
        type: mode === "marker" ? "" : undefined,
        brgyId: mode === "marker" ? "" : undefined,
        description: mode === "marker" ? "" : undefined,
        name: mode === "evacuation" ? "" : undefined,
        address: mode === "evacuation" ? "" : undefined,
        phone: mode === "evacuation" ? "" : undefined,
        latitude: "",
        longitude: "",
      });
    }
  }, [isOpen, mode, initialData, form]);

  const onSubmit = async (values: FormData) => {
    const queryKey = ["markers"];
    const previousData = queryClient.getQueryData<MapData>(queryKey);

    try {
      if (mode === "marker") {
        const payload = {
          type: values.type,
          brgyId: values.brgyId,
          description: values.description,
          latitude: Number(values.latitude),
          longitude: Number(values.longitude),
          status: "Active",
        };

        if (initialData?.id) {
          console.log("updating");
          await fetch(`/api/admin/markers/${initialData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          queryClient.setQueryData<MapData>(queryKey, (old: any) => {
            if (!old) return old;
            return {
              ...old,
              markers: old.markers.map((m) =>
                m.id === initialData.id ? { ...m, ...payload } : m
              ),
            };
          });
        } else {
          console.log("adding");
          queryClient.setQueryData<MapData>(queryKey, (old: any) =>
            old
              ? {
                  ...old,
                  markers: [
                    ...old.markers,
                    {
                      id: `temp-id-${Date.now()}`,
                      ...payload,
                      created_at: new Date().toISOString(),
                      rescuer: null,
                      user: null,
                    },
                  ],
                }
              : old
          );
          const res = await fetch("/api/admin/markers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error("Failed to save marker");
        }
      } else if (mode === "evacuation") {
        const payload = {
          name: values.name,
          address: values.address || null,
          phone: values.phone || null,
          latitude: Number(values.latitude),
          longitude: Number(values.longitude),
          status: "Active",
        };

        if (initialData?.id) {
          await fetch(`/api/admin/evacuations/${initialData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          queryClient.setQueryData<MapData>(queryKey, (old: any) => {
            if (!old) return old;
            return {
              ...old,
              evacuationCenters: old.evacuationCenters.map((e) =>
                e.id === initialData.id ? { ...e, ...payload } : e
              ),
            };
          });
        } else {
          queryClient.setQueryData<MapData>(queryKey, (old: any) =>
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
          const res = await fetch("/api/admin/evacuations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error("Failed to save evacuation center");
        }
      }

      await queryClient.invalidateQueries({ queryKey });
      closeModal();
    } catch (error) {
      console.error("Save failed", error);
      if (previousData) {
        queryClient.setQueryData(queryKey, previousData);
      }
    }
  };

  const isEditing = Boolean(initialData?.id);
  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-auto scroll-thin">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                mode === "marker"
                  ? "bg-gradient-to-br from-red-500 to-red-600"
                  : "bg-gradient-to-br from-blue-500 to-blue-600"
              }`}
            >
              {mode === "marker" ? (
                <MapPin size={16} className="text-white" />
              ) : (
                <Building size={16} className="text-white" />
              )}
            </div>
            {mode === "marker"
              ? isEditing
                ? "Edit Hazard Marker"
                : "Add New Hazard Marker"
              : isEditing
              ? "Edit Evacuation Center"
              : "Add Evacuation Center"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Marker Fields */}
              {mode === "marker" && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Hazard Type *
                          </FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select hazard type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {HAZARD_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex items-center gap-2">
                                    <span>{type.icon}</span>
                                    {type.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="brgyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Barangay *
                          </FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={mapLoading}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select barangay" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {data?.barangays.map((barangay) => (
                                <SelectItem
                                  key={barangay.id}
                                  value={barangay.id}
                                >
                                  {barangay.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Provide additional details about this hazard..."
                            className="min-h-[40px] resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Evacuation Center Fields */}
              {mode === "evacuation" && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Center Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., Central Elementary School"
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Address
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Full address of the evacuation center"
                              className="min-h-[100px] resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            Contact Phone
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., +63 912 345 6789"
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Location Fields */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">
                  Select Location on Map *
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Click on the map to set the exact location
                </p>
                <div className="border rounded-lg overflow-hidden">
                  <LocationPickerMap
                    latitude={
                      form.watch("latitude")
                        ? Number(form.watch("latitude"))
                        : null
                    }
                    longitude={
                      form.watch("longitude")
                        ? Number(form.watch("longitude"))
                        : null
                    }
                    onChange={(lat: number, lng: number) => {
                      form.setValue("latitude", lat.toString(), {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      form.setValue("longitude", lng.toString(), {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Latitude *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            placeholder="Auto-filled from map"
                            className="h-11 bg-muted cursor-not-allowed"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Longitude *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            placeholder="Auto-filled from map"
                            className="h-11 bg-muted cursor-not-allowed"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit buttons */}
              <DialogFooter className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={form.handleSubmit(onSubmit)}
                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  {isSubmitting
                    ? "Saving..."
                    : isEditing
                    ? "Save Changes"
                    : `Add ${mode === "marker" ? "Marker" : "Center"}`}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
