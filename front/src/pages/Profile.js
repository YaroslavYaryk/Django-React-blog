/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import AuthContext from "../context/AuthContext";
import { useHistory } from "react-router-dom";
import { useEffect, useState, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import * as blogActions from "../store/actions/blogActions";
import * as userBlogsActions from "../store/actions/userBlogsActions";
import * as blogsLikesActions from "../store/actions/blogLikesActions";

const Profile = () => {
  let { user, authToken } = useContext(AuthContext);

  const likes = useSelector((state) => state.blogsLikes.blogsLikes);

  const history = useHistory();

  const dispatch = useDispatch();

  const [query, setQuery] = useState(null);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState("");

  const userBlogs = useSelector((state) => state.userBlogs.userBlogs);

  const loadBlogs = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(userBlogsActions.fetchUserBlogs(authToken));
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    }
    setIsLoading(false);
  }, [authToken, dispatch]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs, query]);

  const loadLikes = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(blogsLikesActions.fetchLikes(authToken));
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    }
    setIsLoading(false);
  }, [authToken, dispatch]);

  useEffect(() => {
    loadLikes();
  }, [loadLikes]);

  const handledelete = useCallback(
    async (blog) => {
      setError(null);
      setIsLoading(true);
      try {
        dispatch(blogActions.deleteBlog(authToken, blog.id));
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
      setIsLoading(false);
      setQuery(Math.random() + Math.random() + Math.random());
      //   history.goBack();
    },
    [dispatch, authToken]
  );

  return (
    <div className="blog-list">
      <h1 className="profile_title">{user.username} profile</h1>
      {userBlogs &&
        userBlogs.map((blog) => (
          <div key={blog.id} className="body">
            <h2>{blog.title}</h2>
            <br />
            <div>{blog.body}</div>
            <br />
            <p>Written by {blog.author.username}</p>
            <br />
            <div className="block__bottom">
              {!isLoading && (
                <button
                  className="btn__update del-post"
                  onClick={() => handledelete(blog)}
                >
                  Delete blog
                </button>
              )}
              {isLoading && (
                <button className="btn__update del-post">
                  Deleting blog...
                </button>
              )}
              <Link className="btn__update" to={`/update/${blog.id}`}>
                Update Blog
              </Link>
              <div className="blog__right">
                <a
                  className="liked-button"
                  id="like-button"
                  data-item="05"
                  value={blog.id}
                >
                  <p>💚</p>
                  <span className="count-like" id="likecCount">
                    {likes &&
                      likes.filter((like) => like.blog_item === blog.id).length}
                  </span>
                </a>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Profile;
