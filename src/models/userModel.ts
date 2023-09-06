import mongoose from "mongoose";
import { validate } from "isemail";
import bcrypt from "bcrypt";

interface User extends Document {
  name: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  role: "user" | "admin";
  dateCreated: Date;
  passwordChangedAt: Date;
  comparePasswords: (
    providedPassword: string,
    passwordExtractedFromDatabase: string
  ) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<User>({
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
      validator: function (email: string) {
        console.log(this);
        validate(email);
      },
      message: "Please provide correct email",
    },
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
      validator: function (passwordConfirm: string) {
        return passwordConfirm === (this as User).password;
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

userSchema.pre("save", async function (next) {
  this.name = `${this.name.slice(0, 1).toUpperCase()}${this.name.slice(1)}`;
  this.dateCreated = new Date();
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePasswords = function (
  providedPassword: string,
  passwordExtractedFromDatabase: string
) {
  return bcrypt.compare(providedPassword, passwordExtractedFromDatabase);
};

export const User = mongoose.model("User", userSchema);
