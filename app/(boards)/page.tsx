import Link from "next/link";
import { Clock } from "lucide-react";
import dynamic from "next/dynamic";

const BoardsGrid = dynamic(() => import("./components/BoardsGrid"), {
  ssr: false,
});

export default function BoardsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 p-6 md:p-10">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            My Spring Day
          </h1>
          <p className="text-slate-500 mt-1 text-lg">
            Welcome to my spring day.
          </p>
        </div>
        <Link
          href="/logs"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-sm border border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow-md transition-all text-sm font-medium"
        >
          <Clock className="w-4 h-4" />
          Logs
        </Link>
      </header>
      <BoardsGrid />
    </main>
  );
}
