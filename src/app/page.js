import { getServerSession } from "next-auth";
import { FiRadio } from "react-icons/fi";
import { authOptions } from "@/lib/auth";
import { connectMongoose } from "@/lib/mongoose";
import Quiz from "../../server/models/Quiz";
import LandingActions from "@/components/landing/LandingActions";
import LandingHero from "@/components/landing/LandingHero";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingSteps from "@/components/landing/LandingSteps";
import LandingFooter from "@/components/landing/LandingFooter";

async function getLandingData() {
  await connectMongoose();
  const now = new Date();

  const hasRunningQuiz = Boolean(
    await Quiz.exists({
      status: "running",
      $or: [{ startsAt: null }, { startsAt: { $lte: now } }],
      $and: [{ $or: [{ endsAt: null }, { endsAt: { $gte: now } }] }],
    })
  );

  return { hasRunningQuiz };
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const { hasRunningQuiz } = await getLandingData();

  return (
    <div className="landing-dark -mx-4 -mt-8 min-h-screen text-white overflow-x-hidden" style={{ marginLeft: "calc(-50vw + 50%)", marginRight: "calc(-50vw + 50%)", paddingLeft: 0, paddingRight: 0 }}>
      {/* ─── Hero ─── */}
      <LandingHero>
        <LandingActions sessionUser={session?.user || null} />
      </LandingHero>

      {/* ─── Live Quiz Status ─── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-4 mb-8">
        {hasRunningQuiz ? (
          <div className="landing-glass-strong rounded-2xl p-5 flex items-center gap-4 landing-fade-up landing-pulse-glow border-emerald-500/20">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/15">
              <FiRadio className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-400">Quiz Live Now</p>
              <p className="text-xs text-slate-400">A quiz is currently running. Head to your dashboard to start your attempt.</p>
            </div>
          </div>
        ) : (
          <div className="landing-glass rounded-2xl p-5 flex items-center gap-4 landing-fade-up">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5">
              <FiRadio className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-300">No Active Quiz</p>
              <p className="text-xs text-slate-500">Check back soon for upcoming quizzes and Aarambh Club events.</p>
            </div>
          </div>
        )}
      </section>

      {/* ─── Features ─── */}
      <LandingFeatures />

      {/* ─── Steps ─── */}
      <LandingSteps />

      {/* ─── CTA ─── */}
      <section className="relative py-20 md:py-24">
        <div className="landing-orb landing-orb-cyan w-[400px] h-[400px] top-0 left-1/4" />
        <div className="landing-orb landing-orb-purple w-[300px] h-[300px] bottom-0 right-1/4" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center landing-fade-up">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Test Your{" "}
            <span className="landing-gradient-text">Knowledge?</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-lg mx-auto">
            Join the Aarambh Quiz Platform and start competing in technical
            quizzes organized by the club. Your journey starts here.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <LandingActions sessionUser={session?.user || null} />
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <LandingFooter />
    </div>
  );
}
