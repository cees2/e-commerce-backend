import { Response, Request, NextFunction } from "express";
import { User } from "../../models/userModel";
import jwt from "jsonwebtoken";
import { AppError } from "../../utils/AppError";
import { signTokenAndSendResponse } from "./utils/authUtils";
import { TokenDecoded } from "./services/types";

export const signup = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { body } = request;
    const newUser: Record<string, any> = await User.create({
      name: body.name,
      email: body.email,
      password: body.password,
      passwordConfirm: body.passwordConfirm,
    });

    signTokenAndSendResponse(response, 201, newUser._id.toString(), {
      user: newUser,
    });
  } catch (err: any) {
    next(err);
  }
};

export const login = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = request.body;

    const user: Record<string, any> = await User.findOne({ email }).select(
      "+password"
    );
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
    next(err);
  }
};

export const protect = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    let token = "";
    const { authorization } = request.headers;

    if (authorization?.startsWith("Bearer"))
      token = authorization.split(" ")[1];

    if (!token)
      return next(
        new AppError("You are not logged in. Please log in again", 401)
      );

    const tokenDecoded = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as TokenDecoded;

    const user = await User.findById(tokenDecoded?.id);

    if (!user)
      return next(
        new AppError("This user no longer exists. Please log in again", 401)
      );

    request.user = user;
    next();
  } catch (err: any) {
    next(err);
  }
};

export const restrictTo =
  (...roles: string[]) =>
  (request: Request, response: Response, next: NextFunction) => {
    if (!roles.includes(request.user.role)) {
      return next(
        new AppError(
          "Sorry, You do not have permission to perform this action",
          403
        )
      );
    }
    next();
  };

export const getMe = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  request.params.userId = request.user.id;
  next();
};
