// ** Models
import Klass from "../models/Class";
import Post from "../models/Post";
import Comment from "../models/Comment";

// ** uuid
import { v4 as uuidv4 } from "uuid";

export const classService = {
  createClass: async ({ name, description, user }) => {
    const classroom = new Klass({
      name,
      description,
      userId: user.id,
      inviteCode: uuidv4().split("-")[0].toLocaleUpperCase(),
    });

    await classroom.save();

    return classroom.toJSON();
  },
};
