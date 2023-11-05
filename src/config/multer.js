// ** Libs
import multer from "multer";

// ** Utils
import { date } from "../utils/date";

// Accept file
const fileTypes = ["jpeg", "png", "jpg", "txt", "docx", "csv", "rar", "zip"];
const imagesType = ["jpeg", "png", "jpg"];
const otherTypes = ["docx", "csv", "rar", "zip", "txt"];

// Config storage images
const storageImage = multer.diskStorage({
  destination: (req, file, res) => {
    res(null, "./src/assets/images");
  },
  filename: (req, file, res) => {
    const { id } = req.user;
    const type = file.mimetype.split("/")[1];

    // if (imageTypes.includes(type)) {
    const newFileName = `${id}_${new Date().valueOf()}.${type}`;
    res(null, newFileName);
    // } else res(new Error("File type not supported!"), null);
  },
});

// Config storage files
const storageFile = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = file.originalname
      .split(".")
      [file.originalname.split(".").length - 1].toLowerCase();

      console.log(type);

    if (imagesType.includes(type)) {
      cb(null, "./src/assets/images");
    } else if (otherTypes.includes(type)) cb(null, "./src/assets/files");
    else cb(new Error("File type not supported!"), null);
  },
  filename: (req, file, cb) => {
    const { id } = req.user;
    const type =
      file.originalname.split(".")[file.originalname.split(".").length - 1]; // Extract file extension

    if (fileTypes.includes(type)) {
      const newFileName = `${id}_${new Date().valueOf()}.${type}`;

      cb(null, newFileName);
    } else cb(new Error("File type not supported!"), null);
  },
});

export const uploadImage = multer({ storage: storageImage });
export const uploadFiles = multer({ storage: storageFile });
