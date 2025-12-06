const mongoose = require("mongoose");

const ResultsSchema = new mongoose.Schema({
  release_id: {
    type: Number,
    required: true,
  },
  serialNumber: {
    type: String,
    required: true,
  },
  series: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  fiveThousand: {
    type: [String],
    default: [],
  },
  twoThousand: {
    type: [String],
    default: [],
  },
  thousand: {
    type: [String],
    default: [],
  },
  fiveHundred: {
    type: [String],
    default: [],
  },
  twoHundred: {
    type: [String],
    default: [],
  },
  hundred: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

const Result = mongoose.model("Result", ResultsSchema);

module.exports = Result;
