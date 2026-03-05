import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FiShield } from "react-icons/fi";
import QuizCatalog from "@/components/quiz/QuizCatalog";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  if (session.user.isBanned) {
    return <p className="rounded-md border border-rose-300 bg-rose-50 p-4 text-rose-800">Your account is blocked.</p>;
  }

  return (
    <section className="space-y-6">
      <header className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-zinc-900">Quiz Lobby</h1>
        <p className="mt-2 text-sm text-zinc-600">Question pooling is enabled. Each user receives a different random set.</p>
      </header>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 shadow-sm">
        <p className="flex items-center gap-2 font-semibold">
          <FiShield /> Proctoring & Security Rules
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>Tab switching and copy/paste are blocked and logged.</li>
          <li>Questions are served one-by-one from the backend.</li>
          <li>Server validates timing for each submission.</li>
        </ul>
      </div>

      <QuizCatalog />
    </section>
  )
}
