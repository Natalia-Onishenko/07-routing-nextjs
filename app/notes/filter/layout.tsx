export default function FilterLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <aside style={{ width: 220 }}>{sidebar}</aside>
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}