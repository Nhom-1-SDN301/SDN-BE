// ** Libs
import multer from "multer";

// ** Utils
import { date } from "../utils/date";

// Config storage images
const storageImage = multer.diskStorage({
  destination: (req, file, res) => {
    res(null, "./src/assets/images");
  },
  filename: (req, file, res) => {
    const { id } = req.user;
    const type = file.mimetype.split("/")[1];
    const newFileName = `${id}_${new Date().valueOf()}.${type}`;

    res(null, newFileName);
  },
});

export const uploadImage = multer({ storage: storageImage });
