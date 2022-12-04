/* eslint-disable no-unreachable */

import BlogLike from "../../models/BlogLike";
export const READ_BLOGS_LIKES = "READ_BLOGS_LIKES";
export const CREATE_LIKE = "CREATE_LIKE";
export const DELETE_BLOG = "DELETE_BLOG";
export const EDIT_BLOG = "EDIT_BLOG";

export const fetchLikes = (authToken) => {
  try {
    return async (dispatch, getState) => {
      //  var token = getState().auth.token;
      const response = await fetch(`http://127.0.0.1:8000/api/likes/`, {
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

      var blogLikes = [];
      for (const key in resData) {
        blogLikes.push(
          new BlogLike(
            resData[key].id,
            resData[key].blog_item,
            resData[key].user
          )
        );
      }

      dispatch({
        type: READ_BLOGS_LIKES,
        blogLikes: blogLikes,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const createLike = (authToken, blogItemId, userId) => {
  try {
    return async (dispatch, getState) => {
      //  var token = getState().auth.token;
      const response = await fetch(`http://127.0.0.1:8000/api/likes/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.access}`,
        },
        body: JSON.stringify({ blog_item: blogItemId }),
      });

      if (!response.ok) {
        console.log(await response.json());
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();

      dispatch({
        type: CREATE_LIKE,
        blog: blogItemId,
        user: userId,
        likeId: resData.like_id,
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
