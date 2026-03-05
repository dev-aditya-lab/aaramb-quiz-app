"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiShield,
  FiPlayCircle,
  FiUser,
  FiAward,
  FiClock,
  FiAlertCircle,
  FiZap,
  FiArrowRight,
} from "react-icons/fi";
import QuizCatalog from "@/components/quiz/QuizCatalog";
import ProfileCompletionModal from "@/components/profile/ProfileCompletionModal";

export default function DashboardHome({ sessionUser, hasRunningQuiz }) {
  const [profileComplete, setProfileComplete] = useState(
    Boolean(sessionUser.profileCompleted)
  );

  const firstName = (sessionUser.fullName || sessionUser.name || "Student").split(" ")[0];

  return (
    <section className="space-y-6">
      {!profileComplete ? (
        <ProfileCompletionModal
          profile={{
            fullName: sessionUser.fullName,
            email: sessionUser.email,
            branch: sessionUser.branch,
            yearOfStudy: sessionUser.yearOfStudy,
            studentId: sessionUser.studentId,
            phoneNumber: sessionUser.phoneNumber,
          }}
          onCompleted={() => setProfileComplete(true)}
        />
      ) : null}

      {/* ─── Welcome Header ─── */}
      <header className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 p-6 md:p-8 shadow-xl">
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-400">Quiz Lobby</p>
            <h1 className="mt-1 text-2xl font-extrabold text-white md:text-3xl">
              Welcome back, {firstName}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Aarambh Quiz Platform — Ramgarh Engineering College
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 backdrop-blur transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <FiUser className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 backdrop-blur transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <FiAward className="h-4 w-4" />
              Leaderboard
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Status Cards Row ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Quiz Status */}
        <div className={`rounded-2xl border p-5 shadow-sm transition-all ${hasRunningQuiz
            ? "border-emerald-500/30 bg-gradient-to-br from-emerald-950/50 to-slate-900"
            : "border-slate-700/50 bg-slate-800/60"
          }`}>
          <div className="flex items-center gap-3">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${hasRunningQuiz ? "bg-emerald-500/15" : "bg-white/5"
              }`}>
              {hasRunningQuiz ? (
                <FiZap className="h-5 w-5 text-emerald-400" />
              ) : (
                <FiClock className="h-5 w-5 text-slate-500" />
              )}
            </div>
            <div>
              <p className={`text-sm font-bold ${hasRunningQuiz ? "text-emerald-400" : "text-slate-400"}`}>
                {hasRunningQuiz ? "Quiz Live" : "No Active Quiz"}
              </p>
              <p className="text-xs text-slate-500">
                {hasRunningQuiz ? "A quiz is running now" : "Check back later"}
              </p>
            </div>
          </div>
        </div>

        {/* Proctoring Info */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <FiShield className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-400">Proctored</p>
              <p className="text-xs text-slate-500">Anti-cheat enabled</p>
            </div>
          </div>
        </div>

        {/* Leaderboard Link */}
        <Link
          href="/leaderboard"
          className="group rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5 shadow-sm transition-all hover:border-cyan-500/30 hover:bg-slate-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                <FiAward className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-400">Leaderboard</p>
                <p className="text-xs text-slate-500">View rankings</p>
              </div>
            </div>
            <FiArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-cyan-400" />
          </div>
        </Link>
      </div>

      {/* ─── Security Notice ─── */}
      <div className="rounded-2xl border border-blue-500/20 bg-blue-950/30 p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-blue-300">
          <FiShield className="h-4 w-4" />
          Proctoring & Security Rules
        </p>
        <ul className="mt-3 space-y-2 text-sm text-slate-400">
          <li className="flex items-start gap-2">
            <FiAlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-blue-400" />
            Tab switching and copy/paste are blocked and logged.
          </li>
          <li className="flex items-start gap-2">
            <FiAlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-blue-400" />
            Questions are served one-by-one from the backend.
          </li>
          <li className="flex items-start gap-2">
            <FiAlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-blue-400" />
            Server validates timing for each submission.
          </li>
        </ul>
      </div>

      {/* ─── No Running Quiz Banner ─── */}
      {!hasRunningQuiz && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-5 flex items-center gap-3">
          <FiClock className="h-5 w-5 flex-shrink-0 text-amber-400" />
          <p className="text-sm text-amber-300/80">
            No quizzes are currently running. Please check back later for upcoming quizzes and events.
          </p>
        </div>
      )}

      {/* ─── Quiz Catalog ─── */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-white flex items-center gap-2">
          <FiPlayCircle className="h-5 w-5 text-cyan-400" />
          Available Quizzes
        </h2>
        <QuizCatalog />
      </div>
    </section>
  );
}