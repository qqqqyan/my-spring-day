"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Reorder } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";
import BoardCard from "./components/BoardCard";
import { useBoardOrder } from "./hooks/useBoardOrder";
import { useDragMode } from "./hooks/useDragMode";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import type { Board } from "@/lib/data/boardsData";

function NavItem({
  board,
  isActive,
  onScrollTo,
  isDragMode,
  longPressHandlers,
  justActivatedRef,
}: {
  board: Board;
  isActive: boolean;
  onScrollTo: (slug: string) => void;
  isDragMode: boolean;
  longPressHandlers: () => {
    onPointerDown: () => void;
    onPointerUp: () => void;
    onPointerLeave: () => void;
    onPointerCancel: () => void;
  };
  justActivatedRef: React.RefObject<boolean>;
}) {
  const isDraggingRef = useRef(false);
  const handlers = longPressHandlers();

  return (
    <Reorder.Item
      value={board}
      as="div"
      className="shrink-0 list-none"
      dragListener={isDragMode}
      onDragStart={() => {
        isDraggingRef.current = true;
      }}
      onDragEnd={() => {
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 0);
      }}
      onClick={() => {
        if (!isDraggingRef.current && !justActivatedRef.current)
          onScrollTo(board.slug);
      }}
      {...handlers}
    >
      <div
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 select-none ${
          isDragMode ? "animate-wiggle cursor-grab" : "cursor-pointer"
        } ${
          isActive
            ? "bg-white/20 text-white"
            : "text-white/60 hover:text-white/90 hover:bg-white/10"
        }`}
      >
        {board.name}
      </div>
    </Reorder.Item>
  );
}

export default function BoardsPage() {
  const { boards, reorder } = useBoardOrder();
  useScrollRestoration("boards");
  const { isDragMode, deactivate, containerRef, longPressHandlers, justActivatedRef } =
    useDragMode();

  const [activeSection, setActiveSection] = useState("welcome");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { root: container, threshold: 0.5 },
    );

    const sections = container.querySelectorAll("[data-section]");
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [boards]);

  const scrollTo = useCallback((id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div
          ref={containerRef}
          className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-1 overflow-x-auto scrollbar-hide"
        >
          <button
            onClick={() => {
              if (isDragMode) {
                deactivate();
                return;
              }
              scrollTo("welcome");
            }}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeSection === "welcome"
                ? "bg-white/20 text-white"
                : "text-white/60 hover:text-white/90 hover:bg-white/10"
            }`}
          >
            <Sparkles className="inline-block w-3.5 h-3.5 mr-1 -mt-0.5" />
            首页
          </button>

          <Reorder.Group
            as="div"
            axis="x"
            values={boards}
            onReorder={reorder}
            className="flex items-center gap-1"
          >
            {boards.map((board) => (
              <NavItem
                key={board.slug}
                board={board}
                isActive={activeSection === board.slug}
                onScrollTo={scrollTo}
                isDragMode={isDragMode}
                longPressHandlers={longPressHandlers}
                justActivatedRef={justActivatedRef}
              />
            ))}
          </Reorder.Group>
        </div>
      </nav>

      {/* Scroll container */}
      <div
        ref={scrollContainerRef}
        className="h-full w-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
      >
        {/* Welcome section */}
        <section
          id="welcome"
          data-section
          ref={(el) => {
            sectionRefs.current["welcome"] = el;
          }}
          className="relative h-screen w-full snap-start flex items-center justify-center overflow-hidden"
        >
          <img
            src="/welcome.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
          <div className="relative z-10 text-center px-6">
            <p className="text-white/60 text-sm tracking-[0.3em] uppercase mb-4 animate-fade-in">
              Welcome to
            </p>
            <h1
              className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in"
              style={{ lineHeight: 1.1, animationDelay: "200ms" }}
            >
              My Spring Day
            </h1>
            <p
              className="text-white/70 text-lg md:text-xl max-w-md mx-auto mb-12 animate-fade-in"
              style={{ animationDelay: "400ms" }}
            >
              记录生活的每一面，在文字中遇见真实的自己
            </p>
            <button
              onClick={() => scrollTo(boards[0]?.slug)}
              className="animate-fade-in text-white/50 hover:text-white/80 transition-colors"
              style={{ animationDelay: "600ms" }}
            >
              <ChevronDown className="w-8 h-8 animate-bounce" />
            </button>
          </div>
        </section>

        {/* Board sections */}
        {boards.map((board) => (
          <BoardCard
            key={board.slug}
            board={board}
            setRef={(el) => {
              sectionRefs.current[board.slug] = el;
            }}
          />
        ))}
      </div>
    </div>
  );
}
