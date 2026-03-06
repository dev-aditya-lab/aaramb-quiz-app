"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlayCircle, FiClock, FiHash, FiCalendar } from "react-icons/fi";
import { fetchRunningQuizzes, startQuiz } from "@/services/quizService";

function formatFriendlyDateTime(value) {
  if (!value) {
    return "Now";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Scheduled";
  }

  return date.toLocaleString([], {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatStartsIn(value) {
  if (!value) {
    return "Live now";
  }

  const startsAt = new Date(value).getTime();
  const now = Date.now();
  const diffMs = startsAt - now;
  if (!Number.isFinite(diffMs) || diffMs <= 0) {
    return "Live now";
  }

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `Starts in ${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `Starts in ${hours}h ${minutes}m`;
  }
  return `Starts in ${minutes}m`;
}

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
            No active or scheduled quizzes available right now.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {quizzes.map((quiz) => {
          const isScheduled = quiz.startsAt ? new Date(quiz.startsAt) > new Date() : false;

          return (
            <article
              key={quiz._id}
              className={`group rounded-2xl border bg-slate-800/60 p-6 shadow-sm transition-all ${isScheduled
                  ? "border-slate-700/30 opacity-80"
                  : "border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-800"
                }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-bold text-white">{quiz.title}</h2>
                {isScheduled ? (
                  <span className="inline-flex items-center rounded-full bg-slate-500/10 px-2 py-0.5 text-xs font-semibold text-slate-400">
                    Scheduled
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                    Live Now
                  </span>
                )}
              </div>

              <div className="mt-4 rounded-xl border border-slate-700/40 bg-slate-900/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description / Instructions</p>
                <p className="mt-2 min-h-13 text-sm leading-6 text-slate-300">
                  {quiz.description || "No instructions provided yet. Please read quiz rules carefully before starting."}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-400">
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
                  {formatFriendlyDateTime(quiz.startsAt)}
                </span>
              </div>

              {isScheduled ? (
                <div className="mt-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-sm text-cyan-200">
                  <p className="flex items-center gap-2 font-semibold">
                    <FiClock className="h-4 w-4" />
                    {formatStartsIn(quiz.startsAt)}
                  </p>
                  <p className="mt-1 text-xs text-cyan-300/80">Scheduled for {formatFriendlyDateTime(quiz.startsAt)}</p>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={loadingId === quiz._id}
                  onClick={() => onStart(quiz._id)}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  <FiPlayCircle className="h-4 w-4" />
                  {loadingId === quiz._id ? "Starting..." : "Start Quiz"}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}