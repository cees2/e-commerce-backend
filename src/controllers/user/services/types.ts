import { Request } from "express";

export interface TokenDecoded {
  id: string;
  iat: number;
  exp: number;
}