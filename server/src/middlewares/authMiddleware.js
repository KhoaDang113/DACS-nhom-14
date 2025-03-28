const { requireAuth } = require("@clerk/clerk-sdk-node");

const authMiddleware = async (req, res, next) => {
  try {
    const { userId } = req.auth.userId; // chưa lấy được userId
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.UserID = userId;
    next();
  } catch (error) {
    console.error("Clerk Auth Error:", error);
    return res.status(401).json({ message: "Invalid authentication" });
  }
};

module.exports = authMiddleware;
