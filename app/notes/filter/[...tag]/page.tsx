import NotePreview from "@/components/NotePreview/NotePreview";

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  return <NotePreview noteId={params.id} />;
}