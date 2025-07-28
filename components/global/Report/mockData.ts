import { BarangayReport } from "@/lib/types";

export const barangays: BarangayReport[] = [
  {
    id: "1",
    name: "Barangay Poblacion",
    captain: "Capt. Maria Santos",
    residents: 8750,
    reports: [
      {
        id: "RPT-001",
        title: "Flood on Main Street",
        description:
          "Heavy flooding reported on Main Street after heavy rainfall. Water level approximately 2 feet high, affecting local businesses and residents.",
        category: "Natural Disaster",
        status: "in-progress",
        priority: "high",
        reportedBy: "Juan Dela Cruz",
        contactNumber: "+63 912 345 6789",
        location: "Main Street, Poblacion",
        dateReported: "2024-01-15T08:30:00Z",
        lastUpdated: "2024-01-15T10:15:00Z",
      },
      {
        id: "RPT-002",
        title: "Power Outage in Sports Complex",
        description:
          "Complete power outage affecting the sports complex and surrounding residential areas. Estimated 200 households affected.",
        category: "Infrastructure",
        status: "resolved",
        priority: "medium",
        reportedBy: "Maria Rodriguez",
        contactNumber: "+63 912 987 6543",
        location: "Sports Complex, Poblacion",
        dateReported: "2024-01-14T15:20:00Z",
        lastUpdated: "2024-01-15T09:45:00Z",
      },
      {
        id: "RPT-003",
        title: "Road Damage from Heavy Truck",
        description:
          "Severe road damage caused by overloaded truck on residential street. Creating hazardous conditions for vehicles and pedestrians.",
        category: "Infrastructure",
        status: "pending",
        priority: "medium",
        reportedBy: "Carlos Mendoza",
        contactNumber: "+63 912 555 7890",
        location: "Residential Street, Poblacion",
        dateReported: "2024-01-15T11:00:00Z",
        lastUpdated: "2024-01-15T11:00:00Z",
      },
    ],
  },
  {
    id: "2",
    name: "Barangay San Antonio",
    captain: "Capt. Roberto Cruz",
    residents: 6200,
    reports: [
      {
        id: "RPT-004",
        title: "Water Supply Contamination",
        description:
          "Reports of contaminated water supply affecting multiple households. Residents complaining of foul odor and unusual taste.",
        category: "Public Health",
        status: "pending",
        priority: "urgent",
        reportedBy: "Ana Santos",
        contactNumber: "+63 912 777 4321",
        location: "Water District, San Antonio",
        dateReported: "2024-01-15T06:15:00Z",
        lastUpdated: "2024-01-15T08:30:00Z",
      },
      {
        id: "RPT-005",
        title: "Illegal Dumping Site",
        description:
          "Large illegal dumping site discovered near the river. Environmental hazard affecting water quality and air pollution.",
        category: "Environmental",
        status: "failed",
        priority: "high",
        reportedBy: "Pedro Gonzalez",
        contactNumber: "+63 912 888 9999",
        location: "Riverside, San Antonio",
        dateReported: "2024-01-13T14:45:00Z",
        lastUpdated: "2024-01-15T12:20:00Z",
      },
    ],
  },
  {
    id: "3",
    name: "Barangay Santa Cruz",
    captain: "Capt. Elena Reyes",
    residents: 4800,
    reports: [
      {
        id: "RPT-006",
        title: "Bridge Structural Damage",
        description:
          "Visible cracks and structural damage on the main bridge. Safety concerns for daily commuters and heavy vehicles.",
        category: "Infrastructure",
        status: "in-progress",
        priority: "high",
        reportedBy: "Miguel Torres",
        contactNumber: "+63 912 333 2222",
        location: "Main Bridge, Santa Cruz",
        dateReported: "2024-01-14T09:30:00Z",
        lastUpdated: "2024-01-15T07:15:00Z",
      },
    ],
  },
];
