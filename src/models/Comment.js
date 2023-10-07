import mongoose, { Schema } from "mongoose";

const { String, ObjectId, Boolean } = Schema.Types;

const Comment = mongoose.model(
  "Comment",
  new Schema(
    {
      content: {
        type: String,
        required: false,
      },
      userId: { type: ObjectId, ref: "User", required: true },
      postId: { type: ObjectId, ref: "Post", required: true },
      replyToComment: {
        type: ObjectId,
        ref: "Comment",
      },
      picture: {
        type: String,
        required: false,
      },
      isDelete: {
        type: Boolean,
        required: false,
        select: false,
      },
    },
    { timestamps: true }
  )
);

export default Comment;
