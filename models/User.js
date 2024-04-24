import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "employee",
      enum: ["employee", "admin"],
    },
    confirmationCode: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Active"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
