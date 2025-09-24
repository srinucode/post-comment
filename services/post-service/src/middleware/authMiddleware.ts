import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string };
}

// export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
//   const authHeader = req.headers["authorization"];
//   if (!authHeader) return res.status(401).json({ message: "No token provided" });

//   const token = authHeader.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "Invalid token format" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string };
//     req.user = { id: decoded.id };
//     next();
//   } catch (error) {
//     res.status(403).json({ message: "Invalid or expired token" });
//   }
// };


export const authMiddleware = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    // 🚧 For testing: if no token, assign default user
    console.log("No auth header, using test user");
    req.user = { id: "123" };
    return next();
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    req.user = { id: "123" }; // fallback to test user
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string };
    req.user = { id: decoded.id };
  } catch (_err) {
    // 🚧 For testing: fallback instead of throwing error
    req.user = { id: "123" };
  }

  next();
};