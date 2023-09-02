import knex from "../config/db.js";
import camelcaseKeys from "camelcase-keys";
import { genUUID } from "../utils/uuid.js";
class CommentLike {
  async addOrUpdateLike(commentId, type, userId) {
    // TODO user_id from the authenticated user
    // Check if a like/dislike already exists for this comment by the user
    const LIKE = 1;
    const DISLIKE = -1;
    const existingLike = await knex("comment_likes")
      .select("*")
      .where("comment_id", commentId)
      .andWhere("user_id", userId)
      .first();
    if (existingLike) {
      // If the type is the same, remove the like/dislike
      if (existingLike.type === type) {
        await knex("comment_likes").where("id", existingLike.id).del();
      } else {
        // Otherwise, update the type
        await knex("comment_likes")
          .where("id", existingLike.id)
          .update({ type });
      }
    } else {
      // If no existing like/dislike, add a new one
      await knex("comment_likes").insert({
        id: genUUID(),
        comment_id: commentId,
        user_id: userId,
        type,
      });
    }

    // Fetch updated like and dislike counts for the comment
    const likeCount = await knex("comment_likes")
      .where("comment_id", commentId)
      .andWhere("type", LIKE)
      .count("id as count")
      .first();

    const dislikeCount = await knex("comment_likes")
      .where("comment_id", commentId)
      .andWhere("type", DISLIKE)
      .count("id as count")
      .first();
    return {
      likeCount: likeCount.count,
      dislikeCount: dislikeCount.count,
    };
  }
}
export default new CommentLike();
