import mongoose, { Schema } from "mongoose";

const { String, ObjectId } = Schema.Types;

const Post = mongoose.model(
  "Post",
  new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: false,
      },
      userId: { type: ObjectId, ref: "User", required: true },
      classId: { type: ObjectId, ref: "Class", required: true },
      files: [
        {
          type: String,
        },
      ],
      isDelete: {
        type: Boolean,
        default: false,
        select: false,
      },
    },
    { timestamps: true }
  )
);

export default Post;
