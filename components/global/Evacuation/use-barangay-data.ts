// import { useState, useEffect } from "react";
// import { Barangay, EvacuationCenter, DashboardStats } from "@/lib/types";
// import { mockBarangays, mockEvacuationCenters } from "./mockdata";

// export const useBarangayData = () => {
//   const [barangays, setBarangays] = useState<Barangay[]>([]);
//   const [evacuationCenters, setEvacuationCenters] = useState<
//     EvacuationCenter[]
//   >([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate API call
//     setTimeout(() => {
//       setBarangays(mockBarangays);
//       setEvacuationCenters(mockEvacuationCenters);
//       setLoading(false);
//     }, 500);
//   }, []);

//   const addBarangay = (
//     barangay: Omit<Barangay, "id" | "createdAt" | "activeCenters">
//   ) => {
//     const newBarangay: Barangay = {
//       ...barangay,
//       id: `brgy-${Date.now()}`,
//       createdAt: new Date().toISOString().split("T")[0],
//       activeCenters: 0,
//     };
//     setBarangays((prev) => [...prev, newBarangay]);
//   };

//   const updateBarangay = (id: string, updatedData: Partial<Barangay>) => {
//     setBarangays((prev) =>
//       prev.map((b) => (b.id === id ? { ...b, ...updatedData } : b))
//     );
//   };

//   const deleteBarangay = (id: string) => {
//     setBarangays((prev) => prev.filter((b) => b.id !== id));
//     setEvacuationCenters((prev) => prev.filter((ec) => ec.barangayId !== id));
//   };

//   const addEvacuationCenter = (
//     center: Omit<EvacuationCenter, "id" | "createdAt">
//   ) => {
//     const newCenter: EvacuationCenter = {
//       ...center,
//       id: `ec-${Date.now()}`,
//       createdAt: new Date().toISOString().split("T")[0],
//     };
//     setEvacuationCenters((prev) => [...prev, newCenter]);

//     // Update barangay active centers count
//     setBarangays((prev) =>
//       prev.map((b) =>
//         b.id === center.barangayId
//           ? { ...b, activeCenters: b.activeCenters + 1 }
//           : b
//       )
//     );
//   };

//   const updateEvacuationCenter = (
//     id: string,
//     updatedData: Partial<EvacuationCenter>
//   ) => {
//     setEvacuationCenters((prev) =>
//       prev.map((ec) => (ec.id === id ? { ...ec, ...updatedData } : ec))
//     );
//   };

//   const deleteEvacuationCenter = (id: string) => {
//     const center = evacuationCenters.find((ec) => ec.id === id);
//     if (center) {
//       setEvacuationCenters((prev) => prev.filter((ec) => ec.id !== id));

//       // Update barangay active centers count
//       setBarangays((prev) =>
//         prev.map((b) =>
//           b.id === center.barangayId
//             ? { ...b, activeCenters: Math.max(0, b.activeCenters - 1) }
//             : b
//         )
//       );
//     }
//   };

//   const getBarangayEvacuationCenters = (barangayId: string) => {
//     return evacuationCenters.filter((ec) => ec.barangayId === barangayId);
//   };

//   const getDashboardStats = (): DashboardStats => {
//     const activeCenters = evacuationCenters.filter(
//       (ec) => ec.status === "active"
//     ).length;
//     const totalCapacity = evacuationCenters.reduce(
//       (sum, ec) => sum + ec.capacity,
//       0
//     );

//     return {
//       totalBarangays: barangays.length,
//       totalEvacuationCenters: evacuationCenters.length,
//       totalActiveCenters: activeCenters,
//       totalCapacity,
//     };
//   };

//   return {
//     barangays,
//     evacuationCenters,
//     loading,
//     addBarangay,
//     updateBarangay,
//     deleteBarangay,
//     addEvacuationCenter,
//     updateEvacuationCenter,
//     deleteEvacuationCenter,
//     getBarangayEvacuationCenters,
//     getDashboardStats,
//   };
// };
