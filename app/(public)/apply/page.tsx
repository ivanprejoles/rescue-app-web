"use client";

import type React from "react";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Upload, Shield, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ApplyRescuerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      dateOfBirth: "",
      emergencyContact: "",
      emergencyPhone: "",
    },
    qualifications: {
      experience: "",
      certifications: "",
      specializations: [],
      availability: "",
      transportation: "",
    },
    background: {
      motivation: "",
      previousExperience: "",
      physicalFitness: "",
      medicalConditions: "",
    },
    agreements: {
      backgroundCheck: false,
      termsOfService: false,
      codeOfConduct: false,
      dataPrivacy: false,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Application Submitted Successfully", {
        description:
          "Your rescuer application has been submitted. We will contact you within 5-7 business days for the next steps.",
      });

      // Reset form
      setFormData({
        personalInfo: {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          dateOfBirth: "",
          emergencyContact: "",
          emergencyPhone: "",
        },
        qualifications: {
          experience: "",
          certifications: "",
          specializations: [],
          availability: "",
          transportation: "",
        },
        background: {
          motivation: "",
          previousExperience: "",
          physicalFitness: "",
          medicalConditions: "",
        },
        agreements: {
          backgroundCheck: false,
          termsOfService: false,
          codeOfConduct: false,
          dataPrivacy: false,
        },
      });
    } catch {
      toast("Submission Failed", {
        description: "Failed to submit your application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const specializationOptions = [
    "Water Rescue",
    "Medical Response",
    "Search and Rescue",
    "Fire Response",
    "Technical Rescue",
    "Disaster Relief",
    "Communications",
    "Logistics Support",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <UserPlus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Apply to Become a Rescuer
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join our team of dedicated emergency responders and help save lives
            during typhoon disasters. Complete this application to begin the
            verification process.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Basic personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.personalInfo.firstName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalInfo: {
                          ...formData.personalInfo,
                          firstName: e.target.value,
                        },
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.personalInfo.lastName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalInfo: {
                          ...formData.personalInfo,
                          lastName: e.target.value,
                        },
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalInfo: {
                          ...formData.personalInfo,
                          email: e.target.value,
                        },
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.personalInfo.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalInfo: {
                          ...formData.personalInfo,
                          phone: e.target.value,
                        },
                      })
                    }
                    placeholder="+63 XXX XXX XXXX"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Complete Address *</Label>
                <Textarea
                  id="address"
                  value={formData.personalInfo.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personalInfo: {
                        ...formData.personalInfo,
                        address: e.target.value,
                      },
                    })
                  }
                  placeholder="Street, Barangay, City, Province"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.personalInfo.dateOfBirth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalInfo: {
                          ...formData.personalInfo,
                          dateOfBirth: e.target.value,
                        },
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">
                    Emergency Contact Name *
                  </Label>
                  <Input
                    id="emergencyContact"
                    value={formData.personalInfo.emergencyContact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalInfo: {
                          ...formData.personalInfo,
                          emergencyContact: e.target.value,
                        },
                      })
                    }
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Qualifications */}
          <Card>
            <CardHeader>
              <CardTitle>Qualifications & Experience</CardTitle>
              <CardDescription>
                Your professional background and certifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="experience">
                  Years of Emergency Response Experience *
                </Label>
                <Select
                  value={formData.qualifications.experience}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      qualifications: {
                        ...formData.qualifications,
                        experience: value,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="2-5">2-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">
                  Certifications & Training *
                </Label>
                <Textarea
                  id="certifications"
                  value={formData.qualifications.certifications}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      qualifications: {
                        ...formData.qualifications,
                        certifications: e.target.value,
                      },
                    })
                  }
                  placeholder="List your relevant certifications (CPR, First Aid, Rescue Training, etc.)"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Specializations (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {specializationOptions.map((spec) => (
                    <div key={spec} className="flex items-center space-x-2">
                      <Checkbox
                        id={spec}
                        checked={formData.qualifications.specializations.includes(
                          spec as never
                        )}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              qualifications: {
                                ...formData.qualifications,
                                specializations: [
                                  ...formData.qualifications.specializations,
                                  spec as never,
                                ],
                              },
                            });
                          } else {
                            setFormData({
                              ...formData,
                              qualifications: {
                                ...formData.qualifications,
                                specializations:
                                  formData.qualifications.specializations.filter(
                                    (s) => s !== spec
                                  ),
                              },
                            });
                          }
                        }}
                      />
                      <Label htmlFor={spec} className="text-sm">
                        {spec}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability *</Label>
                  <Select
                    value={formData.qualifications.availability}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        qualifications: {
                          ...formData.qualifications,
                          availability: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">
                        Full-time (24/7)
                      </SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="weekends">Weekends only</SelectItem>
                      <SelectItem value="on-call">On-call basis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transportation">Transportation *</Label>
                  <Select
                    value={formData.qualifications.transportation}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        qualifications: {
                          ...formData.qualifications,
                          transportation: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transportation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="own-vehicle">Own Vehicle</SelectItem>
                      <SelectItem value="motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="public-transport">
                        Public Transport
                      </SelectItem>
                      <SelectItem value="none">No Transportation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Background Information */}
          <Card>
            <CardHeader>
              <CardTitle>Background Information</CardTitle>
              <CardDescription>
                Additional information about your background and motivation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="motivation">
                  Why do you want to become a rescuer? *
                </Label>
                <Textarea
                  id="motivation"
                  value={formData.background.motivation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      background: {
                        ...formData.background,
                        motivation: e.target.value,
                      },
                    })
                  }
                  placeholder="Describe your motivation for joining the emergency response team"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previousExperience">
                  Previous Emergency Response Experience
                </Label>
                <Textarea
                  id="previousExperience"
                  value={formData.background.previousExperience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      background: {
                        ...formData.background,
                        previousExperience: e.target.value,
                      },
                    })
                  }
                  placeholder="Describe any previous emergency response experience"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="physicalFitness">
                  Physical Fitness Level *
                </Label>
                <Select
                  value={formData.background.physicalFitness}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      background: {
                        ...formData.background,
                        physicalFitness: value,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fitness level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="needs-improvement">
                      Needs Improvement
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalConditions">
                  Medical Conditions or Limitations
                </Label>
                <Textarea
                  id="medicalConditions"
                  value={formData.background.medicalConditions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      background: {
                        ...formData.background,
                        medicalConditions: e.target.value,
                      },
                    })
                  }
                  placeholder="List any medical conditions or physical limitations (optional)"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>
                Upload the required documents for verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <Upload className="h-6 w-6 mb-2" />
                  <span className="text-sm">Upload Valid ID</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <Upload className="h-6 w-6 mb-2" />
                  <span className="text-sm">Upload Certificates</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <Upload className="h-6 w-6 mb-2" />
                  <span className="text-sm">Upload Resume/CV</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <Upload className="h-6 w-6 mb-2" />
                  <span className="text-sm">Upload Photo</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Agreements */}
          <Card>
            <CardHeader>
              <CardTitle>Agreements & Consent</CardTitle>
              <CardDescription>
                Please read and agree to the following terms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="backgroundCheck"
                    checked={formData.agreements.backgroundCheck}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        agreements: {
                          ...formData.agreements,
                          backgroundCheck: checked as boolean,
                        },
                      })
                    }
                    required
                  />
                  <Label
                    htmlFor="backgroundCheck"
                    className="text-sm leading-relaxed"
                  >
                    I consent to a background check and verification of my
                    credentials and references.
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="termsOfService"
                    checked={formData.agreements.termsOfService}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        agreements: {
                          ...formData.agreements,
                          termsOfService: checked as boolean,
                        },
                      })
                    }
                    required
                  />
                  <Label
                    htmlFor="termsOfService"
                    className="text-sm leading-relaxed"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-blue-600 hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and understand my responsibilities as a rescuer.
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="codeOfConduct"
                    checked={formData.agreements.codeOfConduct}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        agreements: {
                          ...formData.agreements,
                          codeOfConduct: checked as boolean,
                        },
                      })
                    }
                    required
                  />
                  <Label
                    htmlFor="codeOfConduct"
                    className="text-sm leading-relaxed"
                  >
                    I agree to abide by the TERS Code of Conduct and
                    professional standards.
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="dataPrivacy"
                    checked={formData.agreements.dataPrivacy}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        agreements: {
                          ...formData.agreements,
                          dataPrivacy: checked as boolean,
                        },
                      })
                    }
                    required
                  />
                  <Label
                    htmlFor="dataPrivacy"
                    className="text-sm leading-relaxed"
                  >
                    I consent to the collection and processing of my personal
                    data in accordance with the{" "}
                    <Link
                      href="/privacy"
                      className="text-blue-600 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/docs" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Back to Documentation
              </Button>
            </Link>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={
                isSubmitting ||
                !Object.values(formData.agreements).every(Boolean)
              }
            >
              {isSubmitting ? (
                <>
                  <Shield className="h-4 w-4 mr-2 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Application Process
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                After submitting your application, you will receive a
                confirmation email. Our team will review your application and
                contact you within 5-7 business days for the next steps, which
                may include an interview and skills assessment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
