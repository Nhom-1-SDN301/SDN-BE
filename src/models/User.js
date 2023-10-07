import mongoose from "mongoose";

const { String, Date, Number, Boolean, ObjectId } = mongoose.Schema.Types;

const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      fullName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      picture: {
        type: String,
        default: null,
      },
      password: {
        type: String,
        required: true,
      },
      dob: {
        type: Date,
        default: null,
      },
      gender: {
        type: Number,
        required: true,
      },
      phone: {
        type: String,
        default: null,
      },
      address: {
        type: String,
        default: null,
      },
      refreshToken: {
        type: String,
        default: null,
      },
      role: {
        type: {
          id: Number,
          name: String,
        },
        default: {
          id: 3,
          name: "member",
        },
      },
      isDelete: {
        type: Boolean,
        default: false,
        select: false,
      },
    },
    { timestamps: true }
  )
);

export default User;
