export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] bg-[#080f1e] overflow-y-auto">
      {children}
    </div>
  );
}
