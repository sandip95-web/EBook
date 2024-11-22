import mongoose from "mongoose";
import { User } from "./userTypes";

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is Required."],
    },
    password: {
      type: String,
      required: [true, "Passsword is required."],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<User>("User", userSchema);
