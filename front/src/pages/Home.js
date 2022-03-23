import BlogList from "../components/home/BligList";
import useFetch from "../hooks/useFetch"
import { useContext } from "react";
import AuthContext from "../context/AuthContext";


const Home = () => {

	const { data: blogs, isPending } = useFetch("http://localhost:8000/api/blogs/")

	let { logoutUser } = useContext(AuthContext);


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
				{isPending && <div>Loading...</div>}
				{blogs && <BlogList blogs={blogs} title="All Blogs:" />}
				{/* <BlogList blogs={blogs.filter((blog) => blog.author === "mario")} title="Mario's blogs" /> */}
			</div>
		);
	} catch (e) {
		logoutUser()
	}

}

export default Home;