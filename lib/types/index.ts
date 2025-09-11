export interface SentMarkerType {
  lat: number;
  lng: number;
  type: string;
  name?: string;
  description?: string;
  status?: string;
  additional_info?: Record<string, any>;
  timestamp?: string;
}

export interface StoredMarkerType {
  id: string;
  type: string;
  name?: string;
  description?: string;
  user_id?: string | null;
  rescuer_id?: string | null;
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
  // add other fields if needed
}

// * User and Rescuer Type
//

export interface TypeConfig {
  color: string;
  lightColor: string;
  borderColor: string;
  textColor: string;
  dotColor: string;
  icon: React.ComponentType<any>;
  label: string;
}

export interface ColumnConfig {
  key: string;
  label: string;
  icon?: React.ComponentType<any>;
  render: (
    incident: MarkerWithRelations | MapEvacuationCenter | MapBarangay
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

export interface BarangayTypeConfig {
  color: string;
  lightColor: string;
  borderColor: string;
  textColor: string;
  icon: React.ComponentType<any>;
  label: string;
}

export interface BarangayColumnConfig {
  key: string;
  label: string;
  icon?: React.ComponentType<any>;
  render: (item: any) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface BarangayTableAction {
  label: string;
  onClick: (item: any) => void;
  variant?: "primary" | "secondary";
  className?: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "Pending" | "Assigned" | "Resolved" | "Failed";
  priority: "low" | "medium" | "high" | "urgent";
  reportedBy: string;
  contactNumber: string;
  longitude: number;
  latitude: number;
  dateReported: string;
  lastUpdated: string;
  images?: string[];
}

export interface BarangayReport {
  id: string;
  name: string;
  captain: string;
  residents: number;
  reports: Report[];
}

export interface DashboardStats {
  totalEvacuationCenters: number;
  totalBarangays: number;
  totalCapacity: number;
  totalResidents: number;
}

export interface MarkerWithRelations {
  id: string;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  status: string;
  created_at: string;
  updated_at: string;

  user: {
    id: string;
    name: string;
    status: string;
    phone_number: string;
    user_type: "user" | "rescuer";
  } | null;

  barangay: {
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

  // Join table records linking this center to barangays
  evacuation_center_barangays?: {
    barangay_id: string;
  }[];

  // Optional client-side enriched full barangay objects, derived from join IDs
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
  latitude: number;
  longitude: number;
  status: string | null;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface User {
  email: string;
  status: string;
  id: string;
  user_id: string;
  phone_number: string;
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

  user?: MapUser | null;
  rescuer?: MapUser | null;
  barangay?: MapBarangay | null;
}

// export interface Report {
//   id: string;
//   title: string;
//   description: string;
//   category: string;
//   status: "Pending" | "Assigned" | "Resolved" | "Failed";
//   priority: "low" | "medium" | "high" | "urgent";
//   reportedBy: string;
//   contactNumber: string;
//   longitude: number;
//   latitude: number;
//   dateReported: string;
//   lastUpdated: string;
//   images?: string[];
// }

// EvacuationCenter info
export interface MapEvacuationCenter {
  id: string;
  name: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  status?: string | null;
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
}

// DOCS

// rotating slider
export interface RotatingSliderProps {
  title: string;
  description: string;
  image: string;
}
