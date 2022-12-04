/* eslint-disable no-redeclare */
import {
  READ_COMMENT_LIKES,
  CREATE_LIKE,
} from "../actions/commentLikesActions";
const initialState = {
  likes: [],
};

const commentLikesReducer = (state = initialState, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case READ_COMMENT_LIKES:
      return {
        ...state,
        likes: action.commentLikes,
      };
    case CREATE_LIKE:
      var oldLikes = [...state.likes];
      var newLikes = [];
      var like = oldLikes.find(
        (el) =>
          el.comment_blog_item === parseInt(action.comment) &&
          el.user === parseInt(action.user)
      );

      if (like) {
        newLikes = oldLikes.filter((el) => el !== like);
      } else {
        var newLike = {
          id: action.likeId,
          comment_blog_item: action.comment,
          user: action.user,
        };
        newLikes = oldLikes.concat(newLike);
      }
      return {
        ...state,
        likes: newLikes,
      };
  }
  return state;
};

export default commentLikesReducer;
