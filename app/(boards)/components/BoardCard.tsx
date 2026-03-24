import { memo, useRef } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reorder, motion } from "framer-motion";
import { parseGradientColors, type Board } from "@/lib/data/boardsData";

// View：Reorder动画参数
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

// View：卡片抖动效果
const wobbleAnimate = { rotate: [-0.5, 0.5] };
const wobbleTransition = {
  repeat: Infinity,
  repeatType: "mirror" as const,
  duration: 0.15,
};
const stillTransition = { duration: 0.2 };

interface BoardCardProps {
  board: Board;
  isDragMode: boolean;
  longPressHandlers: () => React.HTMLAttributes<HTMLElement>;
  justActivatedRef: React.MutableRefObject<boolean>;
}

export const BoardCard = memo(function BoardCard({
  board,
  isDragMode,
  longPressHandlers,
  justActivatedRef,
}: BoardCardProps) {
  const Icon = board.icon;
  const isDraggingRef = useRef(false);
  const [from, to] = parseGradientColors(board.bgGradient);

  return (
    <Reorder.Item
      value={board}
      variants={item}
      dragListener={isDragMode}
      className={`list-none ${isDragMode ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
      whileDrag={{ scale: 1.03, zIndex: 50, rotate: 0 }}
      onDragStart={() => {
        isDraggingRef.current = true;
      }}
      onDragEnd={() => {
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 0);
      }}
    >
      <motion.div
        animate={isDragMode ? wobbleAnimate : { rotate: 0 }}
        transition={isDragMode ? wobbleTransition : stillTransition}
      >
        <Link
          href={`/${board.slug}`}
          className="block group"
          draggable={false}
          onClick={(e) => {
            // 正在拖拽，或刚刚通过长按激活了拖拽模式，均拦截导航
            if (isDraggingRef.current || isDragMode || justActivatedRef.current)
              e.preventDefault();
          }}
        >
          <div
            {...longPressHandlers()}
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
              <p className="text-white/90 text-sm mt-0.5">
                {board.description}
              </p>
            </div>
          </div>
        </Link>
      </motion.div>
    </Reorder.Item>
  );
});

export default BoardCard;
