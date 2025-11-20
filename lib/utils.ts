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
  const htmlContent = `
  <div style="max-width:480px;margin:32px auto;padding:24px;background:#f8fafc;border-radius:14px;box-shadow:0 4px 24px rgba(0,0,0,0.06);font-family:Segoe UI,Arial,sans-serif;">
    <div style="display:flex;align-items:center;gap:16px;">
      <div style="background:#2563eb;border-radius:50%;width:56px;height:56px;display:flex;align-items:center;justify-content:center;">
        <img src="https://img.icons8.com/color/48/000000/ambulance.png" alt="Rescue Icon" style="width:36px;height:36px;" />
      </div>
      <div>
        <h2 style="margin:0;color:#1e293b;font-size:1.5rem;font-weight:700;letter-spacing:-1px;">Rescue Alert</h2>
        <p style="margin:0;color:#64748b;font-size:1rem;">Immediate Assistance Needed</p>
      </div>
    </div>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
    <div style="color:#334155;font-size:1.08rem;line-height:1.6;">
      <p><strong>Incident:</strong> Vehicle accident detected at <span style="color:#2563eb;">123 Main St, Springfield</span>.</p>
      <p><strong>Time:</strong> Sunday, July 13, 2025, 4:46 PM PST</p>
      <p><strong>Severity:</strong> <span style="color:#dc2626;font-weight:600;">High</span></p>
      <p>
        <strong>Action Required:</strong> Please dispatch emergency services immediately. Click the button below to view the location and details in the Rescue App.
      </p>
      <div style="text-align:center;margin:32px 0 16px;">
        <a href="https://your-rescue-app.com/incident/12345" style="background:#2563eb;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:1.1rem;font-weight:600;display:inline-block;box-shadow:0 2px 8px rgba(37,99,235,0.15);transition:background 0.2s;">
          View Incident Details
        </a>
      </div>
      <p style="color:#64748b;font-size:0.95rem;text-align:center;">
        If you have questions or need help, contact our support team at <a href="mailto:support@your-rescue-app.com" style="color:#2563eb;">support@your-rescue-app.com</a>.
      </p>
    </div>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0 16px;" />
    <div style="text-align:center;color:#94a3b8;font-size:0.92rem;">
      Powered by <b>Your Rescue App</b> &mdash; Stay safe, stay connected.
    </div>
  </div>
  `;

  const plainTextContent = `
Rescue Alert - Immediate Assistance Needed

Incident: Vehicle accident detected at 123 Main St, Springfield.
Time: Sunday, July 13, 2025, 4:46 PM PST
Severity: High

Action Required: Please dispatch emergency services immediately. View details here: https://your-rescue-app.com/incident/12345

If you have questions or need help, contact support@your-rescue-app.com.

Powered by Your Rescue App — Stay safe, stay connected.
  `;

  if (navigator.clipboard && window.ClipboardItem) {
    const blobInput = [
      new ClipboardItem({
        "text/html": new Blob([htmlContent], { type: "text/html" }),
        "text/plain": new Blob([plainTextContent], { type: "text/plain" }),
      }),
    ];
    navigator.clipboard
      .write(blobInput)
      .then(() => {
        // Open Gmail compose with recipient email pre-filled
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
          recipientEmail
        )}`;
        window.open(gmailUrl, "_blank");
        alert(
          "Rescue email design copied! Please paste it (Ctrl+V or Cmd+V) into the Gmail compose window."
        );
      })
      .catch((err) => {
        alert("Failed to copy design: " + err);
      });
  } else {
    alert("Clipboard API not supported in this browser.");
  }
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
