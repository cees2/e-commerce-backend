import { Response, Request, NextFunction } from "express";
import { User } from "../../models/userModel";
import jwt from "jsonwebtoken";
import { AppError } from "../../utls/AppError";

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

    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN)
      throw new Error("Server internal problems");

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    response.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err: any) {
    next(new AppError(err.message || "Something went wrong", 500));
  }
};
