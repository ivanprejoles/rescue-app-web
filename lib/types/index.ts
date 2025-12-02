/* eslint-disable @typescript-eslint/no-explicit-any */

export interface StoredMarkerType {
  id: string;
  type: string;
  name?: string;
  description?: string;
  user_id?: string | null;
  rescuer_id?: string | null;
  imageUrl: string;
  status?: string;
  additional_info?: Record<string, any> | null;
  latitude: number;
  longitude: number;
  created_at?: string;
  updated_at?: string;
}

export interface AdminInfo {
  user_id: string;
  name: string;
  email: string;
  phone_number: string | null;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export interface TypeConfig {
  color: string;
  lightColor: string;
  borderColor: string;
  textColor: string;
  dotColor?: string;
  icon: React.ComponentType<any>;
  label: string;
}

export interface ColumnConfig {
  key: string;
  label: string;
  icon?: React.ComponentType<any>;
  render: (
    // MarkerWithRelations | MapEvacuationCenter | MapBarangay as type for render
    incident: any,
    user?: ClientUser | null
  ) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface TableAction {
  label: string;
  onClick: (incident: MarkerWithRelations) => void;
  variant?: "primary" | "secondary";
  className?: string;
}

export interface Rescuer {
  id: string;
  name: string;
  email: string;
  status: string; // e.g., "active"
  brgy_id: string;
  phone_number: string;
}

export interface Barangay {
  id: string;
  name: string;
  phone: string;
  address: string;
}

export interface Report {
  name: string;
  id: string;
  type: "report";
  category?: string;
  reportedBy?: string;
  contactNumber?: string;
  imageUrl?: string;
  dateReported?: string;
  lastUpdated?: string;
  description: string;
  latitude: number;
  title: string;
  longitude: number;
  status: "Pending" | "Assigned" | "Resolved" | "Failed"; // adjust values as needed
  created_at?: string;
  updated_at?: string;
  user?: User;
  rescuer?: Rescuer | null;
  barangay?: Barangay;
}

export interface BarangayReport {
  id: string;
  name: string;
  residents: number;
  reports: Report[];
}

export interface MarkerWithRelations {
  id: string;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  status: "Pending" | "Assigned" | "Resolved" | "Failed";
  created_at: string;
  updated_at: string;

  users: {
    id: string;
    name: string;
    status: string;
    phone_number: string;
    user_type: "user" | "rescuer";
  } | null;

  barangays: {
    id: string;
    name: string;
    phone: string;
  } | null;
}

export interface RawEvacuationCenter {
  id: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  status: string;
  created_at?: string;
  imageUrl: string | null;
  evacuation_center_barangays?: {
    barangay_id: string;
  }[];

  barangays?: RawBarangay[];
}

export interface RawBarangay {
  id: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  status: "information" | "urgent" | "warning";
  date: string;
}

export interface Marker {
  id: string;
  type: string;
  description: string | null;
  imageUrl: string | null;
  latitude: number;
  longitude: number;
  status: string | null;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface User {
  email: string;
  status: string;
  address: string | null;
  id: string;
  user_id: string;
  phone_number: string;
  imageUrl?: string;
  validImageUrl?: string;
  name: string;
  user_type: "user" | "rescuer";
  created_at: string;
  barangays: {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  } | null;
  markers_as_user: Marker[];
  markers_as_rescuer: Marker[];
}

// Minimal User type used in marker (reporting user, rescuer)
interface MapUser {
  id: string;
  name: string;
  email?: string | null;
  phone_number?: string | null;
  status?: string | null;
  brgy_id?: string | null;
}

// Barangay info
export interface MapBarangay {
  id: string;
  name: string;
  phone?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

// Marker with relations for map display
export interface MapMarker {
  id: string;
  type: string;
  description?: string | null;
  latitude: number;
  longitude: number;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  imageUrl?: string | null;
  user?: MapUser | null;
  rescuer?: MapUser | null;
  barangay?: MapBarangay | null;
}

// EvacuationCenter info
export interface MapEvacuationCenter {
  id: string;
  name: string;
  address?: string | null;
  imageUrl: string;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  status?: string | null;
  evacuation_center_barangays?: { barangay_id: string }[];
}

// The full fetched data shape from your API/server
export interface MapData {
  markers: MapMarker[];
  barangays: MapBarangay[];
  evacuationCenters: MapEvacuationCenter[];
}

export interface MapLocation {
  id: string;
  latitude: number;
  longitude: number;
  entity_type: "user" | "rescuer";
  entity_id: string;
  updated_at: string;
  name: string;
  phone_number: string;
}

// DOCS

// rotating slider
export interface RotatingSliderProps {
  title: string;
  description: string;
  image: string;
}

// USER
export interface BarangayInfo {
  id: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
}

export interface ClientAccessUser {
  id: string;
  name: string;
  email: string | null;
  imageUrl?: string;
  validImageUrl?: string;
  phone_number: string | null;
  address: string | null;
  status: string;
  created_at: string;
  user_type: "rescuer" | "user" | "unverified";
  barangays: BarangayInfo | null;
}
export interface ClientAccessWithBarangays {
  user: ClientAccessUser | null;
  allBarangays: {
    id: string;
    name: string;
  }[];
}

export type PublicUser = {
  id: string;
  name: string;
  brgy_id: string | null;
};

export type ClientAccessResponse = {
  user: PublicUser | null;
  isUser: boolean;
};

// client report
export interface ClientData {
  user: ClientUser;
  markers: MapMarker[];
  evacuationCenters: MapEvacuationCenter[];
}

export interface ClientUser {
  id: string;
  name: string;
  email: string | null;
  phone_number: string | null;
  status: string;
  created_at: string;
  user_type: "rescuer" | "user";
  brgy_id: string;
}
