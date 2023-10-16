// ** Models
import User from "../models/User";

// ** Services
import { userService } from "../services";

// ** Constants
import { authConstant, httpConstant, studySetConstant } from "../constant";

// ** Utils
import { validation } from "../utils/validation";
import { response } from "../utils/baseResponse";

export const UserController = {
  getUsersByEmail: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { email } = req.params;
    const { studySetId } = req.query;
    const user = req.user;

    try {
      const users = await userService.getUsersByEmail({
        text: email,
        studySetId,
        userId: user.id,
      });
      res.status(200).json(
        response.success({
          data: {
            users,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === studySetConstant.STUDYSET_NOT_FOUND
          ? 404
          : authConstant.FORBIDDEN
          ? 403
          : 500;
      res.status(200).json(
        response.error({
          code,
          message: code === 500 ? httpConstant.SERVER_ERROR : errMessage,
        })
      );
    }
  },
  getUserByAdmin: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { limit, offset, search, role, status } = req.query;
    const user = req.user;

    try {
      const data = await userService.getUsersByAdmin({
        limit,
        offset,
        role,
        search,
        status,
        userId: user.id,
      });

      res.status(200).json(
        response.success({
          data,
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === studySetConstant.STUDYSET_NOT_FOUND
          ? 404
          : authConstant.FORBIDDEN
          ? 403
          : 500;
      res.status(200).json(
        response.error({
          code,
          message: code === 500 ? httpConstant.SERVER_ERROR : errMessage,
        })
      );
    }
  },
  updateStatusUser: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { userId } = req.params;
    const { isDelete } = req.body;

    try {
      const result = await userService.updateStatusUser({ userId, isDelete });

      res.status(200).json(
        response.success({
          data: {
            user: result,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === studySetConstant.STUDYSET_NOT_FOUND
          ? 404
          : authConstant.FORBIDDEN
          ? 403
          : 500;
      res.status(200).json(
        response.error({
          code,
          message: code === 500 ? httpConstant.SERVER_ERROR : errMessage,
        })
      );
    }
  },
};
