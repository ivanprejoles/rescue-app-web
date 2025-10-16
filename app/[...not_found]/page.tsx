import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, CircleAlert as AlertCircle, User } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <AlertCircle className="w-96 h-96 text-blue-600" />
          </div>
          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-100 dark:bg-blue-950 rounded-full">
              <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                Page Not Found
              </span>
            </div>

            <h1 className="text-8xl md:text-9xl font-bold text-slate-900 dark:text-slate-100">
              404
            </h1>

            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200">
                {`We Can't Find That Page`}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                {`Just like a rescue mission, sometimes we need to redirect. The
                page you're looking for might have been moved or doesn't exist.`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
          <Button
            asChild
            size="lg"
            className="min-w-[180px] bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Return Home
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="min-w-[180px]">
            <Link href="/user" className="flex items-center gap-2">
              <User className="w-5 h-5" />
              User Dashboard
            </Link>
          </Button>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Need help? Contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
