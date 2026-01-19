import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export function generateToken(payload) {
  return jwt.sign(payload, secret, { expiresIn: "1d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}


export function verifyTokenWithToken(req) {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("JWT Verify: Missing or invalid Authorization header");
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, secret); // Replace with your secret
  } catch (err) {
    console.log("JWT Verify Error:", err.message);
    return null;
  }
}
