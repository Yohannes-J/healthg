import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      _id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

export default auth;
