import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText } from "lucide-react";
import { BarangayReport, Report } from "@/lib/types";
import BarangayHeader from "./barangay-header";
import ReportCard from "./report-card";
import { Card } from "@/components/ui/card";
import { GlowingWrapper } from "@/components/ui/glowing-effect";

interface BarangaySectionProps {
  barangay: BarangayReport;
  isExpanded: boolean;
  onToggle: () => void;
  onStatusUpdate: (report: Report) => void;
  onDelete: (report: Report) => void;
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
    <GlowingWrapper>
      <Card className="border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10 px-6">
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
              // className="bg-gray-50"
            >
              {barangay.reports.length === 0 ? (
                <GlowingWrapper>
                  <Card className="border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D] relative z-10">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg text-center">
                      No reports found for this barangay
                    </p>
                  </Card>
                </GlowingWrapper>
              ) : (
                <div className="space-y-6 bg-white dark:bg-black">
                  {barangay.reports.map((report, index) => (
                    <ReportCard
                      key={index}
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
    </GlowingWrapper>
  );
};

export default BarangaySection;
