"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Camera,
  Phone,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

export default function ReportPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    urgency: "",
    description: "",
    peopleCount: "",
    injuries: "",
    shelter: "",
    supplies: "",
  });

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Location Error", {
            description:
              "Unable to get your location. Please enable location services.",
          });
        }
      );
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Emergency Report Submitted", {
        description:
          "Your emergency report has been sent to local authorities. Help is on the way!",
      });

      // Reset form
      setFormData({
        name: "",
        phone: "",
        urgency: "",
        description: "",
        peopleCount: "",
        injuries: "",
        shelter: "",
        supplies: "",
      });
    } catch {
      toast.error("Submission Failed", {
        description: "Failed to submit your report. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Emergency Report
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Fill out this form to request immediate assistance during the
            typhoon
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {location ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-600 font-medium">
                  Location detected
                </span>
                <Badge variant="outline">
                  {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </Badge>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className="text-orange-600 font-medium">
                  Getting your location...
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Details</CardTitle>
            <CardDescription>
              Provide as much information as possible to help emergency
              responders assist you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+63 XXX XXX XXXX"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level *</Label>
                <Select
                  value={formData.urgency}
                  onValueChange={(value) =>
                    setFormData({ ...formData, urgency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">
                      🔴 Critical - Life threatening
                    </SelectItem>
                    <SelectItem value="high">
                      🟠 High - Immediate assistance needed
                    </SelectItem>
                    <SelectItem value="medium">
                      🟡 Medium - Assistance needed soon
                    </SelectItem>
                    <SelectItem value="low">
                      🟢 Low - Non-urgent help needed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Situation Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your current situation, what kind of help you need, any immediate dangers..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="peopleCount">Number of People</Label>
                  <Input
                    id="peopleCount"
                    type="number"
                    value={formData.peopleCount}
                    onChange={(e) =>
                      setFormData({ ...formData, peopleCount: e.target.value })
                    }
                    placeholder="How many people need help?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="injuries">Injuries/Medical Issues</Label>
                  <Select
                    value={formData.injuries}
                    onValueChange={(value) =>
                      setFormData({ ...formData, injuries: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any injuries?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No injuries</SelectItem>
                      <SelectItem value="minor">Minor injuries</SelectItem>
                      <SelectItem value="serious">Serious injuries</SelectItem>
                      <SelectItem value="critical">
                        Critical medical emergency
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shelter">Shelter Status</Label>
                  <Select
                    value={formData.shelter}
                    onValueChange={(value) =>
                      setFormData({ ...formData, shelter: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Current shelter situation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safe">
                        Safe shelter available
                      </SelectItem>
                      <SelectItem value="damaged">Shelter damaged</SelectItem>
                      <SelectItem value="flooded">Shelter flooded</SelectItem>
                      <SelectItem value="none">No shelter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplies">Supplies Needed</Label>
                  <Select
                    value={formData.supplies}
                    onValueChange={(value) =>
                      setFormData({ ...formData, supplies: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="What supplies do you need?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No supplies needed</SelectItem>
                      <SelectItem value="food">Food and water</SelectItem>
                      <SelectItem value="medical">Medical supplies</SelectItem>
                      <SelectItem value="rescue">Rescue/evacuation</SelectItem>
                      <SelectItem value="all">All of the above</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photo/Video
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  disabled={isSubmitting || !location}
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Submit Emergency Report
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Emergency Hotlines
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                If this is a life-threatening emergency, call:{" "}
                <strong>911</strong> or <strong>117</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
