const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
  {
    refresh: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", TokenSchema);
