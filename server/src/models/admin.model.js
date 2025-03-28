const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String },
    actionType: {
      type: String,
      enum: [
        "approve_service",
        "reject_service",
        "hide_service",
        "delete_service",
        "lock_user",
        "resolve_complaint",
      ],
      default: ["approve_services"],
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Admin", adminSchema);
