export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || error.status || error.cause || 500;

  const response = {
    success: false,
    message: error.message || "Internal server error",
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
};
