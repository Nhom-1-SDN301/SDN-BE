// ** Service
import { postService } from "../services";

// ** Constants
import { authConstant } from "../constant";
import { classConstant } from "../constant/Class.constant";

// ** Utils
import { response } from "../utils/baseResponse";
import { validation } from "../utils/validation";

export const PostController = {
  createPost: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { id } = req.params;
    const user = req.user;
    const { content } = req.body;

    const images = [];
    const files = [];

    req.files.forEach((file) => {
      const extension = file.filename.split(".").pop().toLowerCase();
      if (classConstant.IMAGES_ACCEPT.includes(extension))
        images.push(`${process.env.SERVER_URL}/images/${file.filename}`);
      else if (classConstant.FILES_ACCEPT.includes(extension))
        files.push(file.filename);
    });

    try {
      const post = await postService.create({
        classId: id,
        content,
        files,
        images,
        userId: user.id,
      });

      res.status(200).json(
        response.success({
          data: {
            post,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === classConstant.CLASS_NOT_FOUND
          ? 404
          : errMessage === authConstant.FORBIDDEN
          ? 403
          : 500;

      res.status(200).json(
        response.error({
          code,
          message: errMessage,
        })
      );
    }
  },
  getPost: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { id } = req.params;
    const { limit, offset } = req.query;
    const user = req.user;

    try {
      const posts = await postService.getPostsInClass({
        classId: id,
        userId: user.id,
        limit,
        offset,
      });

      res.status(200).json(
        response.success({
          data: {
            posts,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === classConstant.CLASS_NOT_FOUND
          ? 404
          : errMessage === authConstant.FORBIDDEN
          ? 403
          : 500;

      res.status(200).json(
        response.error({
          code,
          message: errMessage,
        })
      );
    }
  },
  createComment: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const fileImage = req.file;
    const { classId, postId } = req.params;
    const { content, replyToComment, replyUser } = req.body;
    const user = req.user;

    try {
      const comment = await postService.createComment({
        classId,
        postId,
        content,
        userId: user.id,
        picture: fileImage
          ? `${process.env.SERVER_URL}/images/${fileImage.filename}`
          : null,
        replyToComment,
        replyUser,
      });

      res.status(200).json(
        response.success({
          data: {
            comment,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === classConstant.CLASS_NOT_FOUND ||
        errMessage === classConstant.POST_NOT_FOUND
          ? 404
          : errMessage === authConstant.FORBIDDEN
          ? 403
          : 500;

      res.status(200).json(
        response.error({
          code,
          message: errMessage,
        })
      );
    }
  },
  getCommentsOfPost: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { classId, postId } = req.params;
    const user = req.user;

    try {
      const data = await postService.getCommentOfPost({
        classId,
        postId,
        userId: user.id,
      });

      res.status(200).json(
        response.success({
          data,
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === classConstant.CLASS_NOT_FOUND ||
        errMessage === classConstant.POST_NOT_FOUND ||
        errMessage === classConstant.COMMENT_NOT_FOUND
          ? 404
          : errMessage === authConstant.FORBIDDEN
          ? 403
          : 500;

      res.status(200).json(
        response.error({
          code,
          message: errMessage,
        })
      );
    }
  },
  removeComment: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { classId, postId } = req.params;
    const { mainCommentId, subCommentId } = req.body;
    const user = req.user;

    try {
      await postService.removeComment({
        classId,
        postId,
        mainCommentId,
        subCommentId,
        userId: user.id,
      });

      res.status(200).json(response.success({}));
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === classConstant.CLASS_NOT_FOUND ||
        errMessage === classConstant.POST_NOT_FOUND ||
        errMessage === classConstant.COMMENT_NOT_FOUND
          ? 404
          : errMessage === authConstant.FORBIDDEN
          ? 403
          : 500;

      res.status(200).json(
        response.error({
          code,
          message: errMessage,
        })
      );
    }
  },
  updateComment: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { classId, postId } = req.params;
    const { mainCommentId, subCommentId, content } = req.body;
    const user = req.user;

    try {
      const comment = await postService.updateComment({
        classId,
        postId,
        mainCommentId,
        subCommentId,
        content,
        userId: user.id,
      });

      res.status(200).json(
        response.success({
          data: {
            comment,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === classConstant.CLASS_NOT_FOUND ||
        errMessage === classConstant.POST_NOT_FOUND ||
        errMessage === classConstant.COMMENT_NOT_FOUND
          ? 404
          : errMessage === authConstant.FORBIDDEN
          ? 403
          : 500;

      res.status(200).json(
        response.error({
          code,
          message: errMessage,
        })
      );
    }
  },
};
