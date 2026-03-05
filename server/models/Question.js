const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },
    text: { type: String, required: true },
    options: { type: [optionSchema], required: true },
    correctOptionKey: { type: String, required: true, select: false },
    points: { type: Number, default: 1, min: 1 },
    order: { type: Number, default: 0, index: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    timeLimitSecOverride: { type: Number, default: null },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

questionSchema.index({ quizId: 1, isActive: 1, order: 1 });

module.exports = mongoose.models.Question || mongoose.model("Question", questionSchema);