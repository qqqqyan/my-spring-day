import { memo } from "react";
import Link from "next/link";
import type { Board } from "@/lib/data/boardsData";

interface BoardCardProps {
  board: Board;
  setRef: (el: HTMLElement | null) => void;
}

export const BoardCard = memo(function BoardCard({
  board,
  setRef,
}: BoardCardProps) {
  const Icon = board.icon;

  return (
    <section
      id={board.slug}
      data-section
      ref={setRef}
      className="relative h-screen w-full snap-start flex items-center justify-center overflow-hidden"
    >
      <img
        src={board.image}
        alt={board.name}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${board.overlay}`} />

      {/* Floating decorative icon — top-right only */}
      <Icon
        className="absolute top-[15%] right-[12%] w-16 h-16 text-white/[0.07] animate-float-slow"
        strokeWidth={1}
      />

      <div className="relative z-10 text-center px-6 max-w-lg">
        <h2
          className="text-4xl md:text-5xl font-bold text-white mb-4"
          style={{ lineHeight: 1.15 }}
        >
          {board.name}
        </h2>
        <p
          className="text-white/70 text-base md:text-lg mb-2 mx-auto"
          style={{ minWidth: "28ch" }}
        >
          {board.description}
        </p>
        <p className="text-white/40 text-sm mb-8 tracking-wide">
          {board.descriptionEn}
        </p>
        <Link
          href={`/${board.slug}`}
          className="inline-flex items-center justify-center px-8 h-11 rounded-full bg-white/10 border border-white/20 text-white text-sm tracking-wide backdrop-blur-sm hover:bg-white/20 hover:border-white/30 transition-all duration-300 active:scale-[0.97]"
        >
          Enter Journal →
        </Link>
      </div>
    </section>
  );
});

export default BoardCard;
