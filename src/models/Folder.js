import mongoose, { Schema } from "mongoose";

const { String, ObjectId, Boolean } = Schema.Types;

const Folder = mongoose.model(
  "Folder",
  new Schema( 
    {
      title: {
        type: String,
        required: true,
      },
      description: String,
      userId: {
        type: ObjectId,
        ref: "User",
        required: true,
      },
      studySets: [{ type: ObjectId, ref: "StudySet" }],
      isDelete: {
        type: Boolean,
        default: false,
        select: false,
      },
    },
    { timestamps: true }
  )
);

export default Folder;
