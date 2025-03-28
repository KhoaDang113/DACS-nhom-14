const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    gigId: {
      type: mongoose.Types.ObjectId,
      ref: "Gig",
      require: true,
    },
    customerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
    freelancerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    media: {
      type: [String],
      require: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "in_progress", "completed", "canceled"],
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
