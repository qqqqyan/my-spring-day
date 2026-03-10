import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StartupCommands from "./StartupCommands";
import TimelineLog from "./TimelineLog";
import AIChatDrawer from "./AIChatDrawer";
import { getBoardBySlug, parseGradientColors } from "../boardsData";
import { NewLogModal } from "./NewLogModal";

type Props = { params: Promise<{ slug: string }> };

export default async function BoardDetailPage({ params }: Props) {
  const { slug } = await params;
  const board = getBoardBySlug(slug);

  if (!board) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800">404</h1>
          <p className="mt-2 text-slate-600">Board not found.</p>
        </div>
      </main>
    );
  }

  const [primaryColor, accentColor] = parseGradientColors(board.bgGradient);

  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Header */}
      <header
        className={`sticky top-0 z-30 bg-gradient-to-r ${board.bgGradient} text-white shadow-md`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-2xl font-bold tracking-tight">{board.name}</h2>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto pb-32">
        <TimelineLog primaryColor={primaryColor} slug={slug} />
      </main>

      {/* Drawers */}
      <StartupCommands slug={slug} accentColor={accentColor} />

      <AIChatDrawer accentColor={accentColor} />

      {/* Modals */}
      <NewLogModal accentColor={accentColor} slug={slug} />
    </main>
  );
}
