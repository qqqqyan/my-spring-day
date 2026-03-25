"use client";

import React, { useState, useRef, useTransition } from "react";
import {
  Quote,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  Video,
  Mic,
  File,
  Pen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/Modal";
import { createDiary } from "@/lib/actions/diary";
import type { BoardTheme } from "@/lib/data/boardsData";

interface NewLogModalProps {
  theme: BoardTheme;
  slug: string;
}

export function NewLogModal({ theme, slug }: NewLogModalProps) {
  const { accent: accentColor, light, dark } = theme;
  const [open, setOpen] = useState(false);

  const [content, setContent] = useState("");
  const [quote, setQuote] = useState("");
  const [showQuote, setShowQuote] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && files.length === 0) return;

    const formData = new FormData();
    formData.append("slug", slug);
    formData.append("content", content);
    if (quote) formData.append("quote", quote);
    files.forEach((file) => formData.append("files", file));

    startTransition(async () => {
      const result = await createDiary(formData);
      if (result.success) {
        setContent("");
        setQuote("");
        setShowQuote(false);
        setFiles([]);
        setOpen(false);
        setError(null);
      } else {
        setError(result.error);
      }
    });
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-5 h-5" />;
    if (type.startsWith("video/")) return <Video className="w-5 h-5" />;
    if (type.startsWith("audio/")) return <Mic className="w-5 h-5" />;
    if (type === "text/markdown" || type.includes("markdown"))
      return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-[10.5rem] right-6 z-40 w-14 h-14 rounded-full text-white shadow-lg hover:brightness-110 flex items-center justify-center"
        style={{ backgroundColor: accentColor }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        aria-label="点击记录日记"
      >
        <Pen className="w-6 h-6" />
      </motion.button>

      {/* Modal */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="New Log"
        containerStyle={{
          backgroundColor: "rgba(255,255,255,0.3)",
          borderColor: "rgba(255,255,255,0.6)",
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="what happened today..."
              className="w-full h-40 p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:dark-2 focus:border-transparent resize-none outline-none transition-all text-slate-700"
              style={{ "--tw-dark-color": accentColor } as React.CSSProperties}
              required={files.length === 0}
            />
          </div>

          <AnimatePresence>
            {showQuote && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="relative overflow-hidden"
              >
                <div className="relative">
                  <div className="absolute left-4 top-4 text-slate-300">
                    <Quote className="w-6 h-6" />
                  </div>
                  <textarea
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="worth remembering..."
                    className="w-full p-4 pl-12 bg-slate-50 border-l-4 border-y border-r border-slate-200 rounded-r-2xl focus:bg-white focus:dark-2 focus:border-transparent resize-none outline-none transition-all text-slate-600 italic"
                    style={
                      {
                        borderLeftColor: accentColor,
                        "--tw-dark-color": accentColor,
                      } as React.CSSProperties
                    }
                    rows={2}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowQuote(false);
                      setQuote("");
                    }}
                    className="absolute right-3 top-3 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {files.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">
                附件 ({files.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl group hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div
                        className="p-2 bg-white rounded-lg shadow-sm border border-slate-100"
                        style={{ color: accentColor }}
                      >
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium text-slate-700 truncate">
                          {file.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowQuote((prev) => !prev)}
                className={
                  "p-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm font-medium"
                }
              >
                <Quote className="w-5 h-5" />
                <span className="hidden sm:inline">添加引用</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                <Paperclip className="w-5 h-5" />
                <span className="hidden sm:inline">上传附件</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept="image/*,video/*,audio/*,.md,.pdf"
              />
            </div>

            <button
              type="submit"
              disabled={isPending || (!content.trim() && files.length === 0)}
              className="px-8 py-3 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: accentColor }}
            >
              {isPending ? "发布中..." : "发布记录"}
            </button>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </form>
      </Modal>
    </>
  );
}
