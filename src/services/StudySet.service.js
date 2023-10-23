// ** Mongoose
import { Types } from "mongoose";

// ** Models
import StudySet from "../models/StudySet";
import Term from "../models/Term";
import StudySetRate from "../models/StudySetRate";
import User from "../models/User";

// ** Constants
import { authConstant, studySetConstant, userConstant } from "../constant";
import { userService } from "./User.service";
import { transporter } from "../config/nodemailer";

export const studySetService = {
  create: async (userId, data) => {
    const studySet = await StudySet.create({
      ...data,
      userId,
    });

    const studySetJson = studySet.toJSON();

    delete studySetJson.visitPassword;

    return studySetJson;
  },
  update: async (userId, data) => {
    const studySet = await StudySet.findById(data?.id);

    if (!studySet) throw new Error(studySetConstant.STUDYSET_NOT_FOUND);
    if (!studySet.userId.equals(userId))
      throw new Error(authConstant.FORBIDDEN);

    for (const key in data) {
      if (
        data.hasOwnProperty(key) &&
        data[key] !== null &&
        data[key] !== undefined
      ) {
        studySet[key] = data[key];
      }
    }

    await studySet.save();

    const studySetJson = studySet.toJSON();

    return studySetJson;
  },
  delete: async (userId, studySetId, roleId) => {
    const studySet = await StudySet.findById(studySetId);

    if (!studySet) throw new Error(studySetConstant.STUDYSET_NOT_FOUND);
    if (!studySet.userId.equals(userId) && roleId !== 1 && roleId !== 2)
      throw new Error(authConstant.FORBIDDEN);

    studySet.isDelete = true;

    await studySet.save();

    const studySetJson = studySet.toJSON();
    delete studySetJson.visitPassword;

    return studySetJson;
  },
  getAllByUserId: async (userId, limit, offset, search) => {
    const limitNum = Number.parseInt(limit);
    const offsetNum = Number.parseInt(offset);

    const query = {
      userId,
      isDelete: false,
      title: { $regex: new RegExp(search || "", "i") },
    };

    const data = await StudySet.find(query)
      .sort({ _id: -1 })
      .populate({
        path: "userId",
        select: "_id fullName email dob gender role picture",
      })
      .limit(limitNum)
      .skip(limitNum * offsetNum)
      .exec();

    const totalCount = await StudySet.countDocuments(query);

    const studySets = await Promise.all(
      data.map(async (studySet) => {
        const json = studySet.toJSON();

        const totalTermOfStudySet = await Term.countDocuments({
          studySetId: studySet._id,
        });

        json.user = json.userId;
        json.numberOfTerms = totalTermOfStudySet;

        delete json.userId;
        return json;
      })
    );

    return {
      limit: limitNum,
      offset: offsetNum,
      totalPage: Math.ceil(totalCount / limitNum),
      studySets,
    };
  },
  findById: async (id) => {
    return await StudySet.findById(id);
  },
  getById: async (studySetId) => {
    const studySet = await StudySet.findById(studySetId).populate({
      path: "userId",
      select: "_id fullName email dob gender role picture",
    });

    if (!studySet || studySet?.isDelete)
      throw new Error(studySetConstant.STUDYSET_NOT_FOUND);

    const totalRate = await StudySetRate.countDocuments({
      studySetId,
    });

    const avgStar =
      (
        await StudySetRate.aggregate([
          {
            $match: {
              studySetId: new Types.ObjectId(studySetId),
            },
          },
          {
            $group: {
              _id: null,
              totalStar: { $avg: "$star" },
            },
          },
        ])
      )[0]?.totalStar || 0;

    const json = studySet.toJSON();
    json.user = json.userId;
    json.totalRate = totalRate;
    json.avgStar = Number.parseFloat(Math.round(avgStar * 10) / 10);

    delete json.userId;
    delete json.visitPassword;

    return json;
  },
  createRate: async (userId, studySetId, star, comment) => {
    const studySet = await studySetService.findById(studySetId);
    if (!studySet) throw new Error(studySetConstant.STUDYSET_NOT_FOUND);

    const rate = await StudySetRate.findOne({
      userId,
      studySetId,
    });
    if (rate) {
      rate.star = star;
      rate.comment = comment;

      await rate.save();
      await rate.populate({
        path: "userId",
        select: "_id fullName email dob gender role picture",
      });

      const json = rate.toJSON();

      json.user = json.userId;
      delete json.userId;

      return {
        rate: json,
        isUpdate: true,
        isCreate: false,
      };
    } else {
      const rateCreated = new StudySetRate({
        studySetId: studySet._id._id,
        star,
        comment,
        userId,
      });

      await rateCreated.save();
      await rateCreated.populate({
        path: "userId",
        select: "_id fullName email dob gender role picture",
      });

      const json = rateCreated.toJSON();

      json.user = json.userId;
      delete json.userId;

      return {
        rate: json,
        isUpdate: false,
        isCreate: true,
      };
    }
  },
  getRates: async (studySetId, limit, offset) => {
    const studySet = await studySetService.findById(studySetId);
    if (!studySet) throw new Error(studySetConstant.STUDYSET_NOT_FOUND);

    const limitNum = Number.parseInt(limit);
    const offsetNum = Number.parseInt(offset);

    const data = await StudySetRate.find({
      studySetId,
    })
      .sort({ _id: -1 })
      .populate({
        path: "userId",
        select: "_id fullName email dob gender role picture",
      })
      .limit(limitNum)
      .skip(limitNum * offsetNum);

    const dataNext = await StudySetRate.find({
      studySetId,
    })
      .limit(limitNum)
      .skip(limitNum * (offsetNum + 1));

    const rates = data.map((rate) => {
      const json = rate.toJSON();

      json.user = json.userId;
      delete json.userId;

      return json;
    });

    return {
      rates,
      isHasMore: dataNext.length > 0,
    };
  },
  getRateStudySetOfUser: async (studySetId, userId) => {
    const studySet = await studySetService.findById(studySetId);
    if (!studySet) throw new Error(studySetConstant.STUDYSET_NOT_FOUND);

    const user = await User.findById(userId);
    if (!user) throw new Error(userConstant.USER_NOT_FOUND);

    const rate = await StudySetRate.findOne({
      userId,
      studySetId,
    });

    return rate;
  },
  shareStudySet: async ({ studySetId, users = [], userId }) => {
    const studySet = await studySetService.findById(studySetId);
    if (!studySet) throw new Error(studySetConstant.STUDYSET_NOT_FOUND);

    if (!studySet.userId.equals(userId))
      throw new Error(authConstant.FORBIDDEN);

    for (let i = 0; i < users.length; ++i) {
      if (!studySet.shareTo.find((objectId) => objectId.equals(users[i]))) {
        studySet.shareTo.push(users[i]);

        const user = await userService.getUserById({ userId: users[i] });

        await transporter.sendMail({
          from: "BOT",
          to: user?.email,
          subject: "Notification",
          html: `You have shared to <a href='${process.env.CLIENT_URL}/flash-card/${studySetId}'>study set</a>`,
        });
      }
    }

    return await studySet.save();
  },
  getSharedStudySet: async ({ user }) => {
    const studySets = await StudySet.find({
      shareTo: { $all: [user.id] },
    });

    return studySets
  },
};
