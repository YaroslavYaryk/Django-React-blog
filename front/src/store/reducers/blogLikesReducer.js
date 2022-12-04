/* eslint-disable no-redeclare */
import BlogLike from "../../models/BlogLike";
import { READ_BLOGS_LIKES, CREATE_LIKE } from "../actions/blogLikesActions";
const initialState = {
  blogsLikes: [],
};

const blogLikesReducer = (state = initialState, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case READ_BLOGS_LIKES:
      return {
        ...state,
        blogsLikes: action.blogLikes,
      };
    case CREATE_LIKE:
      var oldLikes = [...state.blogsLikes];
      var newLikes = [];
      var like = oldLikes.find(
        (el) =>
          el.blog === parseInt(action.blog) && el.user === parseInt(action.user)
      );

      if (like) {
        newLikes = oldLikes.filter((el) => el !== like);
      } else {
        var newLike = new BlogLike(action.likeId, action.blog, action.user);
        newLikes = oldLikes.concat(newLike);
      }
      return {
        ...state,
        blogsLikes: newLikes,
      };
  }
  return state;
};

export default blogLikesReducer;
