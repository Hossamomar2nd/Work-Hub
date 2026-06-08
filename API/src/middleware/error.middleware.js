export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCodeCandidates = [error?.statusCode, error?.status, error?.cause];
  const statusCode =
    statusCodeCandidates.find(
      (code) => Number.isInteger(code) && code >= 400 && code < 600,
    ) || 500;

  const response = {
    success: false,
    message: error?.message || "Internal server error",
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = error?.stack;
  }

  return res.status(statusCode).json(response);
};
