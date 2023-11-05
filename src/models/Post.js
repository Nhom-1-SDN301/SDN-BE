import mongoose, { Schema } from "mongoose";

const { String, ObjectId } = Schema.Types;

const Post = mongoose.model(
  "Post",
  new Schema(
    {
      content: {
        type: String,
        default: null,
      },
      userId: { type: ObjectId, ref: "User", required: true },
      classId: { type: ObjectId, ref: "Class", required: true },
      files: [
        {
          type: String,
        },
      ],
      images: [
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
