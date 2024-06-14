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
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Active"],
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
