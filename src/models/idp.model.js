const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, unique: true, required: true },
  email: { type: String, unique: true },
  role: { type: String, default: "user" },

},{
  timestamps: true,
});

module.exports = mongoose.model("User", UserSchema);
