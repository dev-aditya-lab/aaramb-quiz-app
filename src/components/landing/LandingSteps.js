"use client";

import { FiUserPlus, FiLogIn, FiPlay } from "react-icons/fi";

const STEPS = [
    {
        number: "01",
        icon: FiUserPlus,
        title: "Create Your Profile",
        description:
            "Sign up with your GitHub account and fill in your student details -- name, branch, year, and student ID.",
        color: "from-cyan-500 to-blue-500",
    },
    {
        number: "02",
        icon: FiLogIn,
        title: "Authenticate Securely",
        description:
            "One-click GitHub login keeps your account secure. No extra passwords, no hassle.",
        color: "from-purple-500 to-pink-500",
    },
    {
        number: "03",
        icon: FiPlay,
        title: "Start Competing",
        description:
            "Join live quizzes organized by Aarambh Club, answer questions, and watch your rank climb the leaderboard.",
        color: "from-amber-500 to-orange-500",
    },
];

export default function LandingSteps() {
    return (
        <section className="relative py-20 md:py-24">
            <div className="landing-orb landing-orb-purple w-87.5 h-87.5 -bottom-20 left-0" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center landing-fade-up">
                    <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                        How It Works
                    </p>
                    <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                        Get Started in{" "}
                        <span className="landing-gradient-text">Three Steps</span>
                    </h2>
                </div>

                <div className="mt-14 grid gap-8 md:grid-cols-3">
                    {STEPS.map((step, index) => (
                        <div
                            key={step.number}
                            className="landing-fade-up relative"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            {/* Connector line */}
                            {index < STEPS.length - 1 && (
                                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5">
                                    <div className={`h-full bg-linear-to-r ${step.color} opacity-30 rounded-full`} />
                                </div>
                            )}

                            <div className="landing-glass landing-card-hover rounded-2xl p-8 text-center relative z-10">
                                {/* Step number */}
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br ${step.color} mb-5`}>
                                    <step.icon className="w-7 h-7 text-white" />
                                </div>

                                <p className={`text-xs font-bold uppercase tracking-widest bg-linear-to-r ${step.color} bg-clip-text text-transparent`}>
                                    Step {step.number}
                                </p>

                                <h3 className="mt-3 text-xl font-bold text-white">
                                    {step.title}
                                </h3>

                                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
