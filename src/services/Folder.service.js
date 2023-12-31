import mongoose, { get } from "mongoose";

// ** Models
import Folder from "../models/Folder";
import StudySet from "../models/StudySet";
import User from "../models/User";
import { authConstant, httpConstant, folderConstrant } from "../constant";

export const folderService = {
  createFolder: async (userId, data) => {
    const folder = await Folder.create({
      ...data,
      userId,
    });
    const folderJson = folder.toJSON();
    return folderJson;
  },
    getAllFolder: async (userId, limit, offset, search) => {
    const limitNum = Number.parseInt(limit);
    const offsetNum = Number.parseInt(offset);

    const query = {
      userId,
      isDelete: false,
      title: { $regex: new RegExp(search || "", "i") }, // Tìm kiếm theo title (có thể thay đổi trường cần tìm kiếm)
    };
    const data = await Folder.find(query)
      .sort({ _id: -1 })
      .populate({
        path: "userId",
        select: "_id fullName email dob gender role picture",
      })
      .limit(limitNum)
      .skip(limitNum * offsetNum)
      .exec();

    const totalCount = await Folder.countDocuments(query);

    // Sử dụng Promise.all để thực hiện bất kỳ xử lý tùy chỉnh nào trên dữ liệu nếu cần thiết

    return {
      limit: limitNum,
      offset: offsetNum,
      totalPage: Math.ceil(totalCount / limitNum),
      folders: data,
    };
  },
  addStudySetToFolder: async (folderId, studySetId, userId) => {
    const folder = await Folder.findOne({ _id: folderId });
    if (!folder) throw new Error(folderConstrant.FOLDER_NOT_FOUND);
    if (!folder.userId.equals(userId)) {
      throw new Error(authConstant.FORBIDDEN);
    }
    if (folder.studySets.includes(studySetId)) {
      throw new Error("Study Set is existed.");
    } else {
      folder.studySets.push(studySetId);
      await folder.save();
    }
  },

  deleteStudySetFromFolder: async (folderId, studySetId, userId) => {
    const folder = await Folder.findOne({ _id: folderId, userId });

    // if (!folder) {
    //     throw new Error(folderConstrant.FOLDER_NOT_FOUND);
    // }

    // if (!folder.userId.equals(userId)) {
    //     throw new Error(authConstant.FORBIDDEN);
    // }
    console.log("abc", folder);

    if (!folder.studySets.includes(studySetId)) {
        throw new Error("Study set is not found in this folder.");
    }
    folder.studySets = folder.studySets.filter(id => id != studySetId);

    await folder.save();
},
  // getStudySetByFolderId: async (folderId, userId) => {
  //   const folder = await Folder.findOne({ _id: folderId, userId });
  //   if (!folder.studySets) {
  //     return [];
  //   }
  //   const studySetIds = folder.studySets;
  //   const studySets = await StudySet.find({ _id: { $in: studySetIds } });
  //   return studySets; 
  // },
  getStudySetByFolderId: async (folderId, userId) => {
    const folder = await Folder.findOne({ _id: folderId, userId });
    if (!folder.studySets) {
      return [];
    }
    const studySetIds = folder.studySets;
    const studySets = await StudySet.find({ _id: { $in: studySetIds } })
        .populate({
          path: "userId",
          select: "_id fullName email dob gender role picture",
        });
    return studySets; 
},

  deleteFolder: async (userId, folderId) => {
    const folder = await Folder.findById(folderId);

    if (!folder) throw new Error(folderConstrant.FOLDER_NOT_FOUND);
    if (!folder.userId.equals(userId))
      throw new Error(authConstant.FORBIDDEN);

    folder.isDelete = true;

    await folder.save();

    const folderJson = folder.toJSON();

    return folderJson;
  },
  updateFolderbyFolderId: async (userId, data) => {
    const folder = await Folder.findById(data?.id)

    if (!folder) throw new Error(folderConstrant.FOLDER_NOT_FOUND);
    if (!folder.userId.equals(userId)) {
      throw new Error(authConstant.FORBIDDEN);
    }
    for (const key in data) {
      if (data.hasOwnProperty(key) &&
        data[key] !== null &&
        data[key] !== undefined
      ) {
        folder[key] = data[key];
      }
    }
    await folder.save();
    const folderJson = folder.toJSON();
    return folderJson
  },

}