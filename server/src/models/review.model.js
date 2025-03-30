const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
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
    start: {
      type: Number,
      require: true,
      max: 5,
    },
    description: {
      type: String,
      require: true,
    },
    priceRange: {
      type: String,
      require: true,
    },
    duration: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);
