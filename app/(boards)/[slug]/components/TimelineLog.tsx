import { Calendar, Clock, ImageIcon, Video, Mic, FileText, Quote } from "lucide-react";
import { getDiariesBySlug, getAllDiaries } from "@/lib/actions/diary";
import type { Attachment } from "@/lib/types/diary";
import { getBoardBySlug, parseGradientColors } from "../boardsData";

function AttachmentRenderer({ attachment }: { attachment: Attachment }) {
  const { file_type, public_url, file_name } = attachment;

  if (file_type.startsWith("image/")) {
    return (
      <div className="rounded-xl overflow-hidden border border-slate-100 relative group">
        <img
          src={public_url}
          alt={file_name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 drop-shadow-md" />
        </div>
      </div>
    );
  }

  if (file_type.startsWith("video/")) {
    return (
      <video controls className="w-full rounded-xl border border-slate-100">
        <source src={public_url} type={file_type} />
      </video>
    );
  }

  if (file_type.startsWith("audio/")) {
    return (
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
        <Mic className="w-5 h-5 text-slate-500 shrink-0" />
        <audio controls className="flex-1 h-8">
          <source src={public_url} type={file_type} />
        </audio>
      </div>
    );
  }

  // PDF, markdown, etc.
  return (
    <a
      href={public_url}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3 hover:bg-slate-100 transition-colors"
    >
      <FileText className="w-5 h-5 text-slate-500 shrink-0" />
      <span className="text-sm text-slate-700 truncate">{file_name}</span>
    </a>
  );
}

type Props =
  | { primaryColor: string; slug: string }
  | { slug?: undefined; primaryColor?: undefined };

function getColorForSlug(slug: string): string {
  const board = getBoardBySlug(slug);
  if (!board) return "#3b82f6";
  const [primary] = parseGradientColors(board.bgGradient);
  return primary;
}

export default async function TimelineLog(props: Props) {
  const showAll = !props.slug;
  const diaries = showAll
    ? await getAllDiaries()
    : await getDiariesBySlug(props.slug);

  if (diaries.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <p className="text-slate-400 text-lg">还没有记录，点击右下角的笔开始写日记吧</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-0">
      <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-6 space-y-12">
        {diaries.map((diary, index) => {
          const color = showAll
            ? getColorForSlug(diary.slug)
            : props.primaryColor;
          const board = showAll ? getBoardBySlug(diary.slug) : undefined;

          const date = new Date(diary.created_at);
          const dateStr = date.toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
          const timeStr = date.toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });

          return (
            <div
              key={diary.id}
              className="relative pl-8 sm:pl-12 animate-[slideIn_0.5s_ease-out_both]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Timeline Dot */}
              <div
                className="absolute -left-[9px] top-2 w-4 h-4 rounded-full border-4 border-white shadow-sm"
                style={{ backgroundColor: color }}
              />

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                      <Calendar className="w-4 h-4" style={{ color }} />
                      {dateStr}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {timeStr}
                    </div>
                    {showAll && board && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                        style={{ backgroundColor: color }}
                      >
                        {board.name}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {diary.content}
                  </p>

                  {diary.quote && (
                    <div className="mt-4 pl-4 border-l-4 border-slate-200 py-2">
                      <div className="flex items-start gap-2">
                        <Quote className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                        <p className="text-slate-500 italic text-sm leading-relaxed">
                          {diary.quote}
                        </p>
                      </div>
                    </div>
                  )}

                  {diary.attachments.length > 0 && (
                    <div
                      className={`mt-4 gap-2 ${
                        diary.attachments.length === 1 ? "" : "grid grid-cols-2"
                      }`}
                    >
                      {diary.attachments.map((att) => (
                        <AttachmentRenderer key={att.id} attachment={att} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
