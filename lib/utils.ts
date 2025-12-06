/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MarkerWithRelations, BarangayReport } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRescueStatusColor = (status: string) => {
  switch (status) {
    case "rescued":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "in_progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

export const getRescuerStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "deployed":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    case "off_duty":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

// report utils
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-amber-700 text-white border-amber-200";
    case "Assigned":
      return "bg-blue-700 text-white border-blue-200";
    case "Resolved":
      return "bg-emerald-700 text-white border-emerald-200";
    case "failed":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export function transformMarkersToBarangayReports(
  markers: MarkerWithRelations[]
): BarangayReport[] {
  const grouped: Record<string, BarangayReport> = {};

  markers.forEach((marker) => {
    // 🟦 If barangay is null, use a fallback group
    const barangayId = marker.barangays?.id ?? "no-barangay";
    const barangayName = marker.barangays?.name ?? "No Barangay Assigned";

    // 🟦 Create barangay bucket if missing
    if (!grouped[barangayId]) {
      grouped[barangayId] = {
        id: barangayId,
        name: barangayName,
        residents: 0,
        reports: [],
      };
    }

    // 🟦 Push report
    grouped[barangayId].reports.push({
      name: barangayName,
      id: marker.id,
      title: marker.description || "",
      description: marker.description || "",
      category: marker.type,
      status: marker.status,
      reportedBy: marker.users?.name || "Unknown",
      contactNumber: marker.users?.phone_number || "N/A",
      latitude: marker.latitude,
      longitude: marker.longitude,
      dateReported: marker.created_at,
      lastUpdated: marker.updated_at,
      type: "report",
    });
  });

  return Object.values(grouped);
}

export function formatReadableDate(dateInput: any) {
  const dateObj = dateInput instanceof Date ? dateInput : new Date(dateInput);

  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return dateObj.toLocaleDateString("en-US", options);
}

export const openGoogleMaps = (
  coordinates?: { lat: number; lng: number } | null,
  address?: string | null
) => {
  const validCoord =
    coordinates &&
    coordinates.lat != null &&
    coordinates.lng != null &&
    coordinates.lat !== 0 &&
    coordinates.lng !== 0 &&
    coordinates.lat !== undefined &&
    coordinates.lng !== undefined;

  if (validCoord) {
    const url = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
    window.open(url, "_blank");
  } else if (address && address.trim().length > 0) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
    window.open(url, "_blank");
  } else {
    // Neither valid coordinates nor address provided — do nothing or alert
    console.warn("No valid coordinates or address to open in Google Maps");
  }
};

export const callNumber = (phoneNumber: string) => {
  window.open(`tel:${phoneNumber}`, "_self");
};

export const openGmailComposeWithRecipient = (recipientEmail: string) => {
  const subject = "[Rescue App] Message Regarding Your Status";
  const body =
    "Hello,\n\nI am contacting you through the Rescue App. Please check your current status or respond when available.\n\nThank you!";

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    recipientEmail
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.open(gmailUrl, "_blank");
};

export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncateText(
  text: string | null | undefined,
  maxLength: number = 30
) {
  if (!text) return ""; // handles null, undefined, or empty string

  // convert to string in case of other types
  const str = String(text);

  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
}

export function capitalizeFirstLetter(text: string) {
  if (!text) return text; // handle empty or undefined input
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function buildReportMessage({
  isInsert,
  isUpdate,
  userName,
  rescuerName,
  status,
}: {
  isInsert: boolean;
  isUpdate: boolean;
  userName: string;
  rescuerName: string | null;
  status: string | null;
}) {
  let title = "";
  let message = "";

  if (isInsert) {
    title = "New Report";
    message = `New report submitted by ${userName}.`;

    return { title, message };
  }

  if (isUpdate) {
    title = "Report Updated";

    if (status === "Assigned" && rescuerName) {
      message = `Report from ${userName} is now assigned to ${rescuerName}.`;
    } else if (status === "Resolved" && rescuerName) {
      message = `Report from ${userName} has been resolved by ${rescuerName}.`;
    } else if (status === "Failed" && rescuerName) {
      message = `${rescuerName} marked the report from ${userName} as failed.`;
    } else if (status === "Closed") {
      message = `Admin has closed the report from ${userName}.`;
    } else if (rescuerName) {
      message = `Rescuer ${rescuerName} updated a report from ${userName}.`;
    } else {
      message = `A report from ${userName} was updated.`;
    }
  }

  return { title, message };
}
