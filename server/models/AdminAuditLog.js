const mongoose = require("mongoose");

const adminAuditLogSchema = new mongoose.Schema(
  {
    actorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    actorRole: {
      type: String,
      enum: ["manager", "admin"],
      required: true,
      index: true,
    },
    action: { type: String, required: true, index: true },
    targetType: { type: String, required: true },
    targetId: { type: String, default: "" },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

adminAuditLogSchema.index({ actorRole: 1, createdAt: -1 });

module.exports = mongoose.models.AdminAuditLog || mongoose.model("AdminAuditLog", adminAuditLogSchema);
