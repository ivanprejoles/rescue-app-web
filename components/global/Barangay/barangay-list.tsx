import React, { useState } from "react";
import {
  Plus,
  Search,
  MapPin,
  Phone,
  MoreHorizontal,
  Edit,
  Trash2,
  Building2,
  Calendar,
} from "lucide-react";
import { RawBarangay } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { openGoogleMaps } from "@/lib/utils";
import { GlowingWrapper } from "@/components/ui/glowing-effect";
import { GradientWrapper } from "@/components/ui/background-gradient";

interface BarangayListProps {
  barangays: RawBarangay[];
  onAdd: () => void;
  onEdit: (barangay: RawBarangay) => void;
  onDelete: (id: string, name: string) => void;
  onViewMap: (barangay: RawBarangay) => void;
  onCall: (phone: string) => void;
}

export const BarangayList: React.FC<BarangayListProps> = ({
  barangays,
  onAdd,
  onEdit,
  onDelete,
  onViewMap,
  onCall,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBarangays = barangays.filter(
    (barangay) =>
      barangay.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      barangay.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    onDelete(id, name);
  };

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <GlowingWrapper>
        <Card className="border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Barangay Management
                </CardTitle>
                <p className="mt-1">Manage and organize barangay information</p>
              </div>
              <GradientWrapper>
                <Button
                  onClick={() => onAdd()}
                  size="lg"
                  variant="outline"
                  className="shadow-lg hover:shadow-xl transition-shadow rounded-[22px] cursor-pointer"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  New Barangay
                </Button>
              </GradientWrapper>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <Input
                  placeholder="Search barangays..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="blue" className="px-3 py-1">
                {filteredBarangays.length} of {barangays.length}
              </Badge>
            </div>

            {/* Table */}
            {filteredBarangays.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building2 size={32} className="text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? "No barangays found" : "No barangays yet"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? "Try adjusting your search terms."
                    : "Get started by adding your first barangay."}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={onAdd}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus size={16} className="mr-2" />
                    Add First Barangay
                  </Button>
                )}
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table divClassName="max-h-[25rem] overflow-y-auto">
                  <TableHeader className="sticky w-full top-0 h-10 border-b-2 border-border rounded-t-md bg-white dark:bg-black shadow-sm">
                    <TableRow>
                      <TableHead className="text-center">Name</TableHead>
                      <TableHead className="text-center">Address</TableHead>
                      <TableHead className="text-center">Contact</TableHead>
                      <TableHead className="text-center">Created</TableHead>
                      <TableHead className="w-[50px] text-center"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="dark:bg-black bg-muted">
                    {filteredBarangays.map((barangay, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {barangay.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{barangay.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {barangay.address ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                openGoogleMaps(
                                  {
                                    lat: barangay.latitude,
                                    lng: barangay.longitude,
                                  },
                                  barangay.address
                                )
                              }
                              className="h-auto p-1 text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                            >
                              <MapPin size={14} className="mr-1" />
                              {barangay.address}
                            </Button>
                          ) : (
                            <span className="text-sm ">No address</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {barangay.phone ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onCall(barangay.phone!)}
                              className="h-auto p-1 text-green-600 hover:text-green-700 hover:underline cursor-pointer"
                            >
                              <Phone size={14} className="mr-1" />
                              {barangay.phone}
                            </Button>
                          ) : (
                            <span className="text-sm text-gray-400">
                              No contact
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            <span className="text-sm ">
                              {new Date(
                                barangay.created_at
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="cursor-pointer"
                              >
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => onViewMap(barangay)}
                              >
                                <MapPin size={14} className="mr-2" />
                                View on Map
                              </DropdownMenuItem>
                              {barangay.phone && (
                                <DropdownMenuItem
                                  onClick={() => onCall(barangay.phone!)}
                                >
                                  <Phone size={14} className="mr-2" />
                                  Call
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onEdit(barangay)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Edit
                                  size={14}
                                  className="mr-2 text-red-500 hover:text-red-700"
                                />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDelete(barangay.id, barangay.name)
                                }
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2
                                  size={14}
                                  className="mr-2 text-red-500 hover:text-red-700"
                                />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </GlowingWrapper>
    </div>
  );
};
