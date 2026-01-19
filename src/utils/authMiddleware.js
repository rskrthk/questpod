import { verifyToken } from "@/utils/jwt";

export default function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ message: "Unauthorized" });
  req.user = decoded;
  next();
}
