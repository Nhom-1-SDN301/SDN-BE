// ** Express
import { validationResult } from "express-validator";

// ** Base Response
import { response } from "./baseResponse";

export const validation = {
  validationRequest: (req, res) => {
    const hasError = validationResult(req);
    if (!hasError.isEmpty()) {
      return response.error({
        message: hasError.errors[0].msg,
      });
    }
    return null;
  },
};
