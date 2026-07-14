import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    fileName: {
      type: String,
    },

    atsScore: {
      type: Number,
    },

    skills: [String],

    strengths: [String],

    suggestions: [String],
  },
  {
    timestamps: true,
  },
);

const Analysis = mongoose.model("Analysis", analysisSchema);

export default Analysis;
