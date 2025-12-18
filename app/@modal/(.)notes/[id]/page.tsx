import { fetchNoteById } from "../../../../lib/api";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const note = await fetchNoteById(params.id);

  return (
    <div>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
      <p>Tag: {note.tag}</p>
    </div>
  );
}