"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export function useDragMode() {
  const [isDragMode, setIsDragMode] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);
  // 防止长按激活后立即触发 click 导航
  const justActivatedRef = useRef(false);

  const activate = useCallback(() => {
    setIsDragMode(true);
    justActivatedRef.current = true;
    // 下一帧重置，只拦截本次 pointerup 后的 click
    requestAnimationFrame(() => {
      justActivatedRef.current = false;
    });
  }, []);

  const deactivate = useCallback(() => setIsDragMode(false), []);

  // 点击容器外部退出拖拽模式
  useEffect(() => {
    if (!isDragMode) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsDragMode(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isDragMode]);

  // 清除 timer（组件卸载时）
  useEffect(() => {
    return () => clearTimeout(longPressTimer.current);
  }, []);

  /** 绑定到每张卡片上，检测长按 */
  const longPressHandlers = useCallback(
    () => ({
      onPointerDown: () => {
        if (isDragMode) return; // 已激活则不重复计时
        longPressTimer.current = setTimeout(activate, 500);
      },
      onPointerUp: () => clearTimeout(longPressTimer.current),
      onPointerLeave: () => clearTimeout(longPressTimer.current),
      onPointerCancel: () => clearTimeout(longPressTimer.current),
    }),
    [isDragMode, activate]
  );

  return {
    isDragMode,
    deactivate,
    containerRef,
    longPressHandlers,
    /** 用于判断是否要拦截本次 click（长按刚激活） */
    justActivatedRef,
  };
}
