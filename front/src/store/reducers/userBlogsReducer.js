/* eslint-disable no-redeclare */
import { READ_USER_BLOGS } from "../actions/userBlogsActions";

const initialState = {
  userBlogs: [],
};

const useBlogsReducer = (state = initialState, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case READ_USER_BLOGS:
      return {
        ...state,
        userBlogs: action.blogs,
      };
  }
  return state;
};

export default useBlogsReducer;
