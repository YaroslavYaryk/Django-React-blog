/* eslint-disable no-unreachable */

export const READ_BLOG_COMMENTS = "READ_BLOG_COMMENTS";
export const CREATE_COMMENT = "CREATE_COMMENT";
export const CREATE_COMMENT_REPLY = "CREATE_COMMENT_REPLY";
export const DELETE_COMMENT = "DELETE_COMMENT";
export const EDIT_COMMENT = "EDIT_COMMENT";

export const fetchBlogComments = (authToken, blogId) => {
  try {
    return async (dispatch, getState) => {
      //  var token = getState().auth.token;
      const response = await fetch(
        "http://127.0.0.1:8000/api/blog/" + blogId + "/comments/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken.access}`,
          },
        }
      );

      if (!response.ok) {
        console.log(await response.json());
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();

      dispatch({
        type: READ_BLOG_COMMENTS,
        comments: resData,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const createComment = (authToken, reqBody) => {
  try {
    return async (dispatch, getState) => {
      //  var token = getState().auth.token;
      const response = await fetch(
        `http://127.0.0.1:8000/api/blog/comment/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken.access}`,
          },
          body: JSON.stringify(reqBody),
        }
      );

      if (!response.ok) {
        console.log(await response.json());
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      console.log(resData);
      dispatch({
        type: CREATE_COMMENT,
        comment: resData,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const createCommentReply = (authToken, commentId, reqBody) => {
  try {
    return async (dispatch, getState) => {
      //  var token = getState().auth.token;
      const response = await fetch(
        "http://127.0.0.1:8000/api/blog/comment/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken.access}`,
          },
          body: JSON.stringify(reqBody),
        }
      );

      if (!response.ok) {
        console.log(await response.json());
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();

      const comment = {
        id: resData.id,
        user_id: resData.user,
        blog_item_id: resData.blog_item,
        blog_body: resData.blog_body,
        parent_id: resData.parent,
        username: resData.username,
      };

      console.log(resData, "from action");
      dispatch({
        type: CREATE_COMMENT_REPLY,
        comment: comment,
        parent: commentId,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const deleteComment = (authToken, commentId, parent) => {
  try {
    return async (dispatch, getState) => {
      //  var token = getState().auth.token;
      const response = await fetch(
        "http://localhost:8000/api/comment/" + commentId + "/delete/",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken.access}`,
          },
        }
      );

      if (!response.ok) {
        console.log(await response.json());
        throw new Error("Something went wrong!");
      }

      dispatch({
        type: DELETE_COMMENT,
        id: commentId,
        parent: parent,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const editComment = (authToken, commentId, body, parent) => {
  try {
    return async (dispatch, getState) => {
      //  var token = getState().auth.token;
      const response = await fetch(
        "http://localhost:8000/api/comment/" + commentId + "/update/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken.access}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        console.log(await response.json());
        throw new Error("Something went wrong!");
      }
      const resData = await response.json();

      dispatch({
        type: EDIT_COMMENT,
        comment: resData,
        commentId: commentId,
        parent: parent,
      });
    };
  } catch (err) {
    throw err;
  }
};
