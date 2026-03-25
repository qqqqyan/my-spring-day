"use client";

import { useState, useCallback } from "react";
import { BOARDS, type Board } from "@/lib/data/boardsData";

const LS_KEY = "boards-order";

function loadFromStorage(): string[] | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(slugs: string[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(slugs));
  } catch {
    // ignore
  }
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

export function useBoardOrder() {
  const [boards, setBoards] = useState<Board[]>(() => {
    const slugs = loadFromStorage();
    return slugs ? orderBoardsBySlugs(slugs) : BOARDS;
  });

  const reorder = useCallback((newOrder: Board[]) => {
    setBoards(newOrder);
    saveToStorage(newOrder.map((b) => b.slug));
  }, []);

  return { boards, reorder };
}
