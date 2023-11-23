import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, {IUser} from "../models/user";
import asyncHandler from "express-async-handler";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };