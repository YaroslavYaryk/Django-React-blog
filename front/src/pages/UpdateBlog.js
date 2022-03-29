import { useState, useEffect, useContext } from "react";
import axios from "axios";
import useFetch from "../hooks/useFetch"
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext"
import { useHistory } from 'react-router-dom';


const UpdateBlog = ({ }) => {

	const { id } = useParams();
	const { authToken, user } = useContext(AuthContext);

	const { data: blog, isPending } = useFetch('http://127.0.0.1:8000/api/blogs/' + id);
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [isPending2, setIsPending2] = useState(false);


	useEffect(() => {
		if (blog) {
			setTitle(blog.title);
			setBody(blog.body);
		}
	}, [blog])

	const history = useHistory();

	const handleSubmit = (e) => {

		const blogs = { title: title, body: body }

		setIsPending2(true);

		axios.put("http://localhost:8000/api/update/" + id, blogs, {
			headers: {
				Authorization: `Bearer ${authToken.access}`
			}
		})
			.then(() => {
				setIsPending2(false)

				history.goBack()

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

				{isPending2 && <div>Updating blog</div>}
				{!isPending2 && <button>Update Blog</button>}

			</form>
		</div>
	);
}

export default UpdateBlog;