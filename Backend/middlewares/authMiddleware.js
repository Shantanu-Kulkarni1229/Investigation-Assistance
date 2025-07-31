import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  try {
    // Check if token exists in headers
    if (
      req.headers.authorization && 
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (without password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default protect;
