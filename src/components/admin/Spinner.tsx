/* Kept standalone so lightweight admin pages (login, redirect) don't pull in the shared admin UI */
export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
