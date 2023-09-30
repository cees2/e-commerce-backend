import { Request, Response, NextFunction } from "express";
import { User } from "../../models/userModel";

export const getUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.params;

    const user = await User.findById(userId);

    if (!user) throw new Error("Could not find user with provided ID");

    response.status(200).json({
      message: "Success",
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
