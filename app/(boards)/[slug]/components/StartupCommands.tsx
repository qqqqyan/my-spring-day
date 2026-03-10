"use client";

import { useState } from "react";
import { X, ListChecks } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { STEPS } from "@/lib/data/stepsData";

export default function StartupCommands({
  slug,
  accentColor,
}: {
  slug: string;
  accentColor: string;
}) {
  const [open, setOpen] = useState(false);

  const steps = STEPS[slug as keyof typeof STEPS] || [];
  return (
    <>
      {/* Floating button */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full text-white shadow-lg hover:brightness-110 flex items-center justify-center"
        style={{ backgroundColor: accentColor }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        aria-label="打开启动清单"
      >
        <ListChecks className="w-6 h-6" />
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-slate-50 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-slate-500" />
                启动步骤
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"
                aria-label="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Steps timeline */}
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <div className="relative border-l-2 border-slate-200 ml-4 space-y-10">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="relative pl-8 animate-[slideIn_0.5s_ease-out_both]"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Step number dot */}
                    <div
                      className="absolute -left-[13px] top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center"
                      style={{ backgroundColor: accentColor }}
                    >
                      <span className="text-[10px] font-bold text-white">
                        {index + 1}
                      </span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                      <div className="p-5">
                        <h3 className="font-medium text-slate-800 mb-1">
                          {step.title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
