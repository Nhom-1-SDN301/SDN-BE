// ** Models
import Klass from "../models/Class";
import Post from "../models/Post";
import Comment from "../models/Comment";

// ** uuid
import { v4 as uuidv4 } from "uuid";
import { classConstant } from "../constant/Class.constant";
import { authConstant } from "../constant";
import { transporter } from "../config/nodemailer";

export const classService = {
  createClass: async ({ name, description, user }) => {
    const classroom = new Klass({
      name,
      description,
      userId: user.id,
      inviteCode: uuidv4().split("-")[0].toLocaleUpperCase(),
    });

    await classroom.save();

    await classroom.populate({
      path: "userId",
      select: "_id fullName email dob gender role picture",
    });

    const json = classroom.toJSON();

    json["user"] = json.userId;
    delete json.userId;

    return json;
  },
  getClassOfUser: async ({ userId }) => {
    const classes = await Klass.find({
      $or: [
        { userId },
        {
          "members.userId": userId,
        },
      ],
    })
      .sort({ _id: -1 })
      .populate({
        path: "userId",
        select: "_id fullName email dob gender role picture",
      })
      .exec();

    const jsonData = classes.map((klass) => {
      const json = klass.toJSON();

      json["user"] = json.userId;
      delete json.userId;

      return json;
    });
    return jsonData;
  },
  updateClass: async ({ id, name, description, picture, userId }) => {
    const klass = await Klass.findById(id);
    if (!klass) throw new Error(classConstant.CLASS_NOT_FOUND);

    if (!klass.userId.equals(userId)) throw new Error(authConstant.FORBIDDEN);

    klass.name = name;
    if (description) klass.description = description;
    if (picture) klass.picture = picture;

    console.log(picture);

    await klass.save();

    return klass;
  },
  joinClassWithCode: async ({ userId, code }) => {
    const klass = await Klass.findOne({ inviteCode: code })
      .populate({
        path: "userId",
        select: "_id fullName email dob gender role picture",
      })
      .exec();

    if (!klass) throw new Error(classConstant.CLASS_NOT_FOUND);
    if (klass.members.find((member) => member.userId.equals(userId)))
      throw new Error(classConstant.USER_ALREADY_IN_CLASS);

    klass.members.push({
      userId,
    });

    await klass.save();

    const json = klass.toJSON();

    json["user"] = json.userId;
    delete json.userId;

    return json;
  },
  getClassById: async ({ userId, classId }) => {
    const klass = await Klass.findOne({ _id: classId });

    if (!klass) throw new Error(classConstant.CLASS_NOT_FOUND);
    if (
      !klass.userId.equals(userId) &&
      !klass.members.find((member) => member.userId.equals(userId))
    )
      throw new Error(authConstant.FORBIDDEN);

    return klass;
  },
  resetInviteCode: async ({ classId, userId }) => {
    const klass = await Klass.findById(classId);

    if (!klass.userId.equals(userId)) throw new Error(authConstant.FORBIDDEN);

    klass.inviteCode = uuidv4().split("-")[0].toLocaleUpperCase();
    await klass.save();

    return klass;
  },
  turnOffInviteCode: async ({ classId, userId }) => {
    const klass = await Klass.findById(classId);

    if (!klass) throw new Error(classConstant.CLASS_NOT_FOUND);
    if (!klass.userId.equals(userId)) throw new Error(authConstant.FORBIDDEN);

    klass.inviteCode = null;
    await klass.save();

    return klass;
  },
  getMembersInClass: async ({ classId, userId, search }) => {
    const klass = await Klass.findById(classId)
      .populate({
        path: "members.userId",
        select: "_id fullName email dob gender role picture",
      })
      .exec();

    if (!klass) throw new Error(classConstant.CLASS_NOT_FOUND);

    const valueSearch = search ? search.trim().toLowerCase() : "";

    let members = klass.members.map((u) => {
      const json = u.toJSON();
      json["user"] = json.userId;

      delete json.userId;
      return json;
    });

    if (valueSearch) {
      members = members.filter(
        (user) =>
          user.user.fullName.toLowerCase().includes(valueSearch) ||
          user.user.email.toLowerCase().includes(valueSearch)
      );
    }

    return members;
  },
  updateMember: async ({
    classId,
    memberId,
    userId,
    canComment,
    canPost,
    canDoTest,
    canCreateTest,
  }) => {
    const klass = await Klass.findById(classId);

    if (!klass.userId.equals(userId)) throw new Error(authConstant.FORBIDDEN);
    if (!klass.members.find((mem) => mem.userId.equals(memberId)))
      throw new Error(classConstant.MEMBER_NOT_EXIST_CLASS);

    for (let i = 0; i < klass.members.length; ++i) {
      if (klass.members[i].userId.equals(memberId)) {
        klass.members[i].canComment = canComment;
        klass.members[i].canPost = canPost;
        klass.members[i].canDoTest = canDoTest;
        klass.members[i].canCreateTest = canCreateTest;
        break;
      }
    }

    await klass.save();

    return true;
  },
  removeMembersFromClass: async ({ userId, classId, members = [] }) => {
    const klass = await Klass.findById(classId);

    if (!klass) throw new Error(classConstant.CLASS_NOT_FOUND);
    if (!klass.userId.equals(userId)) throw new Error(authConstant.FORBIDDEN);

    klass.members = klass.members.filter(
      (member) => !members.includes(member.userId.toString())
    );

    await klass.save();

    return true;
  },
  sendMailToMembers: async ({ user, members = [], subject, message }) => {
    await Promise.all(
      members.map((member) =>
        transporter.sendMail({
          from: user.fullName,
          to: member.email,
          subject,
          html: message,
        })
      )
    );

    return true;
  }
};
