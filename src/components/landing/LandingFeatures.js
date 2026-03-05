"use client";

import {
    FiActivity,
    FiAward,
    FiBarChart2,
    FiShield,
    FiGithub,
    FiUsers,
} from "react-icons/fi";

const FEATURES = [
    {
        icon: FiActivity,
        title: "Interactive Quizzes",
        description:
            "Participate in live quizzes on coding, robotics, technology, and general knowledge crafted by the Aarambh Club.",
        color: "from-cyan-500 to-blue-500",
        iconBg: "bg-cyan-500/10",
        iconColor: "text-cyan-400",
    },
    {
        icon: FiAward,
        title: "Real-Time Leaderboard",
        description:
            "See how you rank among peers instantly. Compete for the top position and earn recognition across branches.",
        color: "from-purple-500 to-pink-500",
        iconBg: "bg-purple-500/10",
        iconColor: "text-purple-400",
    },
    {
        icon: FiBarChart2,
        title: "Performance Analytics",
        description:
            "Track your quiz history, scores, and improvement trends directly from your personal dashboard.",
        color: "from-amber-500 to-orange-500",
        iconBg: "bg-amber-500/10",
        iconColor: "text-amber-400",
    },
    {
        icon: FiShield,
        title: "Anti-Cheat Protection",
        description:
            "Tab-switch detection, per-question timers, and enforced quiz windows ensure fair competition for everyone.",
        color: "from-emerald-500 to-teal-500",
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-400",
    },
    {
        icon: FiGithub,
        title: "GitHub Authentication",
        description:
            "Secure, one-click login with your GitHub account. No extra passwords to remember.",
        color: "from-slate-400 to-zinc-500",
        iconBg: "bg-slate-500/10",
        iconColor: "text-slate-300",
    },
    {
        icon: FiUsers,
        title: "Exclusive Access",
        description:
            "Built exclusively for Ramgarh Engineering College students and Aarambh Club members.",
        color: "from-rose-500 to-red-500",
        iconBg: "bg-rose-500/10",
        iconColor: "text-rose-400",
    },
];

export default function LandingFeatures() {
    return (
        <section className="relative py-20 md:py-24">
            <div className="landing-orb landing-orb-cyan w-[300px] h-[300px] top-0 right-0" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center landing-fade-up">
                    <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                        Platform Features
                    </p>
                    <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                        Everything You Need to{" "}
                        <span className="landing-gradient-text">Excel</span>
                    </h2>
                    <p className="mt-4 mx-auto max-w-2xl text-slate-400">
                        From live quizzes to detailed analytics, every feature is designed
                        to make your quiz experience seamless and competitive.
                    </p>
                </div>

                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map((feature, index) => (
                        <div
                            key={feature.title}
                            className="landing-glass landing-card-hover rounded-2xl p-6 landing-fade-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div
                                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.iconBg}`}
                            >
                                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-white">
                                {feature.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-400">
                                {feature.description}
                            </p>
                            <div
                                className={`mt-4 h-0.5 w-12 rounded-full bg-gradient-to-r ${feature.color}`}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
