export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="force-dark admin-bg fixed inset-0 z-[100] overflow-y-auto">
      {children}
    </div>
  );
}
