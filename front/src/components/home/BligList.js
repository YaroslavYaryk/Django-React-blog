/* eslint-disable jsx-a11y/anchor-is-valid */
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import axios from "axios";

const BlogList = ({ blogs, title, handleDelete, likes, likeBlog }) => {
  const { authToken, user } = useContext(AuthContext);

  return (
    <div className="blog-list">
      <h2>{title}</h2>
      {blogs.map((blog) => (
        <div className="blog-preview blog__list" key={blog.title}>
          <div className="block__left">
            <Link to={`/blogs/${blog.id}`}>
              <h2>{blog.title}</h2>
            </Link>
            {/* <p>{blog.body}</p> */}
            <p>Written by {blog.author.username}</p>
          </div>
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
                {likes && likes.filter((like) => like.blog === blog.id).length}
              </span>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
