import { InvalidFormFields } from "./services/types";
export class AppError extends Error {
  private statusCode: number;
  private status: string;
  private isOperational: boolean;
  private invalidFormFields?: InvalidFormFields[];

  constructor(
    message: string,
    statusCode: number,
    invalidFormFields?: InvalidFormFields[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.invalidFormFields = invalidFormFields;

    Error.captureStackTrace(this, this.constructor);
  }
}
