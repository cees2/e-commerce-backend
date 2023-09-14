export interface UserApi extends Document {
  name: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  role: "user" | "admin" | "seller";
  dateCreated: Date;
  passwordChangedAt: Date;
  comparePasswords: (
    providedPassword: string,
    passwordExtractedFromDatabase: string
  ) => Promise<boolean>;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}
