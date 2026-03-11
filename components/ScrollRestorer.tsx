"use client";

import { useScrollRestoration } from "@/hooks/useScrollRestoration";

export function ScrollRestorer({ pageKey }: { pageKey: string }) {
  useScrollRestoration(pageKey);
  return null;
}
