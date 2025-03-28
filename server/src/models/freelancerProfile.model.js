const mongoose = require("mongoose");

const freelancerProfileSchema = new mongoose.Schema(
  {
    freelancerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
    fullName: {
      type: String,
      require: true,
    },
    industry: { type: String },
    hardSkill: { type: String },
    softSkill: { type: String },
    languages: { type: String },
    country: { type: String },
    education: { type: String },
    description: { type: String },
    certificates: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FreelancerProfile", freelancerProfileSchema);
