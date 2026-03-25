import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TimelineLog from "@/components/TimelineLog";
import { buildBoardTheme } from "@/lib/data/boardsData";

export default function AllLogsPage() {
  const theme = buildBoardTheme();
  const [blob0, blob1, blob2] = theme.blobs;

  return (
    <main className="min-h-screen relative">
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-200"
        aria-hidden
      >
        <div
          className="absolute -top-24 -left-16 w-[55vw] h-[55vw] rounded-full opacity-[0.13] blur-[90px]"
          style={{ backgroundColor: blob0 }}
        />
        <div
          className="absolute -top-72 -right-16 w-[55vw] h-[55vw] rounded-full opacity-[0.07] blur-[90px]"
          style={{ backgroundColor: blob2 }}
        />
        <div
          className="absolute top-[40%] -right-24 w-[40vw] h-[40vw] rounded-full opacity-[0.14] blur-[70px]"
          style={{ backgroundColor: blob1 }}
        />
        <div
          className="absolute bottom-[-8%] left-[15%] w-[50vw] h-[50vw] rounded-full opacity-[0.09] blur-[80px]"
          style={{ backgroundColor: blob2 }}
        />
        <div
          className="absolute top-[20%] left-[55%] w-[28vw] h-[28vw] rounded-full opacity-[0.07] blur-[60px]"
          style={{ backgroundColor: blob0 }}
        />
        <div
          className="absolute top-[70%] left-[-5%] w-[25vw] h-[25vw] rounded-full opacity-[0.09] blur-[50px]"
          style={{ backgroundColor: blob1 }}
        />
      </div>

      {/* All page content sits above blobs */}
      <div className="relative z-10">
        {/* Header */}
        <header
          className="fixed top-0 left-0 right-0 z-30 backdrop-blur-xl border-b border-slate-200/60 bg-slate-200"
          style={{ backgroundColor: theme.light }}
        >
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-white/60 hover:text-white/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">返回</span>
            </Link>
            <h1
              className="flex items-center gap-2 text-sm font-semibold"
              style={{ color: theme.accent }}
            >
              所有
            </h1>
            <div className="w-16" />
          </div>
        </header>

        {/* Main Content */}
        <div className="pt-14 max-w-3xl mx-auto pb-32">
          <TimelineLog />
        </div>
      </div>
    </main>
  );
}
