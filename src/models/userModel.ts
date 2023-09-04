import mongoose from "mongoose";
import IsEmail from "isemail";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "User must have a name"],
    minLength: 2,
  },
  email: {
    type: String,
    required: [true, "User must have an email"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (email: string) => {
        return IsEmail(email)
      },
      message: "Please provide correct email"
    }
  },
  password: {
    type: String,
    required: [true, "User must have a password"],
    minLength: 0,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: (passwordConfirm: string) => {
        return passwordConfirm === this?.password;
      },
      message: "Provided passwords do not match",
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  dateCreated: Date,
  passwordChangedAt: Date,
});

userSchema.pre("save", async (next) => {
  this.name = `${this.name.slice(0, 1).toUpperCase()}${this.name.slice(1)}`;
  this.dateCreated = new Date();
  next();
});

userSchema.pre("save", async (next) => {
  if (!this || !this.isModified("password")) return next();
  this!.password = await bcrypt.hash(this.password, 12);
  this!.passwordConfirm = undefined;
  next();
});

export const User = mongoose.model("User", userSchema);
