import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import ReduxThunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { combineReducers, applyMiddleware } from "redux";
import blogReducer from "./store/reducers/blogReducer";
import useBlogsReducer from "./store/reducers/userBlogsReducer";
import blogLikesReducer from "./store/reducers/blogLikesReducer";
import blogCommentReducer from "./store/reducers/blogCommentsReducer";
import commentLikesReducer from "./store/reducers/commentLikesReducer";

const rootReducer = combineReducers({
  blogs: blogReducer,
  userBlogs: useBlogsReducer,
  blogsLikes: blogLikesReducer,
  comments: blogCommentReducer,
  commentLikes: commentLikesReducer,
});

const store = configureStore(
  {
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),
  },
  applyMiddleware(ReduxThunk)
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
