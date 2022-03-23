import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useHistory } from 'react-router-dom';
import useFetch from "../hooks/useFetch"
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext"


const UpdateBlog = ({ }) => {

	const { id } = useParams();
	const { authToken, user } = useContext(AuthContext);

	const { data: blog, isPending } = useFetch('http://127.0.0.1:8000/api/blogs/' + id);
	console.log(blog)
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [isPending2, setIsPending2] = useState(false);
	const [author, setAuthor] = useState('');


	useEffect(() => {
		if (blog) {
			setTitle(blog.title);
			setBody(blog.body);
			setAuthor(blog.author.name);
		}
	}, [blog])

	const { data: authors, isPending: somt } = useFetch("http://localhost:8000/api/authors/");

	const history = useHistory();

	const handleSubmit = (e) => {

		const authorId = authors.find(a => a.name === author).id;

		const blogs = { title: title, body: body, author: authorId }

		console.log(blogs)
		setIsPending2(true);

		axios.put("http://localhost:8000/api/update/" + id, blogs, {
			headers: {
				Authorization: `Bearer ${authToken.access}`
			}
		})
			.then(() => {
				setIsPending2(false)
				history.push("/")

			})
		e.preventDefault();
	}

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
				<label>Blog author:</label>
				<select
					value={author}
					onChange={(e) => setAuthor(e.target.value)}
				>
					{authors && authors.map((author) => (
						<option value={author.name}>{author.name}</option>
					))}
				</select>
				{isPending2 && <div>Updating blog</div>}
				{!isPending2 && <button>Update Blog</button>}

			</form>
		</div>
	);
}

export default UpdateBlog;