// middlewares/authEither.js
import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.dtoken;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (req.headers.token) {
      req.body.userId = decoded.id;
    } else {
      req.body.docId = decoded.id;
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export default authMiddleware;
