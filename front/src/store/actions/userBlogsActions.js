/* eslint-disable no-unreachable */

import Blog from "../../models/Blog";
export const READ_USER_BLOGS = "READ_USER_BLOGS";
export const CREATE_BLOG = "CREATE_BLOG";
export const DELETE_BLOG = "DELETE_BLOG";
export const EDIT_BLOG = "EDIT_BLOG";

export const fetchUserBlogs = (authToken) => {
  try {
    return async (dispatch, getState) => {
      //  var token = getState().auth.token;
      const response = await fetch(`http://localhost:8000/api/user/blogs/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.access}`,
        },
      });

      if (!response.ok) {
        console.log(await response.json());
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();

      var blogs = [];
      for (const key in resData) {
        blogs.push(
          new Blog(
            resData[key].id,
            resData[key].title,
            resData[key].body,
            resData[key].author
          )
        );
      }

      dispatch({
        type: READ_USER_BLOGS,
        blogs: blogs,
      });
    };
  } catch (err) {
    throw err;
  }
};
