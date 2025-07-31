// controllers/userController.js
export const getUserProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user: req.user
    });
  } catch (error) {
    console.error("❌ Get Profile Error:", error);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
};
