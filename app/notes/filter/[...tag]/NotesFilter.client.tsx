"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactElement } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";

import { fetchNotes, type FetchNotesResponse } from "../../../../lib/api";
import type { NoteTag } from "../../../../types/note";

import NoteList from "../../../../components/NoteList/NoteList";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import Pagination from "../../../../components/Pagination/Pagination";

import css from "./NotesPage.module.css";

type Params = {
  tag?: string[];
};

export default function NotesFilterClient(): ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<Params>();

  const rawTag = params?.tag?.[0] ?? "all"; 
  const tagFromUrl = decodeURIComponent(rawTag);

  const tagForApi: NoteTag | undefined =
    tagFromUrl === "all" ? undefined : (tagFromUrl as NoteTag);

  const pageParam = searchParams.get("page");
  const searchParam = searchParams.get("search") ?? "";
  const page = pageParam ? Number(pageParam) : 1;

  const [searchValue, setSearchValue] = useState<string>(searchParam);
  const [debouncedSearch] = useDebounce(searchValue, 400);

  
  useEffect(() => {
    const next = new URLSearchParams(searchParams.toString());

    if (debouncedSearch) next.set("search", debouncedSearch);
    else next.delete("search");

    next.set("page", "1");

    router.push(`/notes/filter/${encodeURIComponent(tagFromUrl)}?${next.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, tagFromUrl]);

  const queryKey = useMemo(
    () => ["notes", tagFromUrl, page, searchParam],
    [tagFromUrl, page, searchParam]
  );

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey,
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 10,
        search: searchParam || undefined,
        tag: tagForApi,
      }),
    placeholderData: (prev) => prev, 
  });

  const handlePageChange = (selectedPage: number) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("page", String(selectedPage + 1));

    router.push(`/notes/filter/${encodeURIComponent(tagFromUrl)}?${next.toString()}`);
  };

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError || !data) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.toolbar}>
        <SearchBox value={searchValue} onChange={setSearchValue} />
      </div>

      <Pagination
        pageCount={data.totalPages}
        currentPage={page - 1}
        onPageChange={handlePageChange}
      />

      <NoteList notes={data.notes} />
    </div>
  );
}