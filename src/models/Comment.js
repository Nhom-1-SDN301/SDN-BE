import mongoose, { Schema } from "mongoose";

const { String, ObjectId, Boolean } = Schema.Types;

const ReplyComment = new Schema(
  {
    content: {
      type: String,
      default: null,
    },
    user: { type: ObjectId, ref: "User", required: true },
    replyUser: { type: ObjectId, ref: "User", default: null },
    picture: {
      type: String,
      default: null,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model(
  "Comment",
  new Schema(
    {
      content: {
        type: String,
        default: null,
      },
      userId: { type: ObjectId, ref: "User", required: true },
      postId: { type: ObjectId, ref: "Post", required: true },
      reply: [ReplyComment],
      picture: {
        type: String,
        default: null,
      },
      isDelete: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  )
);

export default Comment;
