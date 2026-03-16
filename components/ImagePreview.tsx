"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

interface ImageItem {
  id: string;
  src: string;
  alt: string;
}

interface LightboxProps {
  images: ImageItem[];
  initialIndex: number;
  onClose: () => void;
}

function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOrigin = useRef<{
    mx: number;
    my: number;
    ox: number;
    oy: number;
  } | null>(null);

  const resetTransform = useCallback(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, []);

  const prev = useCallback(() => {
    resetTransform();
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length, resetTransform]);

  const next = useCallback(() => {
    resetTransform();
    setIndex((i) => (i + 1) % images.length);
  }, [images.length, resetTransform]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setScale((s) => {
        const next = Math.min(Math.max(s - e.deltaY * 0.001, 0.25), 4);
        if (next === 1) setPos({ x: 0, y: 0 });
        return next;
      });
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const current = images[index];

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="absolute w-full flex items-center justify-between px-4 py-3 shrink-0 bg-black/30 z-[9999]"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-white/60 text-sm select-none">
          {images.length > 1 && `${index + 1} / ${images.length}`}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((s) => Math.min(s + 0.25, 4))}
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="放大"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => setScale((s) => Math.max(s - 0.25, 0.25))}
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="缩小"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={resetTransform}
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="重置"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors ml-1"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Image area */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Prev */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2 sm:left-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            aria-label="上一张"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <img
          src={current.src}
          alt={current.alt}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => {
            if (scale <= 1) return;
            e.preventDefault();
            dragOrigin.current = {
              mx: e.clientX,
              my: e.clientY,
              ox: pos.x,
              oy: pos.y,
            };
            setDragging(true);
          }}
          onMouseMove={(e) => {
            if (!dragOrigin.current) return;
            setPos({
              x: dragOrigin.current.ox + e.clientX - dragOrigin.current.mx,
              y: dragOrigin.current.oy + e.clientY - dragOrigin.current.my,
            });
          }}
          onMouseUp={() => {
            dragOrigin.current = null;
            setDragging(false);
          }}
          onMouseLeave={() => {
            dragOrigin.current = null;
            setDragging(false);
          }}
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
            transition: dragging ? "none" : "transform 0.2s ease",
            maxWidth: "90vw",
            maxHeight: "80vh",
            objectFit: "contain",
            cursor: scale > 1 ? (dragging ? "grabbing" : "grab") : "default",
            userSelect: "none",
          }}
          draggable={false}
        />

        {/* Next */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-2 sm:right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            aria-label="下一张"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="flex items-center justify-center gap-2 py-3 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => {
                setScale(1);
                setIndex(i);
              }}
              className={`w-10 h-10 rounded-md overflow-hidden border-2 transition-all ${
                i === index
                  ? "border-white scale-110"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return createPortal(content, document.body);
}

export function ImageGallery({ images }: { images: ImageItem[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className={`gap-2 ${images.length === 1 ? "" : "grid grid-cols-2"}`}>
        {images.map((img, i) => (
          <div
            key={img.id}
            className="rounded-xl overflow-hidden border border-slate-100 relative group cursor-zoom-in"
            onClick={() => setLightboxIndex(i)}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
