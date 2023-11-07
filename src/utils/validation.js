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
  randomResetCode: () => {
    let result = "";
    const characters = "0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
};
