/**
 * Structured error response middleware
 */
export function errorHandler(err, req, res, _next) {
  console.error('Unhandled error:', err);

  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'An unexpected error occurred';

  res.status(statusCode).json({
    success: false,
    error: { code, message },
  });
}

/**
 * Create an HTTP error
 * @param {number} statusCode
 * @param {string} code
 * @param {string} message
 * @returns {Error}
 */
export function createHttpError(statusCode, code, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.code = code;
  return err;
}
