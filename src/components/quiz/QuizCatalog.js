"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlayCircle } from "react-icons/fi";
import { fetchRunningQuizzes, startQuiz } from "@/services/quizService";

export default function QuizCatalog() {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchRunningQuizzes()
      .then((data) => setQuizzes(data.quizzes || []))
      .catch((err) => setError(err.message || "Failed to fetch quizzes"));
  }, []);

  async function onStart(quizId) {
    setLoadingId(quizId);
    setError("");
    try {
      const result = await startQuiz(quizId);
      router.push(`/quiz/${result.attemptId}`);
    } catch (err) {
      setError(err.message || "Unable to start quiz");
    } finally {
      setLoadingId("");
    }
  }

  return (
    <section className="space-y-4">
      {error ? <p className="rounded-md border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800">{error}</p> : null}
      {!error && quizzes.length === 0 ? (
        <p className="rounded-xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 shadow-sm">
          No running quizzes right now. Ask admin to start a quiz.
        </p>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        {quizzes.map((quiz) => (
          <article key={quiz._id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <h2 className="text-lg font-semibold text-zinc-900">{quiz.title}</h2>
            <p className="mt-2 text-sm text-zinc-600">{quiz.description}</p>
            <div className="mt-3 text-xs text-zinc-500">
              <p>Timer Mode: {quiz.timerMode}</p>
              <p>Questions: {quiz.questionsPerAttempt}</p>
              <p>Starts: {quiz.startsAt ? new Date(quiz.startsAt).toLocaleString() : "Now"}</p>
              <p>Ends: {quiz.endsAt ? new Date(quiz.endsAt).toLocaleString() : "No end"}</p>
            </div>
            <button
              type="button"
              disabled={loadingId === quiz._id}
              onClick={() => onStart(quiz._id)}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60"
            >
              <FiPlayCircle /> {loadingId === quiz._id ? "Starting..." : "Start Quiz"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}