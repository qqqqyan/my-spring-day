export type Attachment = {
  id: string;
  diary_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  public_url: string; // 运行时计算，不存 DB
  created_at: string;
};

export type Diary = {
  id: string;
  slug: string;
  content: string;
  quote: string | null;
  created_at: string;
  attachments: Attachment[];
};

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
