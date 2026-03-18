"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidateTag } from "next/cache";
import type { ActionResult } from "@/lib/types/diary";

export async function createDiary(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const supabase = createServerSupabaseClient();

  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const quote = (formData.get("quote") as string) || null;
  const files = formData.getAll("files") as File[];

  if (!slug || !content.trim()) {
    return { success: false, error: "slug and content are required" };
  }

  const { data: diary, error: diaryError } = await supabase
    .from("diaries")
    .insert({ slug, content, quote })
    .select("id")
    .single();

  if (diaryError || !diary) {
    console.error("Failed to insert diary:", diaryError);
    return { success: false, error: "Failed to create diary entry" };
  }

  const validFiles = files.filter((f) => f.size > 0);

  for (const file of validFiles) {
    const timestamp = Date.now();
    const storagePath = `${slug}/${diary.id}/${timestamp}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("diary-attachments")
      .upload(storagePath, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error(`Failed to upload ${file.name}:`, uploadError);
      continue;
    }

    await supabase.from("attachments").insert({
      diary_id: diary.id,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_path: storagePath,
    });
  }

  revalidateTag("diaries");

  return { success: true, data: { id: diary.id } };
}
