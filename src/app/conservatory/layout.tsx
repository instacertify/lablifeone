import { redirect } from "next/navigation";
import { ConservatoryShell } from "@/components/conservatory/Shell";
import { getConservatorySession } from "@/lib/auth";

export default async function ConservatoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

export async function ConservatoryGate({ children }: { children: React.ReactNode }) {
  const session = await getConservatorySession();
  if (!session) redirect("/conservatory/login");
  return <ConservatoryShell name={session.name}>{children}</ConservatoryShell>;
}
