const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    UserId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
    type: {
      type: String,
      enum: ["review", "order", "complaint", "service"],
    },
    content: {
      type: String,
      require: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
