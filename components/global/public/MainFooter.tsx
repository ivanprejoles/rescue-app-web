"use client";

import { GlowingWrapper } from "@/components/ui/glowing-effect";
import { Hospital, Mail, Phone } from "lucide-react";
import Link from "next/link";

const MainFooter = () => {
  return (
    <footer className="p-2 w-full bg-transparent">
      <GlowingWrapper className="bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 glass-effect rounded-xl">
                  <Hospital className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-xl font-bold">Kawit Emergency App</span>
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
                  <span>Kawit Hotline: 8888</span>
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
                  href="/user/report"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Report Emergency
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-4 pt-4 text-center text-sm text-gray-400">
            <p>&copy; 2025 Kawit Emergency App. All rights reserved.</p>
          </div>
        </div>
      </GlowingWrapper>
    </footer>
  );
};

export default MainFooter;
