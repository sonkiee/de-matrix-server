import { User } from "./request";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
