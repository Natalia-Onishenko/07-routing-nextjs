import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { fetchNotes, fetchQueryClient } from "../../../../lib/api";
import type { NoteTag } from "../../../../types/note";

import NotesClient from "./Notes.client";

type PageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamic = "force-dynamic";

const tags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

function isNoteTag(value: string): value is NoteTag {
  return tags.includes(value as NoteTag);
}

export default async function Page({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  const rawTag = resolvedParams.slug?.[0] ?? "all";
  const tagFromUrl = decodeURIComponent(rawTag);

  const pageRaw = resolvedSearch.page;
  const searchRaw = resolvedSearch.search;

  const page =
    typeof pageRaw === "string" && Number(pageRaw) > 0 ? Number(pageRaw) : 1;

  const search = typeof searchRaw === "string" ? searchRaw : "";

  const tagForApi: NoteTag | undefined =
    tagFromUrl === "all" ? undefined : isNoteTag(tagFromUrl) ? tagFromUrl : undefined;

  const queryClient = fetchQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { page, search, tag: tagFromUrl }],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 10,
        search: search || undefined,
        ...(tagForApi ? { tag: tagForApi } : {}),
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}