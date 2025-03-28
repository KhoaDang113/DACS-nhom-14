const mongoose = require("mongoose");

const responeSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
      require: true,
    },

    amount: {
      type: Number,
      require: true,
    },
    method: {
      type: String,
      enum: ["momo, bank"],
      require: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    transaction_id: {
      type: String,
      unique: true,
      sparse: true, // Cho phép null
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Respone", responeSchema);
