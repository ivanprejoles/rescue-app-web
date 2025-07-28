"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Download,
  Phone,
  Mail,
  MapPin,
  Save,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Mock data for demonstration
const mockData = {
  stats: {
    totalViews: 15420,
    appDownloads: 3240,
    rescuerApplications: 89,
    activeRescuers: 156,
  },
  news: [
    {
      id: 1,
      title: "TERS Mobile App Now Available",
      content:
        "The official Typhoon Emergency Response System mobile app is now available for download on both Android and iOS platforms.",
      date: "2024-01-15",
      priority: "high",
      status: "published",
    },
    {
      id: 2,
      title: "New Rescue Teams Deployed",
      content:
        "Additional rescue teams have been deployed across Metro Manila to improve response times during emergencies.",
      date: "2024-01-10",
      priority: "medium",
      status: "published",
    },
  ],
  contact: {
    emergency: {
      primary: "911",
      secondary: "117",
      ters: "+63 2 8888-TERS",
    },
    office: {
      phone: "+63 2 1234-5678",
      email: "info@ters.gov.ph",
      address: "TERS Headquarters, Quezon City, Metro Manila",
    },
  },
  appInfo: {
    version: "1.0.0",
    androidUrl:
      "https://play.google.com/store/apps/details?id=com.ters.emergency",
    iosUrl: "https://apps.apple.com/app/ters-emergency/id123456789",
  },
};

export default function AdminDocumentationDashboard() {
  const [data, setData] = useState(mockData);
  //   const [selectedNews, setSelectedNews] = useState<any>(null);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingApp, setIsEditingApp] = useState(false);
  const [newNews, setNewNews] = useState({
    title: "",
    content: "",
    priority: "medium",
  });

  const handleSaveNews = () => {
    if (!newNews.title || !newNews.content) {
      toast.error("Error", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    const newsItem = {
      id: Date.now(),
      ...newNews,
      date: new Date().toISOString().split("T")[0],
      status: "published",
    };

    setData((prev) => ({
      ...prev,
      news: [newsItem, ...prev.news],
    }));

    setNewNews({ title: "", content: "", priority: "medium" });

    toast.success("News Added", {
      description: "News item has been published successfully.",
    });
  };

  const handleDeleteNews = (id: number) => {
    setData((prev) => ({
      ...prev,
      news: prev.news.filter((item) => item.id !== id),
    }));

    toast.success("News Deleted", {
      description: "News item has been removed.",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Documentation Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage public documentation, news updates, and contact information
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Page Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.stats.totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-green-600">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              App Downloads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.stats.appDownloads.toLocaleString()}
            </div>
            <p className="text-xs text-green-600">+8% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Rescuer Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.stats.rescuerApplications}
            </div>
            <p className="text-xs text-blue-600">15 pending review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Active Rescuers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.stats.activeRescuers}
            </div>
            <p className="text-xs text-green-600">+5 this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* News Management */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  News & Updates
                </CardTitle>
                <CardDescription>
                  Manage public news and announcements
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add News
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add News Item</DialogTitle>
                    <DialogDescription>
                      Create a new news announcement for the public
                      documentation
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newsTitle">Title *</Label>
                      <Input
                        id="newsTitle"
                        value={newNews.title}
                        onChange={(e) =>
                          setNewNews({ ...newNews, title: e.target.value })
                        }
                        placeholder="Enter news title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newsContent">Content *</Label>
                      <Textarea
                        id="newsContent"
                        value={newNews.content}
                        onChange={(e) =>
                          setNewNews({ ...newNews, content: e.target.value })
                        }
                        placeholder="Enter news content"
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newsPriority">Priority</Label>
                      <Select
                        value={newNews.priority}
                        onValueChange={(value) =>
                          setNewNews({ ...newNews, priority: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High Priority</SelectItem>
                          <SelectItem value="medium">
                            Medium Priority
                          </SelectItem>
                          <SelectItem value="low">Low Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSaveNews} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Publish News
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {data.news.map((news) => (
                <div
                  key={news.id}
                  className="p-4 border-b border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getPriorityColor(news.priority)}>
                      {news.priority.toUpperCase()}
                    </Badge>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteNews(news.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <h4 className="font-semibold mb-1">{news.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                    {news.content}
                  </p>
                  <p className="text-xs text-gray-500">{news.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>Manage public contact details</CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditingContact(!isEditingContact)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditingContact ? "Cancel" : "Edit"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditingContact ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-red-600">
                    Emergency Hotlines
                  </Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div>
                      <Label className="text-xs">National</Label>
                      <Input
                        value={data.contact.emergency.primary}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Police</Label>
                      <Input
                        value={data.contact.emergency.secondary}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">TERS</Label>
                      <Input
                        value={data.contact.emergency.ters}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold">
                    Office Contact
                  </Label>
                  <div className="space-y-2 mt-2">
                    <div>
                      <Label className="text-xs">Phone</Label>
                      <Input
                        value={data.contact.office.phone}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Email</Label>
                      <Input
                        value={data.contact.office.email}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Address</Label>
                      <Textarea
                        value={data.contact.office.address}
                        className="text-sm"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => setIsEditingContact(false)}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">
                    Emergency Hotlines
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>National Emergency:</span>
                      <span className="font-mono font-semibold">
                        {data.contact.emergency.primary}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Police Emergency:</span>
                      <span className="font-mono font-semibold">
                        {data.contact.emergency.secondary}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>TERS Hotline:</span>
                      <span className="font-mono font-semibold">
                        {data.contact.emergency.ters}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Office Contact</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{data.contact.office.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{data.contact.office.email}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="text-xs">
                        {data.contact.office.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* App Information Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                App Information
              </CardTitle>
              <CardDescription>
                Manage mobile app download links and version information
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditingApp(!isEditingApp)}
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditingApp ? "Cancel" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditingApp ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appVersion">App Version</Label>
                <Input
                  id="appVersion"
                  value={data.appInfo.version}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      appInfo: { ...prev.appInfo, version: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="androidUrl">Android Download URL</Label>
                <Input
                  id="androidUrl"
                  value={data.appInfo.androidUrl}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      appInfo: { ...prev.appInfo, androidUrl: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="iosUrl">iOS Download URL</Label>
                <Input
                  id="iosUrl"
                  value={data.appInfo.iosUrl}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      appInfo: { ...prev.appInfo, iosUrl: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="md:col-span-3">
                <Button onClick={() => setIsEditingApp(false)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save App Information
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Current Version
                </Label>
                <p className="text-lg font-semibold">{data.appInfo.version}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Android Downloads
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {data.appInfo.androidUrl}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  iOS Downloads
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {data.appInfo.iosUrl}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Eye className="h-6 w-6 mb-2" />
              <span className="text-sm">View Public Docs</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              <span className="text-sm">Review Applications</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              <span className="text-sm">Emergency Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-sm">Generate Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
