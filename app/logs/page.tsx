import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TimelineLog from "../(boards)/[slug]/TimelineLog";

export default function AllLogsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link
            href="/"
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">All Logs</h2>
        </div>
      </header>

      <div className="max-w-5xl mx-auto pb-16">
        <TimelineLog />
      </div>
    </main>
  );
}
