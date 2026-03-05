"use client";

import { useEffect, useState } from "react";
import { FiPauseCircle, FiPlayCircle, FiPlusCircle, FiSlash, FiUserX } from "react-icons/fi";
import {
  createQuiz,
  disqualifyUser,
  fetchAdminQuizzes,
  fetchAdminStats,
  fetchAdminUsers,
  setUserBan,
  updateQuiz,
} from "@/services/adminService";

const emptyForm = {
  title: "",
  description: "",
  status: "draft",
  timerMode: "mixed",
  startsAt: "",
  endsAt: "",
  quizTimeLimitSec: 600,
  perQuestionTimeLimitSec: 30,
  questionsPerAttempt: 20,
  questions: [],
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [questionJson, setQuestionJson] = useState("[]");
  const [disqualifyQuizIdByUser, setDisqualifyQuizIdByUser] = useState({});
  const [error, setError] = useState("");

  async function loadAll() {
    try {
      const [s, q, u] = await Promise.all([fetchAdminStats(), fetchAdminQuizzes(), fetchAdminUsers()]);
      setStats(s);
      setQuizzes(q.quizzes || []);
      setUsers(u.users || []);
    } catch (err) {
      setError(err.message || "Failed to load admin dashboard");
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      loadAll();
    });
  }, []);

  async function onCreateQuiz(event) {
    event.preventDefault();
    try {
      const parsedQuestions = JSON.parse(questionJson || "[]");
      await createQuiz({ ...form, questions: parsedQuestions });
      setForm(emptyForm);
      setQuestionJson("[]");
      await loadAll();
    } catch (err) {
      setError(err.message || "Unable to create quiz");
    }
  }

  async function onSetStatus(quiz, status) {
    try {
      await updateQuiz(quiz._id, { ...quiz, status });
      await loadAll();
    } catch (err) {
      setError(err.message || "Unable to update quiz status");
    }
  }

  async function onBan(userId, isBanned) {
    try {
      await setUserBan(userId, isBanned);
      await loadAll();
    } catch (err) {
      setError(err.message || "Unable to update user status");
    }
  }

  async function onDisqualify(userId) {
    const quizId = disqualifyQuizIdByUser[userId];
    if (!quizId) {
      setError("Provide a quiz id for disqualification");
      return;
    }

    try {
      await disqualifyUser(userId, quizId);
      await loadAll();
    } catch (err) {
      setError(err.message || "Unable to disqualify user");
    }
  }

  return (
    <div className="space-y-6">
      {error ? <p className="rounded-md border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-4">Users: {stats?.users ?? 0}</div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">Active Quizzes: {stats?.activeQuizzes ?? 0}</div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">Completed Attempts: {stats?.completedAttempts ?? 0}</div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Create Quiz</h2>
        <form onSubmit={onCreateQuiz} className="grid gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            <span className="font-medium">Quiz Title</span>
            <input
              className="rounded-md border border-zinc-300 px-3 py-2"
              placeholder="e.g. JavaScript Fundamentals"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            <span className="font-medium">Description</span>
            <input
              className="rounded-md border border-zinc-300 px-3 py-2"
              placeholder="Short quiz summary"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            <span className="font-medium">Timer Mode</span>
            <select
              className="rounded-md border border-zinc-300 px-3 py-2"
              value={form.timerMode}
              onChange={(event) => setForm((current) => ({ ...current, timerMode: event.target.value }))}
            >
              <option value="quiz">Whole Quiz Timer</option>
              <option value="question">Per Question Timer</option>
              <option value="mixed">Both Quiz and Question Timer</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            <span className="font-medium">Quiz Start Date & Time</span>
            <input
              type="datetime-local"
              className="rounded-md border border-zinc-300 px-3 py-2"
              value={form.startsAt}
              onChange={(event) => setForm((current) => ({ ...current, startsAt: event.target.value }))}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            <span className="font-medium">Quiz End Date & Time</span>
            <input
              type="datetime-local"
              className="rounded-md border border-zinc-300 px-3 py-2"
              value={form.endsAt}
              onChange={(event) => setForm((current) => ({ ...current, endsAt: event.target.value }))}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            <span className="font-medium">Quiz Timer (seconds)</span>
            <input
              type="number"
              className="rounded-md border border-zinc-300 px-3 py-2"
              value={form.quizTimeLimitSec}
              onChange={(event) => setForm((current) => ({ ...current, quizTimeLimitSec: Number(event.target.value) }))}
              placeholder="e.g. 600"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            <span className="font-medium">Per Question Timer (seconds)</span>
            <input
              type="number"
              className="rounded-md border border-zinc-300 px-3 py-2"
              value={form.perQuestionTimeLimitSec}
              onChange={(event) =>
                setForm((current) => ({ ...current, perQuestionTimeLimitSec: Number(event.target.value) }))
              }
              placeholder="e.g. 30"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            <span className="font-medium">Questions Per User Attempt</span>
            <input
              type="number"
              className="rounded-md border border-zinc-300 px-3 py-2"
              value={form.questionsPerAttempt}
              onChange={(event) => setForm((current) => ({ ...current, questionsPerAttempt: Number(event.target.value) }))}
              placeholder="e.g. 20"
            />
          </label>
          <label className="md:col-span-2 flex flex-col gap-1 text-sm text-zinc-700">
            <span className="font-medium">Questions JSON (text, options, correctOptionKey, points, optional timeLimitSecOverride)</span>
            <textarea
              className="min-h-36 rounded-md border border-zinc-300 px-3 py-2 font-mono text-xs"
              value={questionJson}
              onChange={(event) => setQuestionJson(event.target.value)}
              placeholder='[{"text":"Q1","options":[{"key":"A","text":"Option A"}],"correctOptionKey":"A","points":5,"timeLimitSecOverride":20}]'
            />
          </label>
          <button className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-white">
            <FiPlusCircle /> Save Quiz
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Quiz Controls</h2>
        <div className="grid gap-2">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-zinc-200 p-3">
              <div>
                <p className="font-medium">{quiz.title}</p>
                <p className="text-xs text-zinc-500">Status: {quiz.status}</p>
                <p className="text-xs text-zinc-500">
                  Schedule: {quiz.startsAt ? new Date(quiz.startsAt).toLocaleString() : "Immediate"} →{" "}
                  {quiz.endsAt ? new Date(quiz.endsAt).toLocaleString() : "No end"}
                </p>
                <p className="text-xs text-zinc-500">
                  Per-question timer: {quiz.timerMode === "quiz" ? "Off" : `On (${quiz.perQuestionTimeLimitSec}s)`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onSetStatus(quiz, "running")}
                  className="inline-flex items-center gap-1 rounded-md border border-zinc-300 px-3 py-2 text-sm"
                >
                  <FiPlayCircle /> Start
                </button>
                <button
                  type="button"
                  onClick={() => onSetStatus(quiz, "paused")}
                  className="inline-flex items-center gap-1 rounded-md border border-zinc-300 px-3 py-2 text-sm"
                >
                  <FiPauseCircle /> Pause
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">User Moderation</h2>
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user._id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-zinc-200 p-3">
              <div>
                <p className="font-medium">{user.name || user.email}</p>
                <p className="text-xs text-zinc-500">{user.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onBan(user._id, !user.isBanned)}
                  className="inline-flex items-center gap-1 rounded-md border border-zinc-300 px-3 py-2 text-sm"
                >
                  <FiUserX /> {user.isBanned ? "Unban" : "Ban"}
                </button>
                <label className="flex flex-col gap-1 text-xs text-zinc-600">
                  <span className="font-medium">Quiz ID for disqualification</span>
                  <input
                    className="rounded-md border border-zinc-300 px-2 py-2 text-sm"
                    placeholder="Paste quiz ID"
                    value={disqualifyQuizIdByUser[user._id] || ""}
                    onChange={(event) =>
                      setDisqualifyQuizIdByUser((current) => ({
                        ...current,
                        [user._id]: event.target.value,
                      }))
                    }
                  />
                </label>
                <button
                  type="button"
                  onClick={() => onDisqualify(user._id)}
                  className="inline-flex items-center gap-1 rounded-md border border-zinc-300 px-3 py-2 text-sm"
                >
                  <FiSlash /> Disqualify
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}