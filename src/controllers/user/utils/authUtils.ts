import { Response } from "express";
import jwt from "jsonwebtoken";

export const signTokenAndSendResponse = (
  response: Response,
  responseStatus: number,
  tokenId: string,
  data?: Record<string, any>
) => {
  const token = jwt.sign({ id: tokenId }, process.env.JWT_SECRET || "", {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const payloadToBeSent: Record<string, any> = {
    status: "Success",
    token,
  };

  if (data) payloadToBeSent.data = data;

  // response.cookie("token", token, {
  //   expires: new Date(
  //     Date.now() +
  //       (Number(process.env?.JWT_COOKIE_EXPIRES_IN) || 0) * 24 * 60 * 60 * 1000
  //   ),
  //   secure: false,
  //   httpOnly: true,
  // });

  response.status(responseStatus).json(payloadToBeSent);
};
