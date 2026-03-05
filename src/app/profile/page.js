"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FiUser,
  FiMail,
  FiBookOpen,
  FiCalendar,
  FiHash,
  FiPhone,
  FiCamera,
  FiSave,
  FiClock,
  FiAward,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

const BRANCH_OPTIONS = [
  "computer science and engineering",
  "mechanical engineering",
  "civil engineering",
  "electrical engineering",
  "electronics and communication engineering",
];

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    image: "",
    branch: "",
    yearOfStudy: "",
    studentId: "",
    phoneNumber: "",
  });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status !== "authenticated") {
      return;
    }

    async function loadProfileData() {
      try {
        setLoading(true);
        setError("");

        const [profileResponse, historyResponse] = await Promise.all([fetch("/api/profile"), fetch("/api/profile/history")]);
        const profileData = await profileResponse.json();
        const historyData = await historyResponse.json();

        if (!profileResponse.ok) {
          throw new Error(profileData.message || "Unable to load profile");
        }
        if (!historyResponse.ok) {
          throw new Error(historyData.message || "Unable to load profile history");
        }

        const profile = profileData.profile || {};
        setForm({
          fullName: profile.fullName || "",
          email: profile.email || "",
          image: profile.image || "",
          branch: profile.branch || "",
          yearOfStudy: String(profile.yearOfStudy || ""),
          studentId: profile.studentId || "",
          phoneNumber: profile.phoneNumber || "",
        });
        setHistory(historyData.attempts || []);
      } catch (err) {
        setError(err.message || "Unable to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfileData();
  }, [router, status]);

  const canSubmit = useMemo(() => {
    return Boolean(form.fullName && form.branch && form.yearOfStudy && form.studentId && form.phoneNumber);
  }, [form]);

  async function onSubmit(event) {
    event.preventDefault();
    if (!canSubmit) {
      setError("Please fill all required profile fields");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          branch: form.branch,
          yearOfStudy: Number(form.yearOfStudy),
          studentId: form.studentId,
          phoneNumber: form.phoneNumber,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update profile");
      }

      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          <p className="mt-3 text-sm text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* ─── Profile Header ─── */}
      <header className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 p-6 md:p-8 shadow-xl">
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {form.image ? (
              <Image
                src={form.image}
                alt={form.fullName || "Profile"}
                width={80}
                height={80}
                className="rounded-2xl border-2 border-white/10 object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-white/10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                <FiUser className="h-8 w-8 text-slate-400" />
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-cyan-400">Student Profile</p>
            <h1 className="mt-1 text-2xl font-extrabold text-white">
              {form.fullName || "Your Profile"}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage your student details and review your quiz history.
            </p>
          </div>
        </div>
      </header>

      {/* ─── Profile Form ─── */}
      <form onSubmit={onSubmit} className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-6 md:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
          <FiUser className="h-5 w-5 text-cyan-400" />
          Personal Information
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Full Name */}
          <label className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-sm font-medium text-slate-300">
              <FiUser className="h-3.5 w-3.5 text-slate-500" />
              Full Name
            </span>
            <input
              className="rounded-xl border border-slate-600/50 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-cyan-500/50 focus:bg-slate-700"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={(e) => setForm((c) => ({ ...c, fullName: e.target.value }))}
              required
            />
          </label>

          {/* Email */}
          <label className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-sm font-medium text-slate-300">
              <FiMail className="h-3.5 w-3.5 text-slate-500" />
              Email (GitHub)
            </span>
            <input
              className="rounded-xl border border-slate-600/50 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
              value={form.email}
              disabled
            />
          </label>

          {/* Branch */}
          <label className="flex flex-col gap-1.5 md:col-span-2">
            <span className="flex items-center gap-1.5 text-sm font-medium text-slate-300">
              <FiBookOpen className="h-3.5 w-3.5 text-slate-500" />
              Branch
            </span>
            <select
              className="rounded-xl border border-slate-600/50 bg-slate-700/50 px-4 py-2.5 text-sm text-white transition-colors focus:border-cyan-500/50 focus:bg-slate-700"
              value={form.branch}
              onChange={(e) => setForm((c) => ({ ...c, branch: e.target.value }))}
              required
            >
              <option value="">Select your branch</option>
              {BRANCH_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          {/* Year of Study */}
          <label className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-sm font-medium text-slate-300">
              <FiCalendar className="h-3.5 w-3.5 text-slate-500" />
              Year of Study
            </span>
            <input
              type="number"
              min={1}
              max={8}
              className="rounded-xl border border-slate-600/50 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-cyan-500/50 focus:bg-slate-700"
              placeholder="e.g. 2"
              value={form.yearOfStudy}
              onChange={(e) => setForm((c) => ({ ...c, yearOfStudy: e.target.value }))}
              required
            />
          </label>

          {/* Student ID */}
          <label className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-sm font-medium text-slate-300">
              <FiHash className="h-3.5 w-3.5 text-slate-500" />
              Student ID
            </span>
            <input
              className="rounded-xl border border-slate-600/50 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-cyan-500/50 focus:bg-slate-700"
              placeholder="Enter your student ID"
              value={form.studentId}
              onChange={(e) => setForm((c) => ({ ...c, studentId: e.target.value }))}
              required
            />
          </label>

          {/* Phone */}
          <label className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-sm font-medium text-slate-300">
              <FiPhone className="h-3.5 w-3.5 text-slate-500" />
              Phone / WhatsApp
            </span>
            <input
              className="rounded-xl border border-slate-600/50 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-cyan-500/50 focus:bg-slate-700"
              placeholder="Enter your phone number"
              value={form.phoneNumber}
              onChange={(e) => setForm((c) => ({ ...c, phoneNumber: e.target.value }))}
              required
            />
          </label>

          {/* Profile Picture */}
          <label className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-sm font-medium text-slate-300">
              <FiCamera className="h-3.5 w-3.5 text-slate-500" />
              Profile Picture (GitHub)
            </span>
            <input
              className="rounded-xl border border-slate-600/50 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
              value={form.image ? "Synced from GitHub" : "Not available"}
              disabled
            />
          </label>
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/30 p-3 text-sm text-rose-300">
            <FiAlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-sm text-emerald-300">
            <FiCheckCircle className="h-4 w-4 flex-shrink-0" />
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={saving || !canSubmit}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSave className="h-4 w-4" />
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>

      {/* ─── Quiz History ─── */}
      <section className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-6 md:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-5">
          <FiClock className="h-5 w-5 text-cyan-400" />
          Quiz Attempt History
        </h2>

        {!history.length ? (
          <div className="rounded-xl border border-slate-700/30 bg-slate-900/40 p-8 text-center">
            <FiAward className="mx-auto h-8 w-8 text-slate-600 mb-3" />
            <p className="text-sm text-slate-400">
              You have not attempted any quiz yet. Start a quiz to see your history here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Quiz</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Score</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((attempt) => (
                  <tr key={attempt._id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3.5 text-sm font-medium text-white">
                      {attempt.quizId?.title || "Quiz"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-sm font-bold text-cyan-400">
                        {attempt.totalScore ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${attempt.status === "submitted"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : attempt.status === "in-progress"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-slate-500/10 text-slate-400"
                        }`}>
                        {attempt.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-500">
                      {new Date(attempt.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}
