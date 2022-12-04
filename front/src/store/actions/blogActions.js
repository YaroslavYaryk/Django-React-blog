/* eslint-disable no-unreachable */

import Blog from "../../models/Blog";
export const READ_BLOGS = "READ_BLOGS";
export const CREATE_BLOG = "CREATE_BLOG";
export const DELETE_BLOG = "DELETE_BLOG";
export const EDIT_BLOG = "EDIT_BLOG";

export const fetchConversations = (authToken) => {
  try {
    return async (dispatch, getState) => {
      //  var token = getState().auth.token;
      const response = await fetch(`http://localhost:8000/api/blogs/`, {
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
        type: READ_BLOGS,
        blogs: blogs,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const createBlog = (authToken, blog) => {
  try {
    return async (dispatch, getState) => {
      //  var token = getState().auth.token;
      const response = await fetch(`http://localhost:8000/api/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.access}`,
        },
        body: JSON.stringify(blog),
      });

      if (!response.ok) {
        console.log(await response.json());
        throw new Error("Something went wrong!");
      }

      dispatch({
        type: CREATE_BLOG,
        blog: blog,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const deleteBlog = (authToken, id) => {
  try {
    return async (dispatch, getState) => {
      //  var token = getState().auth.token;
      const response = await fetch(`http://localhost:8000/api/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.access}`,
        },
      });

      if (!response.ok) {
        console.log(await response.json());
        throw new Error("Something went wrong!");
      }

      dispatch({
        type: DELETE_BLOG,
        id: id,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const editBlog = (authToken, blog, id) => {
  try {
    return async (dispatch, getState) => {
      //  var token = getState().auth.token;
      const response = await fetch(`http://localhost:8000/api/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.access}`,
        },
        body: JSON.stringify(blog),
      });

      if (!response.ok) {
        console.log(await response.json());
        throw new Error("Something went wrong!");
      }

      dispatch({
        type: EDIT_BLOG,
        blog: blog,
        id: id,
      });
    };
  } catch (err) {
    throw err;
  }
};
