"use client";
import { useCallback, useRef, MouseEventHandler } from "react";
import { Reorder } from "framer-motion";
import BoardCard from "./BoardCard";
import { useBoardOrder } from "../hooks/useBoardOrder";
import { useDragMode } from "../hooks/useDragMode";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";

// View：Reorder动画参数
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

export default function BoardsGrid({
  initialSlugs,
}: {
  initialSlugs?: string[];
}) {
  const { boards, reorder } = useBoardOrder(initialSlugs);
  useScrollRestoration("boards");
  const { isDragMode, containerRef, longPressHandlers, justActivatedRef } =
    useDragMode();

  return (
    <div className="flex flex-col items-center">
      <Reorder.Group
        ref={containerRef}
        as="div"
        axis="y"
        values={boards}
        onReorder={reorder}
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4 md:gap-6 max-w-3xl md:w-10/12 w-full"
      >
        {boards.map((board) => {
          return (
            <BoardCard
              key={board.slug}
              board={board}
              isDragMode={isDragMode}
              longPressHandlers={longPressHandlers}
              justActivatedRef={justActivatedRef}
            />
          );
        })}
      </Reorder.Group>
    </div>
  );
}
