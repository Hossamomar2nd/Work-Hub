export const notFoundHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Page Not Found",
  });
};
