import knex from "../config/db.js";
import camelcaseKeys from "camelcase-keys";
import { genUUID } from "../utils/uuid.js";

class Comment {
  //
  async add(commentData, userId) {
    const { content, parentId, rootId, movieId } = commentData;
    const newId = genUUID();
    await knex("comments").insert({
      id: newId,
      content,
      parent_id: parentId || null,
      root_id: rootId || null,
      user_id: userId,
      movie_id: movieId,
    });
    const newComment = await knex("comments").where("id", newId).first();
    return {
      ...commentData,
      ...newComment,
    };
  }

  async fetchByMovieId(movieId, page, limit) {
    const offset = (page - 1) * limit;
    // comments without replies
    const comments = await knex("detailed_comments_view")
      .select("*")
      .where("movie_id", movieId)
      .whereNull("parent_id")
      .limit(limit)
      .offset(offset);
    for (let comment of comments) {
      // replies for each comment
      const replies = await knex("detailed_comments_view")
        .select("*")
        .where("root_id", comment.id)
        .limit(limit)
        .offset(offset);
      comment.replies = replies;
    }

    // TODO user liked or disliked

    return camelcaseKeys(comments, { deep: true });
  }
  async edit(commentId, updatedContent) {
    await knex("comments")
      .where("id", commentId)
      .update({
        content: updatedContent,
        updated_at: knex.fn.now(),
      })
      .returning("*");
    if (!updatedContent) {
      return null;
    }

    return updatedContent;
  }

  async delete(commentId) {
    const deletedCount = await knex("comments").where("id", commentId).del();
    return deletedCount === 1;
  }
}
export default new Comment();
