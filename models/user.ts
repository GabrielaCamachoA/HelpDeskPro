import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false
  },
  fullname: {
    type: String,
    required: [true, "Fullname is required"],
    minlength: [3, "Fullname must be at least 3 characters long"],
    maxlength: [50, "Fullname must be at most 50 characters long"],
  },
  role: {
    type: String,
    enum: ["client", "agent"],
    default: "client",
    required: true
  }
}, { timestamps: true });

// Usa el modelo si ya existe, si no créalo
const User = models.User || model("User", UserSchema);

export default User;
