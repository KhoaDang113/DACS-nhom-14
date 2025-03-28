const mongoose = require("mongoose");

const responeSchema = new mongoose.Schema(
  {
    reviewId: {
      type: mongoose.Types.ObjectId,
      ref: "Review",
      require: true,
    },
    freelancerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
    like: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Respone", responeSchema);
