"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { fetchNotes, deleteNote } from "../../features/notes/noteSlice";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/useTypedDispatch";
import { Note } from "../../features/notes/types";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const notes = useSelector((state: RootState) => state.notes.notes) ?? [];
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    dispatch(fetchNotes())
      .catch(() => {
        /* ignore - UI will show empty */
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    const ok = confirm("Are you sure you want to delete this note?");
    if (!ok) return;
    setDeletingId(id);
    try {
      await dispatch(deleteNote(id));
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = (notes as Note[]).filter((n: Note) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      String(n.note_title || "").toLowerCase().includes(q) ||
      String(n.note_content || "").toLowerCase().includes(q)
    );
  });

  const excerpt = (text: string | undefined) => {
    if (!text) return "";
    const lines = text.split('\n');
    return lines.slice(0, 2).join('\n') + (lines.length > 2 ? '\n...' : '');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Notes</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">All your notes in one place — search, edit or create a new one.</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes..."
            className="border px-3 py-2 rounded w-64 bg-transparent dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={() => router.push("/dashboard/notes/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            New Note
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border rounded-lg p-8 text-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No notes yet</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Create your first note to get started.</p>
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/dashboard/notes/create")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Create note
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((note: Note) => {
            const expanded = expandedId === note.note_id;
            return (
              <article
                key={note.note_id}
                onClick={() => setExpandedId(expanded ? null : note.note_id)}
                className={`bg-white dark:bg-gray-800 border rounded-lg shadow-sm transition-all duration-200 ease-in-out ${expanded ? 'p-8 fixed inset-4 z-50 overflow-auto' : 'p-4'} cursor-pointer`}
              >
                <div className={`flex justify-between items-start ${expanded ? 'max-w-4xl mx-auto' : ''}`}>
                  <div className={expanded ? 'w-full' : 'max-w-[70%]'}>
                    <h3 className={`font-semibold text-gray-900 dark:text-gray-100 ${expanded ? 'text-2xl mb-4' : 'text-lg'}`}>{note.note_title}</h3>
                    <p className={`mt-2 ${expanded ? 'text-base leading-relaxed' : 'text-sm'} ${expanded ? 'text-gray-700 dark:text-gray-200' : 'text-gray-600 dark:text-gray-300'} whitespace-pre-wrap`}>
                      {expanded ? (note.note_content || '') : excerpt(note.note_content)}
                    </p>
                    {expanded && (
                      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 border-t pt-4">
                        <div>Created: {note.created_on}</div>
                        <div>Updated: {note.last_update}</div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/notes/${note.note_id}`); }}
                        className="text-sm text-green-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(note.note_id); }}
                        disabled={deletingId === note.note_id}
                        className="text-sm text-red-600 disabled:opacity-60"
                      >
                        {deletingId === note.note_id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                    <div className="text-xs text-gray-400">{String((note.note_content || "").length)} chars</div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
