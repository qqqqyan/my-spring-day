"use client";

import { useState, useCallback } from "react";
import { BOARDS, type Board } from "@/lib/data/boardsData";

const COOKIE_KEY = "boards-order";

function saveToCookie(slugs: string[]) {
  const value = JSON.stringify(slugs);
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(value)};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
}

export function orderBoardsBySlugs(slugs: string[]): Board[] {
  const boardMap = new Map(BOARDS.map((b) => [b.slug, b]));
  const ordered: Board[] = [];
  for (const slug of slugs) {
    const board = boardMap.get(slug);
    if (board) {
      ordered.push(board);
      boardMap.delete(slug);
    }
  }
  for (const board of Array.from(boardMap.values())) {
    ordered.push(board);
  }
  return ordered;
}

export function useBoardOrder(initialSlugs?: string[]) {
  const [boards, setBoards] = useState<Board[]>(() =>
    initialSlugs ? orderBoardsBySlugs(initialSlugs) : BOARDS,
  );

  const reorder = useCallback((newOrder: Board[]) => {
    setBoards(newOrder);
    saveToCookie(newOrder.map((b) => b.slug));
  }, []);

  return { boards, reorder };
}
