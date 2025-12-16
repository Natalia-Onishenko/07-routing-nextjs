"use client";

import type { JSX } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";

import { fetchNotes, type FetchNotesResponse } from "../../lib/api";

import NoteList from "../../components/NoteList/NoteList";
import SearchBox from "../../components/SearchBox/SearchBox";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import NoteForm from "../../components/NoteForm/NoteForm";

import css from "./NotesPage.module.css";

export default function NotesClient(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = searchParams.get("page");
  const page = pageParam ? Number(pageParam) : 1;

  const searchParam = searchParams.get("search") ?? "";
  const [searchValue, setSearchValue] = useState(searchParam);
  const [debouncedSearch] = useDebounce(searchValue, 400);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const nextSearch = debouncedSearch.trim();

    if (nextSearch === searchParam && page === 1) return;

    const params = new URLSearchParams(searchParams.toString());

    if (nextSearch) params.set("search", nextSearch);
    else params.delete("search");

    params.set("page", "1");

    router.push(`/notes?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const { data, isLoading, error } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, searchParam],
    queryFn: () => fetchNotes({ page, perPage: 10, search: searchParam }),
    placeholderData: (prev) => prev,
  });

  const handlePageChange = (p: number): void => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p + 1));
    router.push(`/notes?${params.toString()}`);
  };

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !data) return <p>Something went wrong.</p>;

  return (
    <div className={css.app}>
      <Pagination
        pageCount={data.totalPages}
        currentPage={page - 1}
        onPageChange={handlePageChange}
      />

      <div className={css.toolbar}>
        <SearchBox value={searchValue} onChange={setSearchValue} />
        <button
          type="button"
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          + Create note
        </button>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}

      <NoteList notes={data.notes} />
    </div>
  );
}