const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const User = require("../models/User");
const Attempt = require("../models/Attempt");

function parseDateOrNull(value) {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

function validateSchedule(startsAt, endsAt) {
  if (startsAt && endsAt && endsAt <= startsAt) {
    throw Object.assign(new Error("End date/time must be greater than start date/time"), { status: 400 });
  }
}

async function getDashboardStats() {
  const [users, activeQuizzes, attempts, leaderboardTop] = await Promise.all([
    User.countDocuments({}),
    Quiz.countDocuments({ status: "running" }),
    Attempt.countDocuments({ status: "submitted" }),
    Attempt.find({ status: "submitted" })
      .sort({ totalScore: -1 })
      .limit(10)
      .populate("userId", "name email")
      .populate("quizId", "title")
      .lean(),
  ]);

  return {
    users,
    activeQuizzes,
    completedAttempts: attempts,
    leaderboardTop,
  };
}

async function listUsers() {
  return User.find({}).select("name email role isBanned disqualifiedQuizIds createdAt").sort({ createdAt: -1 }).lean();
}

async function banUser(userId, ban) {
  return User.findByIdAndUpdate(userId, { isBanned: ban }, { new: true }).lean();
}

async function disqualifyUserFromQuiz(userId, quizId) {
  return User.findByIdAndUpdate(
    userId,
    { $addToSet: { disqualifiedQuizIds: quizId } },
    { new: true }
  ).lean();
}

async function createQuiz(payload, adminUserId) {
  const startsAt = parseDateOrNull(payload.startsAt);
  const endsAt = parseDateOrNull(payload.endsAt);
  validateSchedule(startsAt, endsAt);

  const quiz = await Quiz.create({
    title: payload.title,
    description: payload.description,
    status: payload.status || "draft",
    createdBy: adminUserId,
    questionsPerAttempt: payload.questionsPerAttempt || 20,
    timerMode: payload.timerMode || "quiz",
    startsAt,
    endsAt,
    quizTimeLimitSec: payload.quizTimeLimitSec || 600,
    perQuestionTimeLimitSec: payload.perQuestionTimeLimitSec || 30,
  });

  if (Array.isArray(payload.questions) && payload.questions.length) {
    await Question.insertMany(
      payload.questions.map((q, index) => ({
        quizId: quiz._id,
        text: q.text,
        options: q.options,
        correctOptionKey: q.correctOptionKey,
        points: q.points || 1,
        order: index,
        timeLimitSecOverride: q.timeLimitSecOverride || null,
      }))
    );
    await Quiz.findByIdAndUpdate(quiz._id, { totalQuestionPool: payload.questions.length });
  }

  return quiz;
}

async function updateQuiz(quizId, payload) {
  const startsAt = parseDateOrNull(payload.startsAt);
  const endsAt = parseDateOrNull(payload.endsAt);
  validateSchedule(startsAt, endsAt);

  const quiz = await Quiz.findByIdAndUpdate(
    quizId,
    {
      title: payload.title,
      description: payload.description,
      status: payload.status,
      timerMode: payload.timerMode,
      startsAt,
      endsAt,
      quizTimeLimitSec: payload.quizTimeLimitSec,
      perQuestionTimeLimitSec: payload.perQuestionTimeLimitSec,
      questionsPerAttempt: payload.questionsPerAttempt,
    },
    { new: true }
  );

  if (Array.isArray(payload.questions)) {
    await Question.deleteMany({ quizId });
    if (payload.questions.length) {
      await Question.insertMany(
        payload.questions.map((q, index) => ({
          quizId,
          text: q.text,
          options: q.options,
          correctOptionKey: q.correctOptionKey,
          points: q.points || 1,
          order: index,
          timeLimitSecOverride: q.timeLimitSecOverride || null,
        }))
      );
    }
    await Quiz.findByIdAndUpdate(quizId, { totalQuestionPool: payload.questions.length });
  }

  return quiz;
}

async function deleteQuiz(quizId) {
  await Promise.all([Question.deleteMany({ quizId }), Attempt.deleteMany({ quizId })]);
  await Quiz.findByIdAndDelete(quizId);
}

async function listQuizzesForAdmin() {
  return Quiz.find({}).sort({ createdAt: -1 }).lean();
}

module.exports = {
  getDashboardStats,
  listUsers,
  banUser,
  disqualifyUserFromQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  listQuizzesForAdmin,
};