import AuthContext from "../context/AuthContext"
import { useContext } from "react";
import axios from "axios";
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch"



const Profile = () => {

	let { user, authToken } = useContext(AuthContext);

	const [likes, setLikes] = useState(() => { })

	const history = useHistory()


	const { data: blogs, isPending } = useFetch("http://localhost:8000/api/user/blogs/");
	const [isPending2, setIsPending2] = useState(true)


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


	const handledelete = (blog) => {

		setIsPending2(true);
		axios.delete("http://localhost:8000/api/delete/" + blog.id, {
			headers: {
				Authorization: `Bearer ${authToken.access}`
			}
		})
			.then(() => {
				setIsPending2(false)
				history.goBack()
			})
	}

	return (
		<div className="blog-list">

			<h1 className="profile_title">{user.username} profile</h1>
			{blogs && blogs.map(blog => (
				<div className="body">
					<h2>{blog.title}</h2>
					<br />
					<div>{blog.body}</div>
					<br />
					<p>Written by {blog.author.username}</p>
					<br />
					<div className="block__bottom">
						{!isPending && <button className="btn__update del-post" onClick={() => (handledelete(blog))}>Delete blog</button>}
						{isPending && <button className="btn__update del-post">Deleting blog...</button>}
						<Link className="btn__update" to={`/update/${blog.id}`}>Update Blog</Link>
						<div className="blog__right">
							<a className="liked-button" id="like-button" data-item="05" value={blog.id}>
								<p>💚</p>
								<span className="count-like" id="likecCount">{likes && (likes.filter((like) => like.blog_item === blog.id)).length}</span>
							</a>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

export default Profile;