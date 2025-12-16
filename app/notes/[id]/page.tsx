import type { JSX } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { fetchNoteById, fetchQueryClient } from "../../../lib/api";
import NoteDetailsClient from "./NoteDetails.client";

interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps): Promise<JSX.Element> {
  const { id } = await params;

  const queryClient = fetchQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}