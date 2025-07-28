import { AlertTriangle, Mail, Phone } from "lucide-react";
import Link from "next/link";
import React from "react";

const MainFooter = () => {
  return (
    <footer className="glass-effect border-t border-white/10">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 glass-effect rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <span className="text-xl font-bold">WeatherWise</span>
            </div>
            <p className="text-gray-400 text-sm">
              Advanced weather monitoring and emergency response system for
              typhoon disasters.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Emergency Contacts</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Emergency: 911</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>TERS Hotline: 8888-TERS</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@ters.gov.ph</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link
                href="/report"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Report Emergency
              </Link>
              <Link
                href="/apply-rescuer"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Join as Rescuer
              </Link>
              <Link
                href="/admin"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Admin Access
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; 2024 Typhoon Emergency Response System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
