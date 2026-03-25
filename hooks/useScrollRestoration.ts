"use client";

import { useCallback, useMemo } from "react";

export function useScrollRestoration(key: string) {
  const storageKey = `scroll-section-${key}`;

  // 读取上次停留的 section；首次访问时 sessionStorage 为空，返回 null
  const restoredSection = useMemo(() => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(storageKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSection = useCallback(
    (slug: string) => sessionStorage.setItem(storageKey, slug),
    [storageKey],
  );

  return { restoredSection, saveSection };
}
