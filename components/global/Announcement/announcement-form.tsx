import React, { useState, useEffect } from "react";
import { Save, Calendar, Type, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Announcement } from "@/lib/types";

interface AnnouncementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (announcement: Omit<Announcement, "id">, id?: string) => void;
  editingAnnouncement?: Announcement | null;
}

export default function AnnouncementForm({
  isOpen,
  onClose,
  onSave,
  editingAnnouncement,
}: AnnouncementFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "draft" as string,
    date: new Date().toISOString().split("T")[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingAnnouncement) {
      setFormData({
        title: editingAnnouncement.title,
        description: editingAnnouncement.description,
        status: editingAnnouncement.status,
        date: editingAnnouncement.date,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "draft",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [editingAnnouncement, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingAnnouncement) {
        await onSave(formData, editingAnnouncement.id);
      } else {
        await onSave(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving announcement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      status: "draft",
      date: new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {editingAnnouncement
              ? "Edit Announcement"
              : "Create New Announcement"}
          </DialogTitle>
          <DialogDescription>
            {editingAnnouncement
              ? "Make changes to your announcement here."
              : "Fill in the details to create a new announcement."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-hidden">
          <Card>
            <CardContent className="pt-6 space-y-6 overflow-hidden">
              {/* Title Field */}
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center space-x-2">
                  <Type className="h-4 w-4" />
                  <span>Title</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter announcement title..."
                  className="w-full"
                  required
                />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Content</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  placeholder="Write your announcement content..."
                  className="resize-none w-full min-w-0"
                  style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
                  required
                />
              </div>

              {/* Status and Date Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Date</span>
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {editingAnnouncement ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingAnnouncement ? "Update" : "Create"} Announcement
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
