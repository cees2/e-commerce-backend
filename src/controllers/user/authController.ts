import { User } from "../../models/userModel";
import jwt from "jsonwebtoken";

export const signup = async (request, response, next) => {
  try {
    const { body } = request;
    const newUser = await User.create({
      name: body.name,
      email: body.email,
      password: body.password,
      passwordConfirm: body.passwordConfirm,
    });

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
  } catch (err) {
    next(new AppError("Something went wrong"), 500);
  }
};
