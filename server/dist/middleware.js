"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// export interface CustomJwtPayload extends JwtPayload {
//   id: string;
// }
// export interface AuthRequest extends Request {
//   user?: CustomJwtPayload;
// }
// export const protect = (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ): Response | void => {
//   const authHeader = req.headers.authorization;
//   const token = authHeader?.startsWith("Bearer ")
//     ? authHeader.split(" ")[1]
//     : null;
//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   try {
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET as string
//     ) as CustomJwtPayload;
//     req.user = { id: decoded.userId };
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not authorized" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };
    next();
};
exports.protect = protect;
