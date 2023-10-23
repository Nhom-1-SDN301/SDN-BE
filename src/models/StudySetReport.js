import mongoose, { Schema } from "mongoose";

const { String, ObjectId, Boolean } = Schema.Types;

const StudySetReport = mongoose.model(
  "StudySetReport",
  new Schema(
    {
      description: {
        type: String,
        require: false,
      },
      // 1. Thông tin không chính xác
      // 2. Nội dung không phù hợp
      // 3. Sử dụng nhằm mục đích lừa đảo
      // 4. Vi phạm quyền sở hữu trí tuệ
      // 0. Khác
      types: [
        {
          type: Number,
          default: 0,
        },
      ],
      // 0. Đang xử lý
      // 1. Đã giải quyết
      // 2. Từ chối
      status: {
        type: Number,
        default: 0,
      },
      studySetId: {
        type: ObjectId,
        ref: "StudySet",
      },
      userId: {
        type: ObjectId,
        ref: "User",
      },
      comment: {
        type: {
          content: {
            type: String,
          },
          userId: {
            type: ObjectId,
            ref: "User",
          },
        },
        default: null,
      },
    },
    { timestamps: true }
  )
);

export default StudySetReport;
