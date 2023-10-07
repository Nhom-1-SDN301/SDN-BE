// ** Models
import User from "../models/User";

// ** Service
import { jwtService } from "../utils/jwt";

// ** Third Libs
import bcrypt from "bcrypt";

// ** Constants
import { authConstant, userConstant } from "../constant";

export const authService = {
  createUser: async ({ email, fullName, password, gender }) => {
    const user = new User({
      email,
      fullName,
      password,
      gender,
    });

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(user.password, salt);

    await user.save();

    const userJson = user.toJSON();

    delete userJson.password;
    delete userJson.refreshToken;

    return userJson;
  },
  login: async ({ email, password }) => {
    const user = await User.findOne(
      { email },
      { folders: false, studySets: false }
    );

    if (!user) throw new Error(authConstant.EMAIL_NOT_EXIST);

    const passwordOk = bcrypt.compareSync(password, user.password);

    if (!passwordOk) throw new Error(authConstant.PASSWORD_INVALID);

    const payload = { id: user.id, fullName: user.fullName, role: user.role };
    const { accessToken, refreshToken } = await jwtService.getTokens(payload);

    user.refreshToken = refreshToken;
    await user.save();

    const userJson = user.toJSON();

    delete userJson.password;
    delete userJson.refreshToken;

    return {
      user: userJson,
      accessToken,
      refreshToken,
    };
  },
  refreshToken: async ({ payload, refreshToken }) => {
    const user = await User.findById(payload.id);

    if (!user) throw new Error(userConstant.USER_NOT_EXIST);

    if (user.refreshToken !== refreshToken)
      throw new Error(authConstant.UNAUTHORIZED);

    const payloadParams = { ...payload };
    delete payloadParams.iat;
    delete payloadParams.exp;
    const { accessToken } = jwtService.getAccessToken(payloadParams);

    return {
      accessToken,
    };
  },
};
