const mongoose = require("mongoose");

const FAQSchema = new mongoose.Schema(
  {
    gigId: {
      type: mongoose.Types.ObjectId,
      ref: "Gig",
    },
    question: {
      type: String,
      require: true,
    },
    answer: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);
