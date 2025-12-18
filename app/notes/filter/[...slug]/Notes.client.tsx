"use client";

import { useQuery } from "@tanstack/react-query";
import type { NoteTag } from "../../../../types/note";
import { fetchNotes, type FetchNotesResponse } from "../../../../lib/api";

export default function NotesClient({
  page,
  search,
  tag,
}: {
  page: number;
  search: string;
  tag?: NoteTag;
}) {
  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", { page, search, tag }],
    queryFn: () => fetchNotes({ page, perPage: 10, search, tag }),
  });

  if (isLoading) return <p>Loading…</p>;
  if (isError || !data) return <p>Failed to load notes</p>;

  return (
    <div>
      <h1>Notes</h1>

      {data.notes.length === 0 ? (
        <p>No notes found</p>
      ) : (
        <ul>
          {data.notes.map((n) => (
            <li key={n.id}>
              {/* важливо: відкриваємо /notes/{id} для модалки */}
              <a href={`/notes/${n.id}`}>{n.title}</a>
            </li>
          ))}
        </ul>
      )}

      <p>
        Page {page} / {data.totalPages}
      </p>
    </div>
  );
}