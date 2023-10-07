// ** JWT
import jwt from "jsonwebtoken";

// ** Constants
import { authConstant } from "../constant/Auth.constant";

export const jwtService = {
  async getTokens(payload) {
    const [accessToken, refreshToken] = await Promise.all([
      jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
        expiresIn: authConstant.EXPIRES_ACCESS_TOKEN,
      }),
      jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: authConstant.EXPIRES_REFRESH_TOKEN,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  },
  getAccessToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
      expiresIn: authConstant.EXPIRES_ACCESS_TOKEN,
    });

    return {
      accessToken,
    };
  },
};
