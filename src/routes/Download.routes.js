// ** Express
import express from "express";

const downloadRouter = express.Router();

downloadRouter.get("/:filename", async (req, res) => {
  const { filename } = req.params;

  res.download(`${__root}/assets/files/${filename}`);
});

export default downloadRouter;
