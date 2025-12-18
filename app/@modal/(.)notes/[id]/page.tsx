import NotePreviewClient from "./NotePreview.client";

export default function Page({ params }: { params: { id: string } }) {
  return <NotePreviewClient noteId={params.id} />;
}