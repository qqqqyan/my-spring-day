"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reorder } from "framer-motion";
import { useRef } from "react";
import { useBoardOrder } from "./useBoardOrder";
import { parseGradientColors, type Board } from "@/lib/data/boardsData";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

function BoardCard({ board }: { board: Board }) {
  const Icon = board.icon;
  const isDragging = useRef(false);
  const [from, to] = parseGradientColors(board.bgGradient);

  return (
    <Reorder.Item
      value={board}
      variants={item}
      className="w-full list-none cursor-grab active:cursor-grabbing"
      whileDrag={{ scale: 1.03, zIndex: 50 }}
      onDragStart={() => {
        isDragging.current = true;
      }}
      onDragEnd={() => {
        setTimeout(() => {
          isDragging.current = false;
        }, 0);
      }}
    >
      <Link
        href={`/${board.slug}`}
        className="block group"
        onClick={(e) => {
          if (isDragging.current) e.preventDefault();
        }}
        draggable={false}
      >
        <div
          className="rounded-2xl shadow-lg p-6 h-48 sm:h-64 flex flex-col justify-between transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl select-none"
          style={{
            backgroundImage: `linear-gradient(to bottom right, ${from}, ${to})`,
          }}
        >
          <div className="flex items-start justify-between">
            <div
              className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm"
              aria-hidden
            >
              <Icon className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
            <ChevronRight className="w-5 h-5 text-white/80 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white drop-shadow-sm">
              {board.name} ({board.nameEn})
            </h2>
            <p className="text-white/90 text-sm mt-0.5">{board.description}</p>
          </div>
        </div>
      </Link>
    </Reorder.Item>
  );
}

export default function BoardsGrid({
  initialSlugs,
}: {
  initialSlugs?: string[];
}) {
  const { boards, reorder } = useBoardOrder(initialSlugs);

  return (
    <Reorder.Group
      as="div"
      axis="y"
      values={boards}
      onReorder={reorder}
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 md:gap-6 w-full max-w-3xl mx-auto"
    >
      {boards.map((board) => (
        <BoardCard key={board.slug} board={board} />
      ))}
    </Reorder.Group>
  );
}
