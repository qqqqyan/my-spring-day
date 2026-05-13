"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ListChecks, X } from "lucide-react";
import { STEPS } from "@/lib/data/stepsData";
import type { BoardTheme } from "@/lib/data/boardsData";

export default function StartupCommands({
  slug,
  theme,
}: {
  slug: string;
  theme: BoardTheme;
}) {
  const { accent: accentColor } = theme;
  const [open, setOpen] = useState(false);
  const steps = STEPS[slug as keyof typeof STEPS] || [];

  if (steps.length === 0) return null;

  const stepsContent = (
    <div className="relative border-l border-slate-200/80 ml-3 space-y-4">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className="relative pl-6 animate-[slideIn_0.5s_ease-out_both]"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <div
            className="absolute -left-[11px] top-1 w-5 h-5 rounded-full border-[3px] border-white shadow-sm flex items-center justify-center"
            style={{ backgroundColor: accentColor }}
          >
            <span className="text-[9px] font-bold text-white">{index + 1}</span>
          </div>

          <div className="rounded-xl bg-white/70 border border-white/70 px-3 py-2.5 shadow-sm">
            <h3 className="font-medium text-slate-800 text-sm mb-1">
              {step.title}
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              {step.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block fixed top-20 right-6 z-20 w-80 rounded-2xl border border-white/60 bg-white/65 shadow-xl backdrop-blur-xl">
        <header className="flex items-center gap-2 px-4 py-3 border-b border-white/60">
          <span
            className="w-8 h-8 rounded-xl text-white flex items-center justify-center shadow-sm"
            style={{ backgroundColor: accentColor }}
          >
            <ListChecks className="w-4 h-4" />
          </span>
          <h2 className="text-sm font-semibold text-slate-800">启动步骤</h2>
        </header>

        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto px-4 py-4">
          {stepsContent}
        </div>
      </aside>

      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-40 lg:hidden w-14 h-14 rounded-full text-white shadow-lg hover:brightness-110 flex items-center justify-center"
        style={{ backgroundColor: accentColor }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        aria-label="打开启动清单"
      >
        <ListChecks className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm z-50 lg:hidden shadow-2xl flex flex-col backdrop-blur-xl border-l bg-white/75 border-white/60"
          >
            <header className="flex items-center justify-between px-5 py-4 border-b border-white/60">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-slate-500" />
                启动步骤
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                aria-label="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              {stepsContent}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
