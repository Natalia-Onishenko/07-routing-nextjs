import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  sidebar: ReactNode;
};

export default function FilterLayout({ children, sidebar }: Props) {
  return (
    <div style={{ display: "flex", gap: 24 }}>
      <aside style={{ width: 240 }}>
        {sidebar}
      </aside>

      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}