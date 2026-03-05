import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import QuizSession from "@/components/quiz/QuizSession";
import { authOptions } from "@/lib/auth";

export default async function AttemptPage({ params }) {
  const { attemptId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <section className="mx-auto max-w-3xl">
      <QuizSession attemptId={attemptId} />
    </section>
  );
}