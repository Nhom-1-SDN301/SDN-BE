// ** Services
import { classService } from "../services";

// ** Utils
import { response } from "../utils/baseResponse";

// ** Constants
import { authConstant } from "../constant";
import { validation } from "../utils/validation";

export const ClassController = {
  createClass: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { name, description } = req.body;
    const user = req.user;

    try {
      const resp = await classService.createClass({ name, description, user });

      res.status(200).json(
        response.success({
          data: {
            class: resp,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        (errMessage === errMessage) === authConstant.FORBIDDEN ? 403 : 500;

      res.status(200).json(
        response.error({
          code,
          message: errMessage,
        })
      );
    }
  },
};
