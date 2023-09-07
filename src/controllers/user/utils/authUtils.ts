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

  response.status(responseStatus).json(payloadToBeSent);
};
