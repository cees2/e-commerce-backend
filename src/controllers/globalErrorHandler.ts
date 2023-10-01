import { NextFunction, Response, Request } from "express";
import { AppError } from "../utils/AppError";

const handleJWTError = () => {
  return new AppError(`Invalid token, please log in again`, 401);
};

const handleJWTExpiredError = () => {
  return new AppError(`Your token has expired. Please log in again`, 401);
};

const handleDBCastError = (err: Record<string, any>) => {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
};

const handleDBDuplicateFields = (err: Record<string, any>) => {
  const invalidFormFieldsValues = Object.keys(err.keyPattern).map(
    (duplicatedValue) => {
      return {
        name: duplicatedValue,
        message: "Value already exists",
      };
    }
  );

  return new AppError(
    `Duplicate field value. Please use another value`,
    400,
    invalidFormFieldsValues
  );
};

const handleDBValidationError = (err: Record<string, any>) => {
  const errorObjectsAsArray = Object.values(err.errors as Record<string, any>);
  const invalidFormFieldsValues = errorObjectsAsArray.map((errorObject) => ({
    name: errorObject.path,
    message: errorObject.message,
  }));

  return new AppError(
    `Invalid input data. Please try again`,
    400,
    invalidFormFieldsValues
  );
};

const sendErrorForDevelopment = (
  err: Record<string, any>,
  response: Response
) => {
  response.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProduction = (
  err: Record<string, any>,
  response: Response
) => {
  if (err.isOperational) {
    const responseBody: Record<string, any> = {
      status: err.status,
      message: err.message,
    };

    if (err.invalidFormFields) responseBody.errors = err.invalidFormFields;

    response.status(err.statusCode).json(responseBody);
  } else {
    response.status(500).json({
      status: "Error",
      message: "Something went wrong.",
    });
  }
};

export const globalErrorHandler = (
  error: Record<string, any>,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development")
    sendErrorForDevelopment(error, response);
  else if (process.env.NODE_ENV === "production") {
    let err = Object.assign(error);

    if (err.name === "CastError") err = handleDBCastError(err);
    if (err.code === 11000) err = handleDBDuplicateFields(err);
    if (err.name === "ValidationError") err = handleDBValidationError(err);
    if (err.name === "JsonWebTokenError") err = handleJWTError();
    if (err.name === "TokenExpiredError") err = handleJWTExpiredError();

    sendErrorForProduction(err, response);
  }

  next();
};
