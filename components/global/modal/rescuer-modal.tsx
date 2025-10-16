/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

interface RescuerModalProps {
  rescuer: any;
  onClose: () => void;
  getStatusColor: (status: string) => string;
}

export const RescuerModal: FC<RescuerModalProps> = ({
  rescuer,
  onClose,
  getStatusColor,
}) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Rescuer Details - {rescuer.name}
          </DialogTitle>
          <DialogDescription>
            Full information about this rescuer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(rescuer.status)}>
              {rescuer.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p>
                <strong>Name:</strong> {rescuer.name}
              </p>
              <p>
                <strong>Email:</strong> {rescuer.email}
              </p>
              <p>
                <strong>Phone:</strong> {rescuer.phone_number}
              </p>
            </div>
            <div>
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(rescuer.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {rescuer.status}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
