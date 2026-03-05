"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlayCircle, FiClock, FiHash, FiCalendar } from "react-icons/fi";
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
      {error ? (
        <p className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-4 text-sm text-rose-300">
          {error}
        </p>
      ) : null}

      {!error && quizzes.length === 0 ? (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-8 text-center">
          <FiClock className="mx-auto h-8 w-8 text-slate-600 mb-3" />
          <p className="text-sm text-slate-400">
            No running quizzes right now. Ask admin to start a quiz.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {quizzes.map((quiz) => (
          <article
            key={quiz._id}
            className="group rounded-2xl border border-slate-700/50 bg-slate-800/60 p-6 shadow-sm transition-all hover:border-cyan-500/30 hover:bg-slate-800"
          >
            <h2 className="text-lg font-bold text-white">{quiz.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{quiz.description}</p>

            <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1">
                <FiClock className="h-3 w-3" />
                {quiz.timerMode}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1">
                <FiHash className="h-3 w-3" />
                {quiz.questionsPerAttempt} questions
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1">
                <FiCalendar className="h-3 w-3" />
                {quiz.startsAt ? new Date(quiz.startsAt).toLocaleString() : "Now"}
              </span>
            </div>

            <button
              type="button"
              disabled={loadingId === quiz._id}
              onClick={() => onStart(quiz._id)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/30 disabled:opacity-50"
            >
              <FiPlayCircle className="h-4 w-4" />
              {loadingId === quiz._id ? "Starting..." : "Start Quiz"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}