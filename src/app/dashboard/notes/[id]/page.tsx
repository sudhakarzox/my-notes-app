"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../../lib/api";
import { fetchNotes } from "../../../../features/notes/noteSlice";
import { useAppDispatch } from "@/hooks/useTypedDispatch";

export default function EditNotePage() {
  const params = useParams();
  const noteId = params.id;
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    api
      .get(`/notes/${noteId}`)
      .then((res) => {
        if (!mounted) return;
        setTitle(res.data.note_title || "");
        setContent(res.data.note_content || "");
      })
      .catch(() => {
        if (!mounted) return;
        setError("Failed to load note. Please try again.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [noteId]);

  const handleUpdate = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.put(`/notes/${noteId}`, { note_title: title, note_content: content });
      dispatch(fetchNotes());
      router.push("/dashboard");
    } catch {
      setError("Failed to update note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = confirm("Delete this note? This action cannot be undone.");
    if (!ok) return;
    setSaving(true);
    setError(null);
    try {
      await api.delete(`/notes/${noteId}`);
      dispatch(fetchNotes());
      router.push("/dashboard");
    } catch {
      setError("Failed to delete note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 overflow-auto">
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b px-6 py-4 z-10">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Edit note</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Make edits below and save. You can also delete the note.</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="inline-flex items-center gap-2 px-4 py-2 border rounded text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded text-sm disabled:opacity-60 hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="h-[60vh] bg-gray-200 dark:bg-gray-700 rounded-lg" />
              </div>
            </div>
          ) : (
          <>
            {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

            <div className="p-6">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
              <input
                type="text"
                placeholder="Note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-4 w-full mb-6 rounded-lg text-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Content</label>
              <textarea
                placeholder="Write your note..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="border p-6 w-full h-[calc(100vh-400px)] min-h-[300px] mb-4 rounded-lg resize-none bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base leading-relaxed"
              />

              <div className="sticky bottom-0 -mx-6 -mb-6 bg-white dark:bg-gray-800 border-t p-4">
                <div className="flex items-center justify-between max-w-5xl mx-auto">
                  <div className="text-sm text-gray-500">{content.length} characters</div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setTitle("");
                        setContent("");
                      }}
                      type="button"
                      className="text-sm px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleUpdate}
                      disabled={saving}
                      className="text-sm px-6 py-2 bg-emerald-500 text-white rounded-lg disabled:opacity-60 hover:bg-emerald-600"
                    >
                      {saving ? "Saving..." : "Save changes"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    </div>
  );
}