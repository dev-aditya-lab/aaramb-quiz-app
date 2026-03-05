"use client";

import { useEffect, useMemo, useState } from "react";
import { FiAlertTriangle, FiCheckCircle, FiClock, FiShield, FiTarget } from "react-icons/fi";
import { useProctoring } from "@/hooks/useProctoring";
import { useQuizSession } from "@/hooks/useQuizSession";
import { reportViolation } from "@/services/quizService";
import { PROCTORING_LIMIT } from "@/types/quiz";

export default function QuizSession({ attemptId }) {
  const {
    loading,
    submitting,
    done,
    question,
    progress,
    quizTimeLimitSec,
    timerMode,
    score,
    error,
    canAnswer,
    loadQuestion,
    answer,
  } = useQuizSession(attemptId);

  const [secondsLeft, setSecondsLeft] = useState(null);

  const { warnings } = useProctoring({
    onViolation: async (reason) => {
      try {
        await reportViolation(attemptId, reason);
      } catch {
        // no-op
      }
    },
  });

  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  useEffect(() => {
    const limit = question?.timeLimitSec || (timerMode !== "question" ? quizTimeLimitSec : null);
    if (!limit) {
      queueMicrotask(() => setSecondsLeft(null));
      return;
    }
    queueMicrotask(() => setSecondsLeft(limit));
    const interval = setInterval(() => {
      setSecondsLeft((current) => {
        if (current === null) {
          return current;
        }
        return Math.max(current - 1, 0);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [question?.id, question?.timeLimitSec, quizTimeLimitSec, timerMode]);

  const warningState = useMemo(() => {
    if (warnings >= PROCTORING_LIMIT) {
      return "Disqualification threshold reached";
    }
    return `${warnings}/${PROCTORING_LIMIT} warnings`;
  }, [warnings]);

  if (loading) {
    return <div className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-700">Loading session...</div>;
  }

  if (done) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
        <div className="mb-2 flex items-center gap-2 text-lg font-semibold">
          <FiCheckCircle /> Quiz submitted
        </div>
        <p className="text-sm">Final score: {score}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
        <div className="flex items-center gap-3 text-sm text-zinc-700">
          <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1">
            <FiTarget /> {progress?.current || 0}/{progress?.total || 0}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1">
            <FiClock /> {secondsLeft ?? "--"}s
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1">
            <FiShield /> {warningState}
          </span>
        </div>
        <div className="text-sm font-semibold text-zinc-800">Score: {score}</div>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          <FiAlertTriangle /> {error}
        </div>
      ) : null}

      <h2 className="text-xl font-semibold text-zinc-900">{question?.text}</h2>

      <div className="grid gap-3">
        {question?.options?.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => answer(option.key)}
            disabled={!canAnswer}
            className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-left text-zinc-800 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="font-semibold">{option.key}.</span> {option.text}
          </button>
        ))}
      </div>

      {submitting ? <p className="text-sm text-zinc-600">Submitting answer...</p> : null}
    </div>
  );
}