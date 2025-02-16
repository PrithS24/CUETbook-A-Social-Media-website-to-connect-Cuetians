const mongoose = require("mongoose");

const EligibleUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  studentID: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  userType: { type: String, enum: ["student", "alumni"], required: true }, // Differentiates user type
  batch: { type: Number, required: function () { return this.userType === "alumni"; } }, // Alumni-specific
  graduationYear: { type: Number, required: function () { return this.userType === "alumni"; } }, // Alumni-specific
}, { timestamps: true });

const EligibleUser = mongoose.model("EligibleUser", EligibleUserSchema);

module.exports = EligibleUser;
