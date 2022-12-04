import React, { useState, useEffect, useCallback } from "react";
import BlogList from "../components/home/BligList";
import useFetch from "../hooks/useFetch";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import * as blogActions from "../store/actions/blogActions";
import * as blogLikesActions from "../store/actions/blogLikesActions";

const Home = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState("");

  const dispatch = useDispatch();
  let { logoutUser, authToken, user } = useContext(AuthContext);

  var blogs = useSelector((state) => state.blogs.blogs);
  const likes = useSelector((state) => state.blogsLikes.blogsLikes);

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
  }, [authToken, dispatch]);

  useEffect(() => {
    loadLikes();
  }, [loadLikes]);

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

  // useEffect(() => {
  // 	window.addEventListener("resize", updateWindowWidth);
  // }, [])

  // const updateWindowWidth = () => {
  // 	setWindowWith(window.innerWidth);
  // }

  // const handleDelete = (id) => {
  // 	setBlogs(data.filter((blog) => blog.id !== id));
  // }

  try {
    return (
      <div className="home">
        {/* <h1>windowWith: {windowWith}</h1> */}
        {isLoading && <div>Loading...</div>}
        {blogs.length ? (
          <BlogList
            blogs={blogs}
            likes={likes}
            likeBlog={likeBlog}
            title="All Blogs:"
          />
        ) : (
          <div className="block">Empty</div>
        )}
        {/* <BlogList blogs={blogs.filter((blog) => blog.author === "mario")} title="Mario's blogs" /> */}
      </div>
    );
  } catch (e) {
    logoutUser();
  }
};

export default Home;
