import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-paper px-5 text-center">
      <p className="text-[11px] tracking-[0.24em] text-jade uppercase">The room is empty</p>
      <h1 className="display mt-4 text-6xl">This folio was not found.</h1>
      <Link href="/" className="mt-8 rounded-full bg-ink px-6 py-3 text-[12px] tracking-[0.16em] text-ivory uppercase">
        Return to the house
      </Link>
    </div>
  );
}
