import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText } from "lucide-react";
import { BarangayReport } from "@/lib/types";
import BarangayHeader from "./barangay-header";
import ReportCard from "./report-card";
import { Card } from "@/components/ui/card";

interface BarangaySectionProps {
  barangay: BarangayReport;
  isExpanded: boolean;
  onToggle: () => void;
  onStatusUpdate: (reportId: string, newStatus: string) => void;
  onDelete: (reportId: string) => void;
}

const contentVariants = {
  collapsed: { height: 0, opacity: 0, overflow: "hidden" },
  expanded: { height: "auto", opacity: 1, overflow: "visible" },
};

const BarangaySection: React.FC<BarangaySectionProps> = ({
  barangay,
  isExpanded,
  onToggle,
  onStatusUpdate,
  onDelete,
}) => {
  return (
    <Card className="rounded-xl shadow-md border border-gray-100 overflow-hidden py-0 px-0">
      <BarangayHeader
        barangay={barangay}
        isExpanded={isExpanded}
        onToggle={onToggle}
      />

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={contentVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-gray-50"
          >
            {barangay.reports.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-black">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  No reports found for this barangay
                </p>
              </div>
            ) : (
              <div className="p-6 space-y-6 bg-white dark:bg-black">
                {barangay.reports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onStatusUpdate={onStatusUpdate}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default BarangaySection;
