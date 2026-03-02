import AccessLog from "../models/AccessLog.js";

export const getPremiumContent = async (req, res) => {
  try {
    // Log the access activity
    const accessLog = new AccessLog({
      userId: req.user._id,
      endpoint: req.originalUrl,
      method: req.method,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'Unknown',
    });
    
    await accessLog.save();

    // Send the premium content
    return res.status(200).json({
      success: true,
      message: "Welcome to Premium Content!",
      data: {
        title: "Exclusive Premium Article",
        body: "This is a detailed, protected piece of content only available to users with an active Premium subscription.",
      },
    });
  } catch (error) {
    console.error("Error fetching premium content:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
