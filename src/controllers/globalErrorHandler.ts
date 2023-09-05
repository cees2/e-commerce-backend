import { AppError } from "../utls/AppError";

const handleJWTError = () => {
  return new AppError(`Invalid token, please log in again`, 401);
};

const handleJWTExpiredError = () => {
  return new AppError(`Your token has expired. Please log in again`, 401);
};

const handleDBCastError = (err) => {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
};

const handleDBDuplicateFields = (err) => {
  return new AppError(
    `Duplicate field value: ${err.keyValue.email}. Please use another value`
  );
};

const handleDBValidationError = (err) => {
  const errors = Object.values(err)
    .map((error) => error.message)
    .join(". ");
  return new AppError(`Invalid input data: ${errors}`, 400);
};

const sendErrorForDevelopment = (err, response: Response) => {
  response.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProduction = (err, response: Response) => {
  if (err.isOperational) {
    response.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
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
  next
) => {
  error.statusCode = err.statusCode || 500;
  error.status = err.status || "error";

  if (process.env.NODE_ENV === "development")
    sendErrorForDevelopment(err, response: Response);
  else if (process.env.NODE_ENV === "production") {
    let err = Object.assign(err);

    if (err.name === "CastError") err = handleDBCastError(err);
    if (err.code === 11000) error = handleDBDuplicateFields(err);
    if (err.name === "ValidationError") error = handleDBValidationError(err);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorForProduction(err, response: Response);
  }

  next();
};
