import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import axios from "axios";


const BlogList = ({ blogs, title, handleDelete }) => {


	const { authToken, user } = useContext(AuthContext);
	const [likes, setLikes] = useState(() => { })

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

	return (
		<div className="blog-list">
			<h2>{title}</h2>
			{blogs.map(blog => (
				<div className="blog-preview blog__list" key={blog.title} >
					<div className="block__left">
						<Link to={`/blogs/${blog.id}`}><h2>{blog.title}</h2></Link>
						{/* <p>{blog.body}</p> */}
						<p>Written by {blog.author.username}</p>
					</div>
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

			))
			}
		</div >
	);
}

export default BlogList;