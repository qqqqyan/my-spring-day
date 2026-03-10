"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Diary, Attachment, ActionResult } from "@/lib/types/diary";

// ── 获取某个 board 下的所有日记 ──────────────────────────────
export async function getDiariesBySlug(slug: string): Promise<Diary[]> {
  const supabase = createServerSupabaseClient();

  const { data: diaries, error } = await supabase
    .from("diaries")
    .select(
      `
      *,
      attachments (*)
    `
    )
    .eq("slug", slug)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch diaries:", error);
    return [];
  }

  // 为每个附件计算 public_url
  return (diaries ?? []).map((diary) => ({
    ...diary,
    attachments: (diary.attachments ?? []).map(
      (att: Omit<Attachment, "public_url">) => ({
        ...att,
        public_url: supabase.storage
          .from("diary-attachments")
          .getPublicUrl(att.storage_path).data.publicUrl,
      })
    ),
  }));
}

// ── 获取所有日记 ────────────────────────────────────────────
export async function getAllDiaries(): Promise<Diary[]> {
  const supabase = createServerSupabaseClient();

  const { data: diaries, error } = await supabase
    .from("diaries")
    .select(
      `
      *,
      attachments (*)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch all diaries:", error);
    return [];
  }

  return (diaries ?? []).map((diary) => ({
    ...diary,
    attachments: (diary.attachments ?? []).map(
      (att: Omit<Attachment, "public_url">) => ({
        ...att,
        public_url: supabase.storage
          .from("diary-attachments")
          .getPublicUrl(att.storage_path).data.publicUrl,
      })
    ),
  }));
}

// ── 创建日记 ────────────────────────────────────────────────
export async function createDiary(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const supabase = createServerSupabaseClient();

  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const quote = (formData.get("quote") as string) || null;
  const files = formData.getAll("files") as File[];

  if (!slug || !content.trim()) {
    return { success: false, error: "slug and content are required" };
  }

  // 1. 插入日记行
  const { data: diary, error: diaryError } = await supabase
    .from("diaries")
    .insert({ slug, content, quote })
    .select("id")
    .single();

  if (diaryError || !diary) {
    console.error("Failed to insert diary:", diaryError);
    return { success: false, error: "Failed to create diary entry" };
  }

  // 2. 上传文件并插入附件行
  const validFiles = files.filter((f) => f.size > 0);

  for (const file of validFiles) {
    const timestamp = Date.now();
    const storagePath = `${slug}/${diary.id}/${timestamp}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("diary-attachments")
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error(`Failed to upload ${file.name}:`, uploadError);
      continue; // 跳过失败的文件，不阻断整体
    }

    await supabase.from("attachments").insert({
      diary_id: diary.id,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_path: storagePath,
    });
  }

  // 3. 刷新页面缓存
  revalidatePath(`/${slug}`);

  return { success: true, data: { id: diary.id } };
}
