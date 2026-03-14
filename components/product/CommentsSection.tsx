"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/ui/ToastProvider";
import type { Comment } from "@/types";

interface CommentsSectionProps {
  promptId: string;
}

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  return new Date(iso).toLocaleDateString("ko-KR");
}

export default function CommentsSection({ promptId }: CommentsSectionProps) {
  const { user } = useAuth();
  const toast = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch(`/api/comments?promptId=${encodeURIComponent(promptId)}`)
      .then((r) => r.json())
      .then((data) => setComments(data.comments ?? []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [promptId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "오류가 발생했습니다.");
        return;
      }
      setComments((prev) => [data.comment, ...prev]);
      setContent("");
      toast.success("댓글이 등록됐습니다.");
    } catch {
      toast.error("네트워크 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(commentId: string) {
    const res = await fetch(`/api/comments?id=${commentId}`, { method: "DELETE" });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("댓글이 삭제됐습니다.");
    }
  }

  return (
    <div className="mt-10 pt-10 border-t border-gray-100 dark:border-gray-800">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
        댓글 <span className="text-gray-400 font-normal text-base">({comments.length})</span>
      </h3>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="이 프롬프트의 사용 경험을 공유해주세요... (최대 500자)"
            maxLength={500}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">{content.length}/500</span>
            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "등록 중..." : "댓글 등록"}
            </button>
          </div>
        </form>
      ) : (
        <a
          href="/auth/login"
          className="block w-full py-3 text-center text-sm text-indigo-600 dark:text-indigo-400 border border-dashed border-indigo-300 dark:border-indigo-700 rounded-xl mb-8 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
        >
          로그인 후 댓글을 작성할 수 있습니다
        </a>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((n) => (
            <div key={n} className="animate-pulse flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">
          아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs shrink-0">
                    {(comment.user?.displayName ?? "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {comment.user?.displayName ?? "익명"}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                </div>
                {user?.id === comment.userId && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    삭제
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed ml-10">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
