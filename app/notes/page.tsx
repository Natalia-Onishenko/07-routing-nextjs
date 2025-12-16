import type { JSX } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import {
  fetchNotes,
  fetchQueryClient,
  type FetchNotesResponse,
} from "../../lib/api";
import NotesClient from "./Notes.client";

interface NotesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const dynamic = "force-dynamic";

export default async function NotesPage({
  searchParams,
}: NotesPageProps): Promise<JSX.Element> {
  const params = await searchParams;

  const pageParam = params.page;
  const page =
    typeof pageParam === "string" && !Number.isNaN(Number(pageParam))
      ? Number(pageParam)
      : 1;

  const searchParam = params.search;
  const search = typeof searchParam === "string" ? searchParam : "";

  const queryClient = fetchQueryClient();

  await queryClient.prefetchQuery<FetchNotesResponse>({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, perPage: 10, search }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}