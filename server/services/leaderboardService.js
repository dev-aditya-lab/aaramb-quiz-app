const Attempt = require("../models/Attempt");

async function getLeaderboardForUser() {
  return Attempt.find({ status: "submitted" })
    .sort({ totalScore: -1, submittedAt: 1 })
    .limit(50)
    .populate("userId", "name email")
    .populate("quizId", "title")
    .lean();
}

async function hasParticipated(userId) {
  const count = await Attempt.countDocuments({ userId, status: { $in: ["submitted", "in_progress"] } });
  return count > 0;
}

module.exports = {
  getLeaderboardForUser,
  hasParticipated,
};