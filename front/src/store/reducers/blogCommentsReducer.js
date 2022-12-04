/* eslint-disable eqeqeq */
/* eslint-disable no-redeclare */
import {
  READ_BLOG_COMMENTS,
  CREATE_COMMENT,
  CREATE_COMMENT_REPLY,
  EDIT_COMMENT,
  DELETE_COMMENT,
} from "../actions/blogCommentsActions";
const initialState = {
  comments: [],
};

const blogCommentReducer = (state = initialState, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case READ_BLOG_COMMENTS:
      return {
        ...state,
        comments: action.comments,
      };
    case CREATE_COMMENT:
      return {
        ...state,
        comments: state.comments.concat(action.comment),
      };
    case CREATE_COMMENT_REPLY:
      var oldComments = [...state.comments];
      var index = oldComments.findIndex((el) => el.id == action.parent);
      var oldComment = oldComments[index];
      oldComment.children_comments.push(action.comment);
      oldComments[index] = oldComment;
      return {
        ...state,
        comments: oldComments,
      };
    case EDIT_COMMENT:
      var oldComments = [...state.comments];
      if (action.parent) {
        var oldComments = [...state.comments];
        var index = oldComments.findIndex((el) => el.id == action.parent);
        var oldComment = oldComments[index];
        var oldReplyIndex = oldComment.children_comments.findIndex(
          (el) => el.id == action.commentId
        );
        var oldReply = oldComment.children_comments[oldReplyIndex];
        oldReply.blog_body = action.comment.blog_body;
        oldComment.children_comments[oldReplyIndex] = oldReply;
        oldComments[index] = oldComment;
      } else {
        var index = oldComments.findIndex((el) => el.id == action.commentId);
        oldComments[index] = action.comment;
      }
      return {
        ...state,
        comments: oldComments,
      };
    case DELETE_COMMENT:
      var newComments = [];
      if (action.parent) {
        var oldComments = [...state.comments];
        var index = oldComments.findIndex((el) => el.id == action.parent);
        var oldComment = oldComments[index];
        var oldReply = oldComment.children_comments.find(
          (el) => el.id == action.id
        );
        oldComment.children_comments = oldComment.children_comments.filter(
          (el) => el != oldReply
        );
        oldComments[index] = oldComment;
        newComments = [...oldComments];
      } else {
        newComments = state.comments.filter((el) => el.id != action.id);
      }

      return {
        ...state,
        comments: newComments,
      };
  }
  return state;
};

export default blogCommentReducer;
