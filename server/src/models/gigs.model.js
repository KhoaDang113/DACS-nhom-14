const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema(
  {
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    price: {
      type: mongoose.Types.Decimal128,
      require: true,
    },
    media: {
      type: [String],
      require: true,
    },
    duration: {
      type: Number,
      require: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "hidden", "deleted"],
      default: "pending",
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    approved_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    rejected_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    rejected_at: { type: Date, default: null },
    approved_at: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Gig", gigSchema);
