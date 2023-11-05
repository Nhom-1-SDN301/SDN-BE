import mongoose, { Schema } from "mongoose";

const { String, ObjectId, Boolean } = Schema.Types;

const Klass = mongoose.model(
  "Class",
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        default: null,
      },
      isDelete: {
        type: Boolean,
        default: false,
      },
      userId: {
        type: ObjectId,
        ref: "User",
        required: true,
      },
      picture: {
        type: String,
        default: null
      },
      inviteCode: {
        type: String,
        default: null,
      },
      members: [
        {
          userId: {
            type: ObjectId,
            ref: "User",
          },
          canComment: {
            type: Boolean,
            default: true,
          },
          canPost: {
            type: Boolean,
            default: false,
          },
          canDoTest: {
            type: Boolean,
            default: true,
          },
          canCreateTest: {
            type: Boolean,
            default: false,
          },
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

export default Klass;
