import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    console.log("No auth header, using test user");
    req.user = { id: "123" }; // fallback user
    return next();
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    req.user = { id: "123" };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string };
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.log("Invalid token, using test user");
    req.user = { id: "123" };
    next();
  }
};
