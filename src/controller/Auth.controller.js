// ** Service
import { authService } from "../services";

// ** Base Response
import { response } from "../utils/baseResponse";

// ** Constants
import { authConstant, httpConstant, userConstant } from "../constant";

// ** Validator
import { validation } from "../utils/validation";

// ** Libs
import crypto from "crypto";
import { transporter } from "../config/nodemailer";

export const AuthController = {
  register: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const data = req.body;
    try {
      const user = await authService.createUser(data);

      res.status(200).json(
        response.success({
          data: { user },
        })
      );
    } catch (err) {
      const errMessage = err.message;
      if (errMessage.includes("E11000"))
        res.status(200).json(
          response.error({
            code: 409,
            message: authConstant.EMAIL_EXISTED,
          })
        );
      else
        res.status(200).json(
          response.error({
            code: 500,
            message: httpConstant.SERVER_ERROR,
          })
        );
    }
  },
  login: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const data = req.body;
    try {
      const result = await authService.login(data);

      res.status(200).json(
        response.success({
          data: result,
        })
      );
    } catch (err) {
      const errMessage = err.message;

      if (
        errMessage === authConstant.PASSWORD_INVALID ||
        errMessage === authConstant.EMAIL_NOT_EXIST
      )
        res.status(200).json(
          response.error({
            code: 400,
            message: errMessage,
          })
        );
      else
        res.status(200).json(
          response.error({
            code: 500,
            message: httpConstant.SERVER_ERROR,
          })
        );
    }
  },
  loginThirdParty: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { email, fullName, provider, picture } = req.body;

    try {
      const result = await authService.loginThirdParty({
        email,
        fullName,
        provider,
        picture,
      });

      res.status(200).json(
        response.success({
          data: result,
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code = errMessage === authConstant.FORBIDDEN ? 403 : 500;

      console.log(errMessage);
      res.status(200).json(
        response.error({
          code,
          message: code === 500 ? httpConstant.SERVER_ERROR : errMessage,
        })
      );
    }
  },
  refreshToken: async (req, res) => {
    const refreshToken = req.refreshToken;
    const payload = req.user;

    try {
      const result = await authService.refreshToken({
        payload,
        refreshToken,
      });

      res.status(200).json(
        response.success({
          data: result,
        })
      );
    } catch (err) {
      console.log(err?.message);
      res.status(200).json(
        response.error({
          code: 500,
          message: httpConstant.SERVER_ERROR,
        })
      );
    }
  },
  changePassword: async (req, res) => {
    const error = validation.validationRequest(req, res);
    if (error) return res.status(200).json(error);

    const { oldPassword, password } = req.body;
    const user = req.user;

    try {
      const userUpdate = await authService.changePassword({
        user,
        oldPassword,
        password,
      });

      res.status(200).json(
        response.success({
          data: {
            user: userUpdate,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === authConstant.OLD_PASSWORD_INVALID
          ? 401
          : errMessage === authConstant.FORBIDDEN
          ? 403
          : 500;

      res.status(200).json(
        response.error({
          code,
          message: errMessage,
        })
      );
    }
  },
  resetPassword: async (req, res) => {
    const error = validation.validationRequest(req, res);
    if (error) return res.status(200).json(error);

    const { email } = req.body;

    try {
      const isSuccess = await authService.verifyResetPassword({ email, req });

      res.status(200).json(
        response.success({
          isSuccess,
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code = errMessage === userConstant.USER_NOT_EXIST ? 404 : 500;

      res.status(200).json(
        response.error({
          code,
          message: errMessage,
        })
      );
    }
  },
  resetPasswordToken: async (req, res) => {
    const error = validation.validationRequest(req, res);
    if (error) return res.status(200).json(error);

    const { token } = req.params;
    const { password } = req.body;

    try {
      const email = req.session[token];
      if (!email) throw new Error(authConstant.TOKEN_EXPIRED);

      const isSuccess = await authService.updatePassword({ email, password });

      // Clear cookie
      res.cookie(token, "", { expires: new Date(0) });
      
      res.status(200).json(
        response.success({
          isSuccess,
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === userConstant.USER_NOT_EXIST
          ? 404
          : errMessage === authConstant.TOKEN_EXPIRED
          ? 401
          : 500;

      res.status(200).json(
        response.error({
          code,
          message: errMessage,
        })
      );
    }
  },
};
