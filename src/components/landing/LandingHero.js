"use client";

import Image from "next/image";
import { FiArrowRight, FiZap } from "react-icons/fi";

export default function LandingHero({ children }) {
    return (
        <section className="relative overflow-hidden py-20 md:py-28 lg:py-32">
            {/* Background orbs */}
            <div className="landing-orb landing-orb-cyan w-125 h-125 -top-40 -left-40 landing-float" />
            <div className="landing-orb landing-orb-purple w-100 h-100 top-20 right-0 landing-float delay-300" style={{ animationDelay: "2s" }} />
            <div className="landing-orb landing-orb-pink w-87.5 h-87.5 bottom-0 left-1/3 landing-float" style={{ animationDelay: "4s" }} />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    {/* Left: Text content */}
                    <div className="landing-fade-up">
                        {/* Badge */}
                        <div className="landing-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-cyan-300 mb-6">
                            <FiZap className="text-cyan-400" />
                            <span>Aarambh Club - Ramgarh Engineering College</span>
                        </div>

                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                            Elevate Your
                            <span className="landing-gradient-text block mt-1">Knowledge Game</span>
                        </h1>

                        <p className="mt-6 max-w-lg text-lg text-slate-300 leading-relaxed">
                            The official quiz platform by Aarambh Club. Compete in technical challenges,
                            climb the leaderboard, and prove your expertise across coding, robotics,
                            and beyond.
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-8 flex flex-wrap gap-4">
                            {children}
                        </div>

                        {/* Stats */}
                        <div className="mt-10 flex flex-wrap gap-8">
                            <div className="landing-fade-up delay-200">
                                <p className="text-2xl font-bold text-white">Live</p>
                                <p className="text-sm text-slate-400">Quiz Events</p>
                            </div>
                            <div className="landing-fade-up delay-400">
                                <p className="text-2xl font-bold text-white">Real-time</p>
                                <p className="text-sm text-slate-400">Leaderboards</p>
                            </div>
                            <div className="landing-fade-up delay-600">
                                <p className="text-2xl font-bold text-white">Instant</p>
                                <p className="text-sm text-slate-400">Results</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Hero illustration */}
                    <div className="landing-fade-right delay-300 flex justify-center lg:justify-end">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-cyan-500/20 to-purple-500/20 blur-3xl" />
                            <Image
                                src="/hero-illustration.png"
                                alt="Aarambh Quiz Platform - Interactive quiz experience"
                                width={560}
                                height={420}
                                priority
                                className="relative rounded-2xl landing-float"
                                style={{ animationDuration: "6s" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
