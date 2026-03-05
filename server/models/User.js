const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: "" },
    image: { type: String, default: "" },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },
    isBanned: { type: Boolean, default: false, index: true },
    disqualifiedQuizIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userSchema.index({ role: 1, isBanned: 1 });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);