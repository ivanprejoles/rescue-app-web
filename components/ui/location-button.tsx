import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ExternalLink, X, Navigation, Copy, Check } from "lucide-react";
import { Button } from "./evacuation-button";

interface LocationButtonProps {
  locationName: string;
  lat: number;
  lng: number;
  className?: string;
}

export const LocationButton: React.FC<LocationButtonProps> = ({
  locationName,
  lat,
  lng,
  className = "",
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRedirectToMap = () => {
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(googleMapsUrl, "_blank");
  };

  const handleCopyCoordinates = async () => {
    const coordinates = `${lat}, ${lng}`;
    try {
      await navigator.clipboard.writeText(coordinates);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy coordinates:", err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPopup(true)}
        className={`flex items-center space-x-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors duration-200 ${className}`}
      >
        <MapPin className="w-4 h-4" />
        <span className="text-sm font-medium">{locationName}</span>
      </button>

      <AnimatePresence>
        {showPopup && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setShowPopup(false)}
            />

            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 z-50 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Location Options
                </h3>
                <button
                  onClick={() => setShowPopup(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {locationName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-600 bg-white px-2 py-1 rounded">
                      {lat.toFixed(6)}, {lng.toFixed(6)}
                    </span>
                    <button
                      onClick={handleCopyCoordinates}
                      className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleRedirectToMap}
                    variant="primary"
                    size="md"
                    icon={ExternalLink}
                    className="w-full"
                  >
                    Open in Google Maps
                  </Button>

                  <Button
                    onClick={() => {
                      // You can implement a custom map popup here
                      alert(
                        "Custom map popup - implement your embedded map here"
                      );
                      setShowPopup(false);
                    }}
                    variant="outline"
                    size="md"
                    icon={Navigation}
                    className="w-full"
                  >
                    View in Popup Map
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
