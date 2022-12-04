import { useState, useEffect, useContext, useCallback } from "react";

import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as blogActions from "../store/actions/blogActions";

const UpdateBlog = () => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const { authToken } = useContext(AuthContext);

  var blog = useSelector((state) =>
    state.blogs.blogs.find((el) => el.id === parseInt(id))
  );
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState("");

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setBody(blog.body);
    }
  }, [blog]);

  const history = useHistory();

  const handleSubmit = useCallback(
    async (e) => {
      const blog = { title: title, body: body };

      e.preventDefault();
      setError(null);
      setIsLoading(true);
      try {
        dispatch(blogActions.editBlog(authToken, blog, id));
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
      setIsLoading(false);
      history.push("/");
    },
    [dispatch, history, authToken, body, title, id]
  );

  return (
    <div className="create">
      <h2>Update current blog</h2>
      <form onSubmit={handleSubmit}>
        <label>Blog title:</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Blog body:</label>
        <textarea
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>

        {isLoading && <div>Updating blog</div>}
        {!isLoading && <button>Update Blog</button>}
      </form>
    </div>
  );
};

export default UpdateBlog;
