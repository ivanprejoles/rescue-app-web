"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GradientWrapper } from "@/components/ui/background-gradient";
import { Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClientData } from "@/lib/types";
import { useAdminQuery } from "@/lib/useQuery";
import { getUserMarkersClient } from "@/lib/client-fetchers";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LocationPickerMap = dynamic(() => import("@/lib/map/location-picker"), {
  ssr: false,
});

const formSchema = z.object({
  description: z.string().optional(),
  brgy_id: z.string().optional(),
  latitude: z.string().min(1, "Latitude required"),
  longitude: z.string().min(1, "Longitude required"),
});

type FormData = z.infer<typeof formSchema>;

export default function ClientReportModal() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // ✅ Fetch logged-in client data
  const {
    data: clientData,
    isLoading,
    error,
  } = useAdminQuery<ClientData>(["client-report"], getUserMarkersClient, {
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      brgy_id: "",
      latitude: "",
      longitude: "",
    },
  });

  useEffect(() => {
    if (!open || !clientData?.user) return;

    form.reset({
      description: "",
      latitude: "",
      longitude: "",
      brgy_id: clientData.user.brgy_id ? String(clientData.user.brgy_id) : "",
    });
  }, [open, clientData, form]);

  // ✅ Mutation for creating report
  const createReportMutation = useMutation({
    mutationFn: async (values: FormData) => {
      if (!clientData?.user?.id) throw new Error("No valid user ID found");

      const response = await fetch("/api/client/marker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          user_id: clientData.user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit report");
      }

      return response.json();
    },
    onSuccess: () => {
      // ✅ Refresh client-report data
      queryClient.invalidateQueries({ queryKey: ["client-report"] });
      closeModal();
    },
    onError: (error) => {
      console.error("Error submitting report:", error.message);
    },
  });

  const onSubmit = (values: FormData) => {
    createReportMutation.mutate(values);
  };

  const closeModal = () => {
    setOpen(false);
    form.reset();
  };

  const isSubmitting = createReportMutation.isPending;

  if (isLoading) return null;
  if (error) return <p className="text-red-500">Error loading client data.</p>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <GradientWrapper>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setOpen(true)}
            className="shadow-lg hover:shadow-xl transition-shadow rounded-[22px] cursor-pointer"
          >
            <Megaphone className="h-4 w-4 mr-2" />
            Send Alert
          </Button>
        </GradientWrapper>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-auto scroll-thin">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600">
              <Megaphone size={16} className="text-white" />
            </div>
            Request Assistance
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Description */}
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

              {/* Map Picker */}
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
                        : undefined
                    }
                    longitude={
                      form.watch("longitude")
                        ? Number(form.watch("longitude"))
                        : undefined
                    }
                    onChange={(lat, lng) => {
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

                {/* Lat/Lng Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude *</FormLabel>
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
                        <FormLabel>Longitude *</FormLabel>
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

              {/* Submit */}
              <DialogFooter className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? "Reporting..." : "Send Report"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
