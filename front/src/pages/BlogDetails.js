import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch"
import axios from "axios";
import { useHistory } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";


const BlogDetails = () => {
	const { id } = useParams();

	const { data: blog, isPending } = useFetch("http://localhost:8000/api/blogs/" + id);
	const [isPending2, setIsPending2] = useState(false);
	const history = useHistory();

	const { authToken, user } = useContext(AuthContext);
	const [likes, setLikes] = useState(() => { })

	const [body, setBody] = useState('');
	const [editBody, setEditBody] = useState('');
	const [commentReplyBody, setCommentReplyBody] = useState('');



	const [commentEdit, setCommentEdit] = useState()

	const [commentReply, setCommentReply] = useState();

	async function getAllLikes() {

		let response = await fetch('http://127.0.0.1:8000/api/likes/', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				"Authorization": `Bearer ${authToken.access}`
			}
		})
		let data = await response.json()

		setLikes(data)

	}

	useEffect(() => {
		getAllLikes()
	}, [])

	async function likeBlog(e, blogItemId) {

		const elem = e.target.closest('.liked-button')

		const res = await axios.post("http://127.0.0.1:8000/api/likes/create/",
			{ blog_item: blogItemId }, {
			headers: {
				"Authorization": `Bearer ${authToken.access}`
			}
		})

		let likes;

		if (res.status === 201) {
			const res = await axios.get(`http://127.0.0.1:8000/api/likes/${blogItemId}`,
				{
					headers: {
						"Authorization": `Bearer ${authToken.access}`
					}
				})
			if (res.status === 200) {
				likes = res.data.length;
			}

		} else {
			console.log(res.status)
			alert("Something went wrong")
		}

		const response = await axios.get(`http://127.0.0.1:8000/api/user_blog_like/${blogItemId}`,
			{
				headers: {
					"Authorization": `Bearer ${authToken.access}`
				}
			})
		if (response.status === 200) {
			elem.childNodes[1].innerText = likes;
			if (!response.data.result) {
				elem.childNodes[0].innerHTML = "<p>&#x1f90d;</p>"
			} else {
				elem.childNodes[0].innerHTML = "<p>&#10084;&#65039;</p>"
			}
		}
	}


	const handledelete = () => {

		setIsPending2(true);
		axios.delete("http://localhost:8000/api/delete/" + blog.id, {
			headers: {
				Authorization: `Bearer ${authToken.access}`
			}
		})
			.then(() => {
				setIsPending2(false)
				history.push("/");
			})
	}


	const [blogComments, setBlogComments] = useState()

	useEffect(() => {

		axios
			.get('http://127.0.0.1:8000/api/blog/' + id + "/comments/", {
				headers: {
					Authorization: `Bearer ${authToken.access}` //the token is a variable which holds the token
				}
			})
			.then((res) => {
				if (!res.status === 200) {
					throw new Error("Could not fetch data");
				} else {
					const data = res.data
					setBlogComments(data)
				}
			})

	}, [blogComments]);


	async function commentBlog(e) {
		e.preventDefault()
		const res = await axios.post(`http://127.0.0.1:8000/api/blog/comment/create/`,
			{ blog_item: id, blog_body: body }, {
			headers: {
				"Authorization": `Bearer ${authToken.access}`
			}
		})
		if (res.status === 201) {
			setBlogComments(res.data)
		}
		e.target.commentBlog.value = ""
	}


	const [commentsLikes, setCommentsLikes] = useState()

	async function getAllCommentsLikes() {

		let response = await fetch('http://127.0.0.1:8000/api/comments/likes/' + id, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				"Authorization": `Bearer ${authToken.access}`
			}
		})
		if (response.status === 200) {
			let data = await response.json()
			setCommentsLikes(data)
		}

	}

	useEffect(() => {
		getAllCommentsLikes()
	}, [])


	async function likeCommentBlog(e, commentId) {

		const elem = e.target.closest('.comment-liked-button')

		const res = await axios.post("http://127.0.0.1:8000/api/comments/likes/create/",
			{ comment_blog_item: commentId }, {
			headers: {
				"Authorization": `Bearer ${authToken.access}`
			}
		})

		let likes;
		if (res.status === 201) {
			const res = await axios.get(`http://127.0.0.1:8000/api/comments/likes/${id}`,
				{
					headers: {
						"Authorization": `Bearer ${authToken.access}`
					}
				})
			if (res.status === 200) {
				likes = res.data.filter((like) => like.comment_blog_item === commentId).length;

			}

		} else {
			console.log(res.status)
			alert("Something went wrong")
		}

		const response = await axios.get(`http://127.0.0.1:8000/api/comment_blog_like/${commentId}`,
			{
				headers: {
					"Authorization": `Bearer ${authToken.access}`
				}
			})
		if (response.status === 200) {
			elem.childNodes[1].innerText = likes;
			if (!response.data.result) {
				elem.childNodes[0].innerHTML = "<p>&#x1f90d;</p>"
			} else {
				elem.childNodes[0].innerHTML = "<p>&#10084;&#65039;</p>"
			}
		}
	}

	const editComment = (e, commentId) => {

		// const comment = blogComments.find(comment => comment.id === commentId)

		let comment = "";

		for (let i = 0; blogComments.length; i++) {
			if (blogComments[i].id == commentId) {
				comment = blogComments[i]

			}
			if (blogComments[i].children_comments.length) {
				for (let j = 0; j < blogComments[i].children_comments.length; j++) {
					console.log(blogComments[i].children_comments[j].id === commentId)
					if (blogComments[i].children_comments[j].id === commentId) {
						comment = blogComments[i].children_comments[j]
					}
				}

			}
			setCommentEdit(commentId)
			setEditBody(comment.blog_body)

			e.preventDefault()
		}
	}

	const updateCommentHandle = (e, commentId) => {
		const updatedData = {
			"blog_item": id,
			"blog_body": editBody,
		}

		axios.put("http://localhost:8000/api/comment/" + commentId + "/update/", updatedData, {
			headers: {
				Authorization: `Bearer ${authToken.access}`
			}
		})
			.then(() => {

				setCommentEdit(-1)

			})
		e.preventDefault();
	}

	const replyComment = (e, replyToCommentId) => {
		setCommentReply(replyToCommentId.id)
	}


	const createReplyCommentHandle = (e, commentId) => {
		const data = {
			blog_item: id,
			blog_body: commentReplyBody,
			parent: commentId
		}

		axios.post("http://127.0.0.1:8000/api/blog/comment/create/", data, {
			headers: {
				Authorization: `Bearer ${authToken.access}`
			}
		})
			.then(() => {

				setCommentReply(-1)

			})
		e.preventDefault();
	}

	const handleDeleteComment = (e, commentId) => {
		axios.delete("http://localhost:8000/api/comment/" + commentId + "/delete/", {
			headers: {
				Authorization: `Bearer ${authToken.access}`
			}
		})

		e.preventDefault()
	}


	return (
		<div className="blog-details">
			{isPending && <div>Loading...</div>}
			{blog && (
				<article>
					<h2>{blog.title}</h2>
					<p>Written by {blog.author.name}</p>
					<div>{blog.body}</div>
					<div className="block__bottom">
						{!isPending2 && <button className="btn__update del-post" onClick={handledelete}>Delete blog</button>}
						{isPending2 && <button className="btn__update del-post">Deleting blog...</button>}
						<Link className="btn__update" to={`/update/${blog.id}`}>Update Blog</Link>
						<div className="blog__right">
							<a onClick={(e) => likeBlog(e, blog.id)} className="liked-button" id="like-button" data-item="05" value={blog.id}>
								{
									likes && (likes.filter((like) => like.user === user.user_id && like.blog_item === blog.id)).length
										? <p>&#10084;&#65039;</p> : <p>&#x1f90d;</p>
								}
								<span className="count-like" id="likecCount">{likes && (likes.filter((like) => like.blog_item === blog.id)).length}</span>
							</a>
						</div>
					</div>
				</article>
			)
			}
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
				<h4>Other comments</h4>
				{blogComments && blogComments.map(comment => (
					<div className="comment">
						{comment.id !== commentEdit ? (
							<div className="comment-ad-replies">
								<div className="comment__stuff">
									<div className="user-comment">
										<h5>{comment.username}</h5>
										<p>{comment.blog_body}</p>
									</div>

									<div className="comment-update-block">
										{comment.user === user.user_id ? (
											<button onClick={(e) => editComment(e, comment.id)} className="btn__update-comment">Edit</button>
										) : ""}
									</div>
									<div className="comment-reply-block">
										<button onClick={(e) => replyComment(e, comment)} className="btn__reply-comment">Reply</button>
									</div>
									<a onClick={(e) => likeCommentBlog(e, comment.id)} className="comment-liked-button" id="like-button" data-item="05" value={blog.id}>
										{
											commentsLikes && (commentsLikes.filter((commentLike) => commentLike.user === user.user_id && commentLike.comment_blog_item === comment.id)).length
												? <p>&#10084;&#65039;</p> : <p>&#x1f90d;</p>
										}
										<span className="comment-count-like" id="likecCount">{commentsLikes && (commentsLikes.filter((commentLike) => commentLike.user === user.user_id && commentLike.comment_blog_item === comment.id)).length}</span>
									</a>
									{comment.user === user.user_id ? <a onClick={(e) => (handleDeleteComment(e, comment.id))} className="delete-comment">&times;</a> : ""}
								</div>

								{commentReply === comment.id ?
									(
										< form onSubmit={(e) => { createReplyCommentHandle(e, comment.id) }} className="form-edit-comment" >
											<textarea
												className="comment-input"
												name="" id="" cols="30" rows="5"
												value={commentReplyBody}
												onChange={(e) => setCommentReplyBody(e.target.value)}>

											</textarea>
											<button type="submit" className="btn__update-comment-edit">Reply</button>
										</form>
									) : ""}

							</div>
						) : (
							<div>
								< form onSubmit={(e) => { updateCommentHandle(e, comment.id) }} className="form-edit-comment" >
									<textarea
										className="comment-input"
										name="" id="" cols="30" rows="5"
										value={editBody}
										onChange={(e) => setEditBody(e.target.value)}>

									</textarea>
									<button type="submit" className="btn__update-comment-edit">update</button>
								</form>
							</div>
						)}
						{comment.children_comments.length ? <p className="comment-reply-title">Replies for "{comment.blog_body.slice(0, 50)}..."</p> : ""}
						{comment.children_comments && comment.children_comments.map(child => (
							<div className="comment-reply-stuff-block">
								{child.id !== commentEdit ? (
									<div className="comment__stuff-reply">
										<div className="user-comment-reply">
											<h5>{child.username}</h5>
											<p>{child.blog_body}</p>
										</div>
										<div className="comment-update-block">
											{child.user_id === user.user_id ? (
												<button onClick={(e) => editComment(e, child.id)} className="btn__update-comment">Edit</button>
											) : ""}
										</div>
										<a onClick={(e) => likeCommentBlog(e, child.id)} className="comment-liked-button" id="like-button" data-item="05" value={blog.id}>
											{
												commentsLikes && (commentsLikes.filter((commentLike) => commentLike.user === user.user_id && commentLike.comment_blog_item === child.id)).length
													? <p>&#10084;&#65039;</p> : <p>&#x1f90d;</p>
											}
											<span className="comment-count-like" id="likecCount">{commentsLikes && (commentsLikes.filter((commentLike) => commentLike.user === user.user_id && commentLike.comment_blog_item === child.id)).length}</span>
										</a>
										{child.user_id === user.user_id ? <a onClick={(e) => (handleDeleteComment(e, child.id))} className="delete-comment-reply">&times;</a> : ""}

									</div>
								) : (
									<div>
										< form onSubmit={(e) => { updateCommentHandle(e, child.id) }} className="form-edit-comment" >
											<textarea
												className="comment-input"
												name="" id="" cols="30" rows="5"
												value={editBody}
												onChange={(e) => setEditBody(e.target.value)}>

											</textarea>
											<button type="submit" className="btn__update-comment-edit">update</button>
										</form>
									</div>

								)}
							</div>

						))}
					</div>
				))}
			</div>
		</div >
	);
}

export default BlogDetails;