const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Types.ObjectId, ref: "User", require: true },
    freelancerId: { type: mongoose.Types.ObjectId, ref: "User", require: true },
    readBySeller: {
      type: Boolean,
      required: true,
    },
    readByBuyer: {
      type: Boolean,
      required: true,
    },
    lastMessage: {
      type: String,
      require: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Conversation", conversationSchema);
