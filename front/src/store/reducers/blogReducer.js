/* eslint-disable no-redeclare */
import {
  READ_BLOGS,
  CREATE_BLOG,
  DELETE_BLOG,
  EDIT_BLOG,
} from "../actions/blogActions";

const initialState = {
  blogs: [],
};

const blogReducer = (state = initialState, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case READ_BLOGS:
      return {
        ...state,
        blogs: action.blogs,
      };
    case CREATE_BLOG:
      return {
        ...state,
        blogs: state.blogs.push(action.blogs),
      };
    case DELETE_BLOG:
      return {
        ...state,
        blogs: state.blogs.filter((el) => el.id !== parseInt(action.id)),
      };
    case EDIT_BLOG:
      var oldBblogs = [...state.blogs];
      var index = oldBblogs.findIndex((el) => el.id === parseInt(action.id));
      var blog = oldBblogs[index];
      blog.title = action.blog.title;
      blog.body = action.blog.title;
      oldBblogs[index] = blog;

      return {
        ...state,
        blogs: oldBblogs,
      };
  }
  return state;
};

export default blogReducer;
