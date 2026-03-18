import type { Diary, Attachment } from "@/lib/types/diary";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const CDN_URL = process.env.NEXT_PUBLIC_DIARY_CDN_URL;

const HEADERS = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
};

type RawAttachment = Omit<Attachment, "public_url">;
type RawDiary = Omit<Diary, "attachments"> & { attachments: RawAttachment[] };

function mapPublicUrl(att: RawAttachment): Attachment {
  return {
    ...att,
    public_url: CDN_URL
      ? `${CDN_URL}/${att.storage_path}`
      : `${SUPABASE_URL}/storage/v1/object/public/diary-attachments/${att.storage_path}`,
  };
}

export async function getDiariesBySlug(slug: string): Promise<Diary[]> {
  const url = `${SUPABASE_URL}/rest/v1/diaries?select=*,attachments(*)&slug=eq.${encodeURIComponent(slug)}&order=created_at.desc`;

  const res = await fetch(url, {
    headers: HEADERS,
    next: { tags: ["diaries"] },
  });

  if (!res.ok) {
    console.error("Failed to fetch diaries:", await res.text());
    return [];
  }

  const data: RawDiary[] = await res.json();
  return data.map((d) => ({ ...d, attachments: d.attachments.map(mapPublicUrl) }));
}

export async function getAllDiaries(): Promise<Diary[]> {
  const url = `${SUPABASE_URL}/rest/v1/diaries?select=*,attachments(*)&order=created_at.desc`;

  const res = await fetch(url, {
    headers: HEADERS,
    next: { tags: ["diaries"] },
  });

  if (!res.ok) {
    console.error("Failed to fetch all diaries:", await res.text());
    return [];
  }

  const data: RawDiary[] = await res.json();
  return data.map((d) => ({ ...d, attachments: d.attachments.map(mapPublicUrl) }));
}
