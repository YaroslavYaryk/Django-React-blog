import { useHistory } from "react-router-dom";
import { useContext, useState, useCallback } from "react";
import AuthContext from "../context/AuthContext";
import { useDispatch } from "react-redux";
import * as blogActions from "../store/actions/blogActions";

const Create = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState("");

  const { authToken } = useContext(AuthContext);

  const handleSubmit = useCallback(
    async (e) => {
      const blog = { title: title, body: body };

      e.preventDefault();
      setError(null);
      setIsLoading(true);
      try {
        dispatch(blogActions.createBlog(authToken, blog));
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
      setIsLoading(false);
      history.push("/");
    },
    [dispatch, history, authToken, body, title]
  );

  return (
    <div className="create">
      <h2>Add a New Blog</h2>
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

        {isLoading && <div>Adding blog</div>}
        {!isLoading && <button>Add Blog</button>}
      </form>
    </div>
  );
};

export default Create;
