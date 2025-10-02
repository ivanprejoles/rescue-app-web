"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GradientWrapper } from "@/components/ui/background-gradient";
import { Eye, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientUser } from "@/lib/types";
import dynamic from "next/dynamic";
import { useDialogStore } from "@/hooks/use-full-screen";
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

const LocationPickerMap = dynamic(() => import("@/lib/map/location-picker"), {
  ssr: false,
});

const formSchema = z.object({
  description: z.string().optional(),
  brgy_id: z.string().min(1, "Barangay is required").optional(),
  latitude: z.string().min(1, "Latitude required"),
  longitude: z.string().min(1, "Longitude required"),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
  user: ClientUser;
};

export default function ShowAlertOnce({ user }: Props) {
  const { setOpen, open } = useDialogStore();

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
    if (!open) return;

    form.reset();

    if (user) {
      form.reset({
        latitude: undefined,
        longitude: undefined,
        description: undefined,
        brgy_id: String(user.brgy_id),
      });
    }
  }, [open, user, form]);

  const onSubmit = async (values: FormData) => {
    try {
      const response = await fetch("/api/client/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
    } finally {
      closeModal();
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  const closeModal = () => {
    setOpen(false);
    form.reset();
  };

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
        <DialogHeader className="h-auto">
          <DialogTitle className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600`}
            >
              <Megaphone size={16} className="text-white" />
            </div>
            Request Assistance
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
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
