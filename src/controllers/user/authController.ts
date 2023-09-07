import bcrypt from "bcrypt";
import { Response, Request, NextFunction } from "express";
import { User } from "../../models/userModel";
import jwt from "jsonwebtoken";
import { AppError } from "../../utls/AppError";
import { signTokenAndSendResponse } from "./utils/authUtils";

export const signup = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { body } = request;
    const newUser = await User.create({
      name: body.name,
      email: body.email,
      password: body.password,
      passwordConfirm: body.passwordConfirm,
    });

    signTokenAndSendResponse(response, 201, newUser._id.toString(), {
      user: newUser,
    });
  } catch (err: any) {
    next(new AppError(err.message || "Something went wrong", 500));
  }
};

export const login = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = request.body;

    const user = await User.findOne({ email }).select("+password");
    const passwordIsCorrect = await user?.comparePasswords(
      password,
      user?.password
    );

    const credentialsAreOk = !!user && passwordIsCorrect;

    if (!credentialsAreOk)
      next(
        new AppError(
          "Provided credentials are incorrect. Please try again",
          401
        )
      );

    signTokenAndSendResponse(response, 200, user?._id.toString() || "");
  } catch (err: any) {
    next(new AppError(err.message || "Something went wrong", 500));
  }
};
