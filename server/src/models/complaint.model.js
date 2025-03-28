const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    gigId: {
      type: mongoose.Types.ObjectId,
      ref: "Gig",
      require: true,
    },
    UserId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "rejected"],
    },
    resolvedAt: {
      type: Date,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);
