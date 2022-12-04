/* eslint-disable jsx-a11y/anchor-is-valid */
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useContext, useEffect, useState, useCallback } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as blogActions from "../store/actions/blogActions";
import * as blogLikesActions from "../store/actions/blogLikesActions";
import * as blogCommentsActions from "../store/actions/blogCommentsActions";
import * as commentLikesActions from "../store/actions/commentLikesActions";

const BlogDetails = () => {
  const { id } = useParams();
  var blog = useSelector((state) =>
    state.blogs.blogs.find((el) => el.id === parseInt(id))
  );

  const blogComments = useSelector((state) => state.comments.comments);

  const likes = useSelector((state) =>
    state.blogsLikes.blogsLikes.filter((el) => el.blog === parseInt(id))
  );

  const commentLikes = useSelector((state) => state.commentLikes.likes);

  const [isPending2, setIsPending2] = useState(false);
  const history = useHistory();

  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState("");

  const { authToken, user } = useContext(AuthContext);

  const [body, setBody] = useState("");
  const [editBody, setEditBody] = useState("");
  const [commentReplyBody, setCommentReplyBody] = useState("");
  const [query, setQuery] = useState(null);

  const [commentEdit, setCommentEdit] = useState();

  const [commentReply, setCommentReply] = useState();

  const loadConversations = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(blogActions.fetchConversations(authToken));
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadConversations();
    return () => {};
  }, []);

  const loadLikes = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(blogLikesActions.fetchLikes(authToken));
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadLikes();
    return () => {};
  }, []);

  const likeBlog = useCallback(
    async (e, blogItemId) => {
      e.preventDefault();

      setError(null);
      setIsLoading(true);
      try {
        await dispatch(
          blogLikesActions.createLike(authToken, blogItemId, user.user_id)
        );
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
      setIsLoading(false);
    },
    [dispatch, authToken, user.user_id]
  );

  const loadComments = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(blogCommentsActions.fetchBlogComments(authToken, id));
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadComments();
    return () => {};
  }, []);

  const loadCommentLikes = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(commentLikesActions.fetchCommentLikes(authToken, id));
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    }
    setIsLoading(false);
  }, [query]);

  useEffect(() => {
    loadCommentLikes();
    return () => {};
  }, [query]);

  const handledelete = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);
      setIsLoading(true);
      try {
        dispatch(blogActions.deleteBlog(authToken, id));
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
      setIsLoading(false);
      history.push("/");
    },
    [dispatch, history, authToken, id]
  );

  // const [blogComments, setBlogComments] = useState();

  const commentBlog = useCallback(
    async (e) => {
      e.preventDefault();
      const reqBody = { blog_item: id, blog_body: body };
      setError(null);
      setIsLoading(true);
      try {
        dispatch(blogCommentsActions.createComment(authToken, reqBody));
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
      setIsLoading(false);
      e.target.commentBlog.value = "";
    },
    [dispatch, authToken, id, body]
  );

  const [commentsLikes, setCommentsLikes] = useState();

  const likeCommentBlog = useCallback(
    async (e, commentId) => {
      e.preventDefault();
      setError(null);
      setIsLoading(true);
      try {
        dispatch(
          commentLikesActions.createLike(authToken, commentId, user.user_id)
        );
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
      setIsLoading(false);
    },
    [dispatch, authToken, user.user_id]
  );

  const editComment = (e, commentId) => {
    // const comment = blogComments.find(comment => comment.id === commentId)

    let comment = "";
    for (let i = 0; i < blogComments.length; i++) {
      if (blogComments[i].id == commentId) {
        comment = blogComments[i];
      }
      if (blogComments[i].children_comments.length) {
        for (let j = 0; j < blogComments[i].children_comments.length; j++) {
          if (blogComments[i].children_comments[j].id === commentId) {
            comment = blogComments[i].children_comments[j];
          }
        }
      }
      setCommentEdit(commentId);
      setEditBody(comment.blog_body);

      e.preventDefault();
    }
  };

  const updateCommentHandle = useCallback(
    async (e, commentId, parent) => {
      const updatedData = {
        blog_item: id,
        blog_body: editBody,
      };
      e.preventDefault();
      setError(null);
      setIsLoading(true);
      try {
        dispatch(
          blogCommentsActions.editComment(
            authToken,
            commentId,
            updatedData,
            parent
          )
        );
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
      setIsLoading(false);
      setCommentEdit(-1);
    },
    [dispatch, authToken, editBody, id]
  );

  const replyComment = (e, replyToCommentId) => {
    setCommentReply(replyToCommentId.id);
  };

  const createReplyCommentHandle = useCallback(
    async (e, commentId) => {
      const data = {
        blog_item: id,
        blog_body: commentReplyBody,
        parent: commentId,
      };
      e.preventDefault();
      setError(null);
      setIsLoading(true);
      try {
        dispatch(
          blogCommentsActions.createCommentReply(authToken, commentId, data)
        );
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
      setIsLoading(false);
      setCommentEdit(-1);
      setCommentReply(null);
      setCommentReplyBody("");
      // setQuery(Math.random() + Math.random() + Math.random());
    },
    [dispatch, authToken, commentReplyBody, id]
  );

  const handleDeleteComment = useCallback(
    async (e, commentId, reply) => {
      e.preventDefault();
      setError(null);
      setIsLoading(true);
      try {
        dispatch(
          blogCommentsActions.deleteComment(authToken, commentId, reply)
        );
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
      setIsLoading(false);
    },
    [dispatch, authToken]
  );

  return (
    <div className="blog-details">
      {isLoading && <div>Loading...</div>}
      {blog && (
        <article>
          <h2>{blog.title}</h2>
          <div className="blog_body">{blog.body}</div>
          <p>Written by {blog.author.username}</p>
          <div className="block__bottom">
            {!isPending2 && (
              <button className="btn__update del-post" onClick={handledelete}>
                Delete blog
              </button>
            )}
            {isPending2 && (
              <button className="btn__update del-post">Deleting blog...</button>
            )}
            <Link className="btn__update" to={`/update/${blog.id}`}>
              Update Blog
            </Link>
            <div className="blog__right">
              <a
                onClick={(e) => likeBlog(e, blog.id)}
                className="liked-button"
                id="like-button"
                data-item="05"
                value={blog.id}
              >
                {likes &&
                likes.filter(
                  (like) => like.user === user.user_id && like.blog === blog.id
                ).length ? (
                  <p>&#10084;&#65039;</p>
                ) : (
                  <p>&#x1f90d;</p>
                )}
                <span className="count-like" id="likecCount">
                  {likes &&
                    likes.filter((like) => like.blog === blog.id).length}
                </span>
              </a>
            </div>
          </div>
        </article>
      )}
      <h3>Leave a comment</h3>
      <div className="comment-block">
        <form onSubmit={commentBlog}>
          <textarea
            className="comment-input"
            name="commentBlog"
            onChange={(e) => setBody(e.target.value)}
          ></textarea>

          <button className="btn__update">Comment Blog</button>
        </form>
      </div>

      <div className="user-comments-block">
        {blog && blogComments && blogComments.length ? (
          <h4>Other comments</h4>
        ) : (
          ""
        )}
        {blog &&
          blogComments &&
          blogComments.map((comment) => (
            <div key={comment.id} className="comment">
              {comment.id !== commentEdit ? (
                <div className="comment-ad-replies">
                  <div className="comment__stuff">
                    <div className="user-comment">
                      <h5>{comment.username}</h5>
                      <p>{comment.blog_body}</p>
                    </div>

                    <div className="comment-update-block">
                      {comment.user === user.user_id ? (
                        <button
                          onClick={(e) => editComment(e, comment.id)}
                          className="btn__update-comment"
                        >
                          Edit
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="comment-reply-block">
                      <button
                        onClick={(e) => replyComment(e, comment)}
                        className="btn__reply-comment"
                      >
                        Reply
                      </button>
                    </div>
                    <a
                      onClick={(e) => likeCommentBlog(e, comment.id)}
                      className="comment-liked-button"
                      id="like-button"
                      data-item="05"
                      value={blog.id}
                    >
                      {commentLikes &&
                      commentLikes.filter(
                        (commentLike) =>
                          commentLike.user === user.user_id &&
                          commentLike.comment_blog_item === comment.id
                      ).length ? (
                        <p>&#10084;&#65039;</p>
                      ) : (
                        <p>&#x1f90d;</p>
                      )}
                      <span className="comment-count-like" id="likecCount">
                        {commentLikes &&
                          commentLikes.filter(
                            (commentLike) =>
                              commentLike.user === user.user_id &&
                              commentLike.comment_blog_item === comment.id
                          ).length}
                      </span>
                    </a>
                    {comment.user === user.user_id ? (
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={(e) =>
                          handleDeleteComment(e, comment.id, null)
                        }
                        className="delete-comment"
                      >
                        &times;
                      </a>
                    ) : (
                      ""
                    )}
                  </div>
                  {console.log(commentReplyBody)}
                  {commentReply === comment.id ? (
                    <form
                      style={{ position: "relative" }}
                      onSubmit={(e) => {
                        createReplyCommentHandle(e, comment.id);
                      }}
                      className="form-edit-comment"
                    >
                      <textarea
                        className="comment-input"
                        name=""
                        id=""
                        cols="30"
                        rows="5"
                        value={commentReplyBody}
                        onChange={(e) => setCommentReplyBody(e.target.value)}
                      ></textarea>
                      <button
                        type="submit"
                        className="btn__update-comment-edit"
                      >
                        Reply
                      </button>

                      <div
                        className=""
                        style={{ position: "absolute", top: -20, right: 2 }}
                      >
                        <a
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            setCommentReply(-1);
                            setCommentReplyBody("");
                          }}
                          className="delete-comment-reply"
                        >
                          &times;
                        </a>
                      </div>
                    </form>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                <div>
                  <form
                    onSubmit={(e) => {
                      updateCommentHandle(e, comment.id, null);
                    }}
                    className="form-edit-comment"
                  >
                    <textarea
                      className="comment-input"
                      name=""
                      id=""
                      cols="30"
                      rows="5"
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                    ></textarea>
                    <button type="submit" className="btn__update-comment-edit">
                      update
                    </button>
                  </form>
                </div>
              )}
              {comment.children_comments.length ? (
                <p className="comment-reply-title">
                  Replies for "{comment.blog_body.slice(0, 50)}..."
                </p>
              ) : (
                ""
              )}
              {comment.children_comments &&
                comment.children_comments.map((child) => (
                  <div key={child.id} className="comment-reply-stuff-block">
                    {child.id != commentEdit ? (
                      <div className="comment__stuff-reply">
                        <div className="user-comment-reply">
                          <h5>{child.username}</h5>
                          <p>{child.blog_body}</p>
                        </div>
                        <div className="comment-update-block">
                          {child.user_id === user.user_id ? (
                            <button
                              onClick={(e) => editComment(e, child.id)}
                              className="btn__update-comment"
                            >
                              Edit
                            </button>
                          ) : (
                            "edit"
                          )}
                        </div>
                        <a
                          onClick={(e) => likeCommentBlog(e, child.id)}
                          className="comment-liked-button"
                          id="like-button"
                          data-item="05"
                          value={blog.id}
                        >
                          {commentLikes &&
                          commentLikes.filter(
                            (commentLike) =>
                              commentLike.user === user.user_id &&
                              commentLike.comment_blog_item === child.id
                          ).length ? (
                            <p>&#10084;&#65039;</p>
                          ) : (
                            <p>&#x1f90d;</p>
                          )}
                          <span className="comment-count-like" id="likecCount">
                            {commentLikes &&
                              commentLikes.filter(
                                (commentLike) =>
                                  commentLike.user === user.user_id &&
                                  commentLike.comment_blog_item === child.id
                              ).length}
                          </span>
                        </a>
                        {child.user_id === user.user_id ? (
                          <a
                            style={{ cursor: "pointer" }}
                            onClick={(e) =>
                              handleDeleteComment(e, child.id, child.parent_id)
                            }
                            className="delete-comment-reply"
                          >
                            &times;
                          </a>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      <div>
                        <form
                          onSubmit={(e) => {
                            updateCommentHandle(e, child.id, child.parent_id);
                          }}
                          className="form-edit-comment"
                        >
                          <textarea
                            className="comment-input"
                            name=""
                            id=""
                            cols="30"
                            rows="5"
                            value={editBody}
                            onChange={(e) => setEditBody(e.target.value)}
                          ></textarea>
                          <button
                            type="submit"
                            className="btn__update-comment-edit"
                          >
                            update
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default BlogDetails;
