import type { JSX } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import {
  fetchNotes,
  fetchQueryClient,
  type FetchNotesResponse,
} from "../../../../lib/api";
import type { NoteTag } from "../../../../types/note";

import NotesClient from "./Notes.client";

export const dynamic = "force-dynamic";

type MaybePromise<T> = T | Promise<T>;

const TAGS: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

function toNoteTag(value: string | undefined): NoteTag | undefined {
  if (!value || value === "all") return undefined;
  return TAGS.includes(value as NoteTag) ? (value as NoteTag) : undefined;
}

export default async function Page({
  params,
  searchParams,
}: {
  params: MaybePromise<{ slug: string[] }>;
  searchParams?: MaybePromise<{ [key: string]: string | string[] | undefined }>;
}): Promise<JSX.Element> {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const tag = toNoteTag(resolvedParams.slug?.[0]);

  const pageParam = resolvedSearchParams.page;
  const page =
    typeof pageParam === "string" && !Number.isNaN(Number(pageParam))
      ? Number(pageParam)
      : 1;

  const searchParam = resolvedSearchParams.search;
  const search = typeof searchParam === "string" ? searchParam : "";

  const queryClient = fetchQueryClient();

  await queryClient.prefetchQuery<FetchNotesResponse>({
    queryKey: ["notes", { page, search, tag }],
    queryFn: () => fetchNotes({ page, perPage: 10, search, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient page={page} search={search} tag={tag} />
    </HydrationBoundary>
  );
}