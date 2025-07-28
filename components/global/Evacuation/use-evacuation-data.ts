import { useState, useEffect } from "react";
import { EvacuationCenter, Barangay, DashboardStats } from "@/lib/types";

export const mockEvacuationCenters: EvacuationCenter[] = [
  {
    id: "ec-001",
    name: "Poblacion High School",
    capacity: 800,
    currentOccupancy: 0,
    location: "Main Street, Poblacion",
    coordinates: { lat: 14.5547, lng: 121.0244 },
    contact: "+63 912 777 8888",
    status: "active",
    createdAt: "2024-01-15",
    barangays: [
      {
        id: "brgy-001",
        name: "Barangay Poblacion",
        residents: 8750,
        households: 2187,
        captain: "Capt. Maria Santos",
        contact: "+63 912 555 6666",
        location: "Poblacion Center, Makati City",
        coordinates: { lat: 14.5547, lng: 121.0244 },
        createdAt: "2024-01-15",
      },
    ],
  },
  {
    id: "ec-002",
    name: "Sports Complex Arena",
    capacity: 1200,
    currentOccupancy: 0,
    location: "Sports Avenue, Poblacion",
    coordinates: { lat: 14.5567, lng: 121.0264 },
    contact: "+63 912 999 0000",
    status: "maintenance",
    createdAt: "2024-01-20",
    barangays: [
      {
        id: "brgy-002",
        name: "Barangay San Antonio",
        residents: 2500,
        households: 625,
        captain: "Capt. Juan Dela Cruz",
        contact: "+63 912 345 6789",
        location: "San Antonio District, Makati City",
        coordinates: { lat: 14.5567, lng: 121.0264 },
        createdAt: "2024-01-10",
      },
      {
        id: "brgy-003",
        name: "Barangay Riverside",
        residents: 3200,
        households: 800,
        captain: "Capt. Pedro Reyes",
        contact: "+63 915 222 3333",
        location: "Riverside District, Makati City",
        coordinates: { lat: 14.5587, lng: 121.0284 },
        createdAt: "2024-01-12",
      },
    ],
  },
  {
    id: "ec-003",
    name: "Community Center Hall",
    capacity: 500,
    currentOccupancy: 0,
    location: "Community Avenue, Central",
    coordinates: { lat: 14.5527, lng: 121.0224 },
    contact: "+63 920 888 7777",
    status: "active",
    createdAt: "2024-01-25",
    barangays: [
      {
        id: "brgy-004",
        name: "Barangay Central District",
        residents: 2100,
        households: 525,
        captain: "Capt. Ana Rodriguez",
        contact: "+63 920 888 7777",
        location: "Central Avenue, CBD",
        coordinates: { lat: 14.5527, lng: 121.0224 },
        createdAt: "2024-01-25",
      },
    ],
  },
];

export const useEvacuationData = () => {
  const [evacuationCenters, setEvacuationCenters] = useState<
    EvacuationCenter[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvacuationCenters(mockEvacuationCenters);
      setLoading(false);
    }, 500);
  }, []);

  const addEvacuationCenter = (
    center: Omit<EvacuationCenter, "id" | "createdAt" | "barangays">
  ) => {
    const newCenter: EvacuationCenter = {
      ...center,
      id: `ec-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      barangays: [],
    };
    setEvacuationCenters((prev) => [...prev, newCenter]);
  };

  const updateEvacuationCenter = (
    id: string,
    updatedData: Partial<EvacuationCenter>
  ) => {
    setEvacuationCenters((prev) =>
      prev.map((ec) => (ec.id === id ? { ...ec, ...updatedData } : ec))
    );
  };

  const deleteEvacuationCenter = (id: string) => {
    setEvacuationCenters((prev) => prev.filter((ec) => ec.id !== id));
  };

  const addBarangayToCenter = (
    centerId: string,
    barangay: Omit<Barangay, "id" | "createdAt">
  ) => {
    const newBarangay: Barangay = {
      ...barangay,
      id: `brgy-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setEvacuationCenters((prev) =>
      prev.map((ec) =>
        ec.id === centerId
          ? { ...ec, barangays: [...ec.barangays, newBarangay] }
          : ec
      )
    );
  };

  const updateBarangay = (
    centerId: string,
    barangayId: string,
    updatedData: Partial<Barangay>
  ) => {
    setEvacuationCenters((prev) =>
      prev.map((ec) =>
        ec.id === centerId
          ? {
              ...ec,
              barangays: ec.barangays.map((b) =>
                b.id === barangayId ? { ...b, ...updatedData } : b
              ),
            }
          : ec
      )
    );
  };

  const deleteBarangay = (centerId: string, barangayId: string) => {
    setEvacuationCenters((prev) =>
      prev.map((ec) =>
        ec.id === centerId
          ? {
              ...ec,
              barangays: ec.barangays.filter((b) => b.id !== barangayId),
            }
          : ec
      )
    );
  };

  const getDashboardStats = (): DashboardStats => {
    const totalBarangays = evacuationCenters.reduce(
      (sum, ec) => sum + ec.barangays.length,
      0
    );
    const totalCapacity = evacuationCenters.reduce(
      (sum, ec) => sum + ec.capacity,
      0
    );
    const totalResidents = evacuationCenters.reduce(
      (sum, ec) =>
        sum +
        ec.barangays.reduce((barangaySum, b) => barangaySum + b.residents, 0),
      0
    );

    return {
      totalEvacuationCenters: evacuationCenters.length,
      totalBarangays,
      totalCapacity,
      totalResidents,
    };
  };

  const openGoogleMaps = (
    coordinates?: { lat: number; lng: number },
    address?: string
  ) => {
    if (coordinates) {
      const url = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
      window.open(url, "_blank");
    } else if (address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
      )}`;
      window.open(url, "_blank");
    }
  };

  const callNumber = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, "_self");
  };

  return {
    evacuationCenters,
    loading,
    addEvacuationCenter,
    updateEvacuationCenter,
    deleteEvacuationCenter,
    addBarangayToCenter,
    updateBarangay,
    deleteBarangay,
    getDashboardStats,
    openGoogleMaps,
    callNumber,
  };
};
