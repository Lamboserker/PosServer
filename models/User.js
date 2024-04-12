import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "employee", // Standardmäßig 'employee', kann aber zu 'admin' geändert werden
      enum: ["employee", "admin"], // Beschränkt die Rolle auf diese zwei Werte
    },
  },
  {
    timestamps: true, // Erstellt createdAt und updatedAt Felder automatisch
  }
);

const User = mongoose.model("User", userSchema);

export default User;
