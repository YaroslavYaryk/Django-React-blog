import useFetch from "../hooks/useFetch"
import axios from "axios";
import { useHistory } from 'react-router-dom';
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";

const Create = () => {

	const history = useHistory();

	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [isPending2, setIsPending2] = useState(false);

	const { authToken, user } = useContext(AuthContext);


	const handleSubmit = (e) => {

		const blog = { title: title, body: body }

		setIsPending2(true);

		axios.post("http://localhost:8000/api/create/", blog, {
			headers: {
				"Authorization": `Bearer ${authToken.access}`
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

				{isPending2 && <div>Adding blog</div>}
				{!isPending2 && <button>Add Blog</button>}

			</form>
		</div>
	);
}

export default Create;