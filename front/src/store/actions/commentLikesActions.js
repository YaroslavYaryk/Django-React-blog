/* eslint-disable no-unreachable */

export const CREATE_LIKE = "CREATE_LIKE";
export const READ_COMMENT_LIKES = "READ_COMMENT_LIKES";
export const DELETE_BLOG = "DELETE_BLOG";
export const EDIT_BLOG = "EDIT_BLOG";

export const fetchCommentLikes = (authToken, blogId) => {
  try {
    return async (dispatch, getState) => {
      //  var token = getState().auth.token;
      const response = await fetch(
        "http://127.0.0.1:8000/api/comments/likes/" + blogId,
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
        type: READ_COMMENT_LIKES,
        commentLikes: resData,
      });
    };
  } catch (err) {
    throw err;
  }
};

export const createLike = (authToken, commentId, userId) => {
  try {
    return async (dispatch, getState) => {
      //  var token = getState().auth.token;
      const response = await fetch(
        `http://127.0.0.1:8000/api/comments/likes/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken.access}`,
          },
          body: JSON.stringify({ comment_blog_item: commentId }),
        }
      );

      if (!response.ok) {
        console.log(await response.json());
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();

      dispatch({
        type: CREATE_LIKE,
        likeId: resData.like_id,
        comment: commentId,
        user: userId,
      });
    };
  } catch (err) {
    throw err;
  }
};

// export const deleteBlog = (authToken, id) => {
//   try {
//     return async (dispatch, getState) => {
//       //  var token = getState().auth.token;
//       const response = await fetch(`http://localhost:8000/api/delete/${id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken.access}`,
//         },
//       });

//       if (!response.ok) {
//         console.log(await response.json());
//         throw new Error("Something went wrong!");
//       }

//       dispatch({
//         type: DELETE_BLOG,
//         id: id,
//       });
//     };
//   } catch (err) {
//     throw err;
//   }
// };

// export const editBlog = (authToken, blog, id) => {
//   try {
//     return async (dispatch, getState) => {
//       //  var token = getState().auth.token;
//       const response = await fetch(`http://localhost:8000/api/update/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken.access}`,
//         },
//         body: JSON.stringify(blog),
//       });

//       if (!response.ok) {
//         console.log(await response.json());
//         throw new Error("Something went wrong!");
//       }

//       dispatch({
//         type: EDIT_BLOG,
//         blog: blog,
//         id: id,
//       });
//     };
//   } catch (err) {
//     throw err;
//   }
// };
