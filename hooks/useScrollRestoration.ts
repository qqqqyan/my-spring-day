"use client";

import { useEffect } from "react";

export function useScrollRestoration(key: string) {
  const storageKey = `scroll-${key}`;

  // 还原滚动位置（仅限浏览器前进/后退，刷新不触发）
  useEffect(() => {
    const navType = (
      performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
    )?.type;
    if (navType === "back_forward") {
      const y = sessionStorage.getItem(storageKey);
      if (y) window.scrollTo(0, parseInt(y));
    }
  }, [storageKey]);

  // 记录滚动位置
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const save = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        sessionStorage.setItem(storageKey, window.scrollY.toString());
      }, 100);
    };
    window.addEventListener("scroll", save);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", save);
    };
  }, [storageKey]);
}
