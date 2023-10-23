// ** Models
import StudySet from "../models/StudySet";
import User from "../models/User";

// ** Constants
import { authConstant, studySetConstant, userConstant } from "../constant";

// ** Utils
import { date } from "../utils/date";

export const userService = {
  getUsersByEmail: async ({ text, studySetId, userId }) => {
    const studySet = await StudySet.findById(studySetId);

    if (!studySet) throw new Error(studySetConstant.STUDYSET_NOT_FOUND);

    const users = await User.find({
      email: { $regex: new RegExp(text, "i") },
      _id: { $nin: [...studySet.shareTo, userId] },
    }).limit(10);

    return users;
  },
  getUserById: async ({ userId }) => {
    return await User.findOne({ _id: userId });
  },
  getUsersByAdmin: async ({ limit, offset, search, role, status, userId }) => {
    const limitNum = Number.parseInt(limit);
    const offsetNum = Number.parseInt(offset);
    const roleNum = Number.parseInt(role);
    const statusNum = Number.parseInt(status);

    const query = {
      $or: [
        { fullName: { $regex: new RegExp(search || "", "i") } },
        { email: { $regex: new RegExp(search || "", "i") } },
        { address: { $regex: new RegExp(search || "", "i") } },
      ],
      _id: {
        $ne: userId,
      },
    };

    if (role) query["role.id"] = roleNum;
    if (status) {
      query.isDelete = Boolean(statusNum);
    }

    const users = await User.find(query, { password: 0 })
      .limit(limitNum)
      .skip(limitNum * offsetNum);

    const totalUser = await User.countDocuments(query);
    const totalPage = Math.ceil(totalUser / limitNum);

    return {
      totalPage,
      limit: limitNum,
      offset: offsetNum,
      users,
    };
  },
  updateStatusUser: async ({ userId, isDelete }) => {
    const user = await User.findById(userId, { password: 0 });

    if (!user) throw new Error(userConstant.USER_NOT_FOUND);

    user.isDelete = isDelete;

    return await user.save();
  },
  updateProfile: async ({ data, userUpdateId, userRequest }) => {
    const user = await User.findById(userUpdateId);

    if (!user) throw new Error(userConstant.USER_NOT_FOUND);

    if (!userRequest.role.id === 1 && !user._id.equals(userRequest.id))
      throw new Error(authConstant.FORBIDDEN);

    Object.keys(data).forEach((key) => {
      if (key !== "picture") {
        if (key === "dob")
          user[key] = date.getDateFromDDMMYYYY(data[key]).toISOString();
        else user[key] = data[key];
      }
    });

    user.picture = data.picture
      ? `${process.env.SERVER_URL}/images/${data.picture}`
      : data.currentPicture
      ? user.picture
      : null;

    await user.save();

    const userJson = user.toJSON();

    delete userJson.password;
    delete userJson.refreshToken;

    return userJson;
  },
};
