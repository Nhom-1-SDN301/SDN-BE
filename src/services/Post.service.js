// ** Services
import Klass from "../models/Class";

// ** Constants
import { classConstant } from "../constant/Class.constant";
import { authConstant } from "../constant";
import Post from "../models/Post";
import Comment from "../models/Comment";

export const postService = {
  create: async ({ classId, userId, files, images, content }) => {
    const klass = await Klass.findById(classId);
    if (!klass) throw new Error(classConstant.CLASS_NOT_FOUND);

    // check is member or not
    const member = klass.members.find((mem) => mem.userId.equals(userId));

    // not a teacher or permission
    if (!(klass.userId.equals(userId) || (member && member.canPost)))
      throw new Error(authConstant.FORBIDDEN);

    const post = new Post({
      content,
      userId,
      classId,
      files,
      images,
    });

    await post.save();
    await post.populate({
      path: "userId",
      select: "_id fullName email dob gender role picture",
    });

    const json = post.toJSON();

    json["user"] = json.userId;
    delete json.userId;

    return json;
  },
  getPostsInClass: async ({ userId, classId, limit, offset }) => {
    const klass = await Klass.findById(classId);
    if (!klass) throw new Error(classConstant.CLASS_NOT_FOUND);

    // check is member or not
    const member = klass.members.find((mem) => mem.userId.equals(userId));

    // not a teacher or member
    if (!(klass.userId.equals(userId) || member))
      throw new Error(authConstant.FORBIDDEN);

    const limitNum = Number.parseInt(limit);
    const offSetNum = Number.parseInt(offset);

    const posts = await Post.find({ classId: classId, isDelete: false })
      .sort({ _id: -1 })
      .populate({
        path: "userId",
        select: "_id fullName email dob gender role picture",
      })
      .limit(limitNum)
      .skip(limitNum * offSetNum)
      .exec();

    const postsJson = posts.map((post) => {
      const json = post.toJSON();

      json["user"] = json.userId;
      delete json.userId;

      return json;
    });

    const dataNext = await Post.find({
      classId,
      isDelete: false,
    })
      .sort({ _id: -1 })
      .limit(limitNum)
      .skip(limitNum * (offSetNum + 1))
      .exec();

    return {
      posts: postsJson,
      isHasMore: dataNext.length > 0,
    };
  },
  createComment: async ({
    classId,
    postId,
    userId,
    content,
    replyToComment,
    picture,
    replyUser,
  }) => {
    const klass = await Klass.findById(classId);
    if (!klass) throw new Error(classConstant.CLASS_NOT_FOUND);

    const post = await Post.findById(postId);
    if (!post) throw new Error(classConstant.POST_NOT_FOUND);

    const member = klass.members.find((mem) => mem.userId.equals(userId));

    /**
     * @condition
     * 1. Post in class
     * 2. Member of class
     * 3. Have permission
     * 4. Must a teacher
     */
    if (
      !(
        post.classId.equals(klass.id) &&
        (klass.userId.equals(userId) || (member && member.canComment))
      )
    )
      throw new Error(authConstant.FORBIDDEN);

    if (replyToComment) {
      const comment = await Comment.findById(replyToComment);
      if (!comment) throw new Error(classConstant.COMMENT_NOT_FOUND);

      comment.reply.push({
        content,
        user: userId,
        picture,
        replyUser,
      });

      await comment.save();
      await comment.populate({
        path: "userId",
        select: "_id fullName email dob gender role picture",
      });
      await comment.populate({
        path: "reply.user",
        select: "_id fullName email dob gender role picture",
      });
      await comment.populate({
        path: "reply.replyUser",
        select: "_id fullName email dob gender role picture",
      });

      const json = comment.toJSON();

      json["user"] = json.userId;
      delete json.userId;

      return json;
    } else {
      const comment = new Comment({
        content,
        picture,
        userId,
        postId,
      });
      await comment.save();
      await comment.populate({
        path: "userId",
        select: "_id fullName email dob gender role picture",
      });

      const json = comment.toJSON();

      json["user"] = json.userId;
      delete json.userId;

      return json;
    }
  },
  getCommentOfPost: async ({ classId, postId, userId }) => {
    const klass = await Klass.findById(classId);
    if (!klass) throw new Error(classConstant.CLASS_NOT_FOUND);

    const post = await Post.findById(postId);
    if (!post) throw new Error(classConstant.POST_NOT_FOUND);

    // check is member or not
    const member = klass.members.find((mem) => mem.userId.equals(userId));

    if (
      !(
        post.classId.equals(klass.id) &&
        (klass.userId.equals(userId) || member)
      )
    )
      throw new Error(authConstant.FORBIDDEN);

    const comments = await Comment.find({
      postId,
      isDelete: false,
    })
      .populate({
        path: "userId",
        select: "_id fullName email dob gender role picture",
      })
      .populate({
        path: "reply.user",
        select: "_id fullName email dob gender role picture",
      })
      .populate({
        path: "reply.replyUser",
        select: "_id fullName email dob gender role picture",
      })
      .exec();

    comments.forEach((comment) => {
      comment.reply = comment.reply.filter((rep) => !rep.isDelete);
    });

    let totalComment = 0;

    const jsonComments = comments.map((comment) => {
      const json = comment.toJSON();

      json["user"] = json.userId;
      delete json.userId;

      totalComment += json.reply.length + 1;

      return json;
    });

    return {
      comments: jsonComments,
    };
  },
  removeComment: async ({
    classId,
    postId,
    userId,
    mainCommentId,
    subCommentId,
  }) => {
    const klass = await Klass.findById(classId);
    if (!klass) throw new Error(classConstant.CLASS_NOT_FOUND);

    const post = await Post.findById(postId);
    if (!post) throw new Error(classConstant.POST_NOT_FOUND);

    const comment = await Comment.findById(mainCommentId);
    if (!comment) throw new Error(classConstant.COMMENT_NOT_FOUND);

    if (subCommentId) {
      const reply = comment.reply.find((c) => c._id.equals(subCommentId));
      if (!reply) throw new Error(classConstant.COMMENT_NOT_FOUND);
      if (!reply.user.equals(userId)) throw new Error(authConstant.FORBIDDEN);

      comment.reply.forEach((c) => {
        if (c.id === reply.id) {
          c.isDelete = true;
        }
      });

      await comment.save();
      return classConstant.REMOVED_COMMENT;
    } else {
      if (!comment.userId.equals(userId))
        throw new Error(authConstant.FORBIDDEN);

      comment.isDelete = true;
      await comment.save();
      return classConstant.REMOVED_COMMENT;
    }
  },
  updateComment: async ({
    classId,
    postId,
    userId,
    mainCommentId,
    subCommentId,
    content,
  }) => {
    const klass = await Klass.findById(classId);
    if (!klass) throw new Error(classConstant.CLASS_NOT_FOUND);

    const post = await Post.findById(postId);
    if (!post) throw new Error(classConstant.POST_NOT_FOUND);

    const comment = await Comment.findById(mainCommentId);
    if (!comment) throw new Error(classConstant.COMMENT_NOT_FOUND);

    if (subCommentId) {
      const reply = comment.reply.find((c) => c._id.equals(subCommentId));
      if (!reply) throw new Error(classConstant.COMMENT_NOT_FOUND);
      if (!reply.user.equals(userId)) throw new Error(authConstant.FORBIDDEN);

      comment.reply.forEach((c) => {
        if (c.id === reply.id) {
          c.content = content;
        }
      });

      await comment.save();
      return comment;
    } else {
      if (!comment.userId.equals(userId))
        throw new Error(authConstant.FORBIDDEN);

      comment.content = content;

      await comment.save();
      return comment;
    }
  },
  removePost: async ({ classId, postId, user }) => {
    const klass = await Klass.findById(classId);
    if (!klass) throw new Error(classConstant.CLASS_NOT_FOUND);

    const post = await Post.findById(postId);
    if (!post) throw new Error(classConstant.POST_NOT_FOUND);

    if (
      !(
        post.userId.equals(user.id) ||
        klass.userId.equals(user.id) ||
        user.role.id === 1
      )
    )
      throw new Error(authConstant.FORBIDDEN);

    post.isDelete = true;
    await post.save();

    return post;
  },
};
