export const response = {
  success: ({ isSuccess = true, code = 200, data }) => ({
    isSuccess,
    statusCode: code,
    data,
  }),
  error: ({ isSuccess = false, code = 400, message }) => ({
    isSuccess,
    statusCode: code,
    message,
  }),
};
