import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, "Please add the username "],
    },
    email: {
      type: String,
      require: [true, "Please add email address"],
      unique: [true, "Email address already exists"],
    },
    password: {
      type: String,
      require: [true, "Please add user password"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
