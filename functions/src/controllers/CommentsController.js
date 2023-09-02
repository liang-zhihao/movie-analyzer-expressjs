import knex from "knex";
import Comment from "../models/Comment.js";
import CommentLike from "../models/CommentLike.js";
class CommentsController {
  async addComment(req, res) {
    try {
      if (Object.keys(req.query).length !== 0) {
        return res.status(400).json({
          error: true,
          message: "Query parameters are not permitted.",
        });
      }
      if (req.user) {
        req.body.userId = req.user.id;
      }
      console.log(req.user);
      const comment = await Comment.add(req.body, req.body.userId);
      if (!comment) {
        return res.status(500).json({
          error: true,
          message: "Failed to add comment.",
        });
      }
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  async likeOrDislikeComment(req, res) {
    try {
      if (Object.keys(req.query).length !== 0) {
        return res.status(400).json({
          error: true,
          message: "Query parameters are not permitted.",
        });
      }
      // if user is not logged in

      const result = await CommentLike.addOrUpdateLike(
        req.body.commentId,
        req.body.type,
        req.user.id
      );
      if (!result) {
        return res.status(500).json({
          error: true,
          message: "Failed to like/dislike comment.",
        });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  async fetchComments(req, res) {
    try {
      if (!req.query.page || !req.query.limit) {
        return res.status(400).json({
          error: true,
          message: "Page and limit query parameters are required.",
        });
      }

      const comments = await Comment.fetchByMovieId(
        req.params.movieId,
        req.query.page,
        req.query.limit
      );
      if (!comments || comments.length === 0) {
        return res.status(404).json({
          error: true,
          message: "No comments found for this post.",
        });
      }
      // TODO user liked or disliked
      // const currentUser = req.body.userId;
      // const currentUser = 3;
      // const likedIds = await knex("comment_likes")
      //   .select("comment_id", "type")
      //   .where("user_id", currentUser)
      //   .andWhere("type", 1);

      // const dislikedIds = await knex("comment_likes")
      //   .select("comment_id", "type")
      //   .where("user_id", currentUser)
      //   .andWhere("type", -1);
      // for (let comment of comments) {
      //   if (likedIds.includes(comment.id)) {
      //     comment.likeStatus = 1;
      //   } else if (dislikedIds.includes(comment.id)) {
      //     comment.likeStatus = -1;
      //   } else {
      //     comment.likeStatus = 0;
      //   }
      // }

      res.status(200).json(comments);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  async updateComment(req, res) {
    try {
      // TODO check if the user is the owner of the comment

      const updatedComment = await Comment.edit(
        req.params.commentId,
        req.body.content
      );
      if (!updatedComment) {
        return res.status(404).json({
          error: true,
          message: "Comment not found or failed to update.",
        });
      }
      res.status(200).json({
        error: false,
        message: "Comment updated successfully.",
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async deleteComment(req, res) {
    try {
      const success = await Comment.delete(req.params.commentId);
      if (!success) {
        return res.status(404).json({
          error: true,
          message: "Comment not found or failed to delete.",
        });
      }
      res
        .status(200)
        .json({ error: false, message: "Comment deleted successfully." });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

export default new CommentsController();
