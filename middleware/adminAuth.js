import jwt from "jsonwebtoken";
import { ApiError } from "./errorHandler.js";

export const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken;

    if (!token) {
      throw new ApiError(401, "Authentication required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the token is for our fixed admin
    if (decoded.id !== "admin" || decoded.role !== "ADMIN") {
      throw new ApiError(401, "Invalid admin token");
    }

    req.admin = {
      id: decoded.id,
      role: decoded.role
    };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const superAdminAuth = async (req, res, next) => {
  try {
    await adminAuth(req, res, () => {
      if (req.admin.role !== 'SUPER_ADMIN') {
        throw new ApiError(403, "Super admin access required");
      }
      next();
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
}; 